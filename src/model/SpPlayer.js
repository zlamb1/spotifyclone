// wrapper class for Spotify.Player from Spotify Web Playback SDK

import SpRepeatMode from "./SpRepeatMode.js";
import {
    spotifySeekToPosition, spotifySetRepeatMode, spotifySetVolume,
    spotifySkipToNext, spotifySkipToPrevious,
    spotifyTogglePlayback, spotifyTogglePlaybackShuffle
} from "../composables/useSpotifyAPI.js";
import {fetchSpotifyAPI} from "../services/spotify_api.js";
import {queryPlayerState} from "../services/spotify_service.js";
import RepeatMode from "./SpSong.js";
import spRepeatMode from "./SpRepeatMode.js";

export default class SpPlayer {
    constructor() {
        this.ready = false;
        this.id = 0;
        this.playerAPI = null;

        this.useWebAPI = false;

        this.active = false;
        this.volume = 0.5;
        this.name = 'SpotifyLite';
        this.playing = false;
        this.elapsed = 0;
        this.currentlyPlaying = null;
        this.shuffle = false;
        this.repeatMode = SpRepeatMode.Off;

        this.debounceDuration = 0;
        this.debouncedProps = {};

        this.connect = async function() {
            if (this.playerAPI) {
                this.playerAPI.connect();
            } else {
                ConsoleWarn('connect');
            }
        }

        this.disconnect = async function() {
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                this.playerAPI.disconnect();
            } else {
                ConsoleWarn('disconnect');
            }
        }

        this.setName = async function(name) {
            this.name = name;
            this.debounceProp('name');
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.setName(name);
            } else {
                ConsoleWarn('setName');
            }
        }

        this.setVolume = async function(volume) {
            this.volume = volume;
            this.debounceProp('volume');
            if (this.useWebAPI) return this.callWebAPI(() => spotifySetVolume(Math.floor(volume.toFixed(2) * 100)));
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.setVolume(volume);
            } else {
                ConsoleWarn('setVolume');
            }
        }

        this.pause = async function() {
            this.playing = false;
            this.debounceProp('playing');
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.pause();
            } else {
                ConsoleWarn('pause');
            }
        }

        this.resume = async function() {
            this.playing = true;
            this.debounceProp('playing');
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.resume();
            } else {
                ConsoleWarn('resume');
            }
        }

        this.togglePlayer = async function() {
            this.playing = !this.playing;
            this.debounceProp('playing');
            if (this.useWebAPI) return this.callWebAPI(() => spotifyTogglePlayback(this.playing));
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.togglePlay();
            } else {
                ConsoleWarn('togglePlayer');
            }
        }

        this.seek = async function(position) {
            this.elapsed = position;
            this.debounceProp('elapsed')
            if (this.useWebAPI) return this.callWebAPI(() => spotifySeekToPosition(Math.floor(position)));
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.seek(position);
            } else {
                ConsoleWarn('seek');
            }
        }

        this.skip = async function() {
            // does not need to be debounced
            if (this.useWebAPI) return this.callWebAPI(() => spotifySkipToNext());
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.nextTrack();
            } else {
                ConsoleWarn('skipTrack');
            }
        }

        this.prev = async function() {
            // does not need to be debounced
            if (this.useWebAPI) return this.callWebAPI( () => spotifySkipToPrevious());
            if (this.playerAPI) {
                if (!this.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.previousTrack();
            } else {
                ConsoleWarn('previousTrack');
            }
        }

        // only usable through Web API
        this.toggleShuffle = async function() {
            this.shuffle = !this.shuffle;
            this.debounceProp('shuffle')
            return this.callWebAPI(() => spotifyTogglePlaybackShuffle(this.shuffle));
        }

        // only usable through Web API
        this.toggleRepeatMode = async function() {
            this.repeatMode = SpRepeatMode.NextMode(this.repeatMode);
            this.debounceProp('repeatMode');
            return this.callWebAPI(() => spotifySetRepeatMode(SpRepeatMode.ToString(this.repeatMode)));
        }

        this.setElapsedAsPercent = async function(percentage) {
            percentage = percentage ?? 0;
            if (this.currentlyPlaying) {
                const duration = this.currentlyPlaying.duration;
                // sanity-check percentage so that it is in range [0.0 - 1.0]
                // then seek to the new position
                this.elapsed = duration * Math.max(Math.min(percentage, 1), 0);
                return this.seek(this.elapsed);
            }
        }

        this.getElapsedAsPercent = function() {
            if (!this.ready || !this.currentlyPlaying) {
                return 0;
            }

            const duration = this.currentlyPlaying.duration;
            return this.elapsed / duration;
        }

        // query Web API after call to get updated state
        this.callWebAPI = async (func) => {
            const result = await func();
            if (result.ok) {
                setTimeout(async () => {
                    await queryPlayerState();
                }, 250);
            }
            return result;
        }

        this.isDebounced = (propName) => {
            return !!this.debouncedProps[propName];
        }

        this.debounceProp = (propName) => {
            // used to minimize desync between clients while using the Web API
            if (this.useWebAPI) {
                if (this.debouncedProps[propName]) {
                    clearTimeout(this.debouncedProps[propName]);
                }
                this.debouncedProps[propName] = setTimeout(() => {
                    this.debouncedProps[propName] = undefined;
                }, this.debounceDuration);
                return true;
            }
        }

        function ConsoleWarn(funcName) {
            console.warn(`[SpotifyService]: Function ${funcName} called on SpotifyPlayer with no valid Spotify API.`);
        }

        function ConsoleWarnNotReady() {
            console.warn('[SpotifyService]: The Spotify Player API is not yet ready.');
        }
    }
}
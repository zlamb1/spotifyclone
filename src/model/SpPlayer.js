// wrapper class for Spotify.Player from Spotify Web Playback SDK

export default class SpPlayer {
    constructor() {
        this.ready = false;
        this.id = 0;
        this.playerAPI = null;

        this.active = false;
        this.volume = 0.5;
        this.name = 'Custom Client';
        this.paused = false;
        this.elapsed = 0;
        this.currentTrack = null;
        this.shuffle = false;
        this.repeatMode = 0;

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
            this.paused = !this.paused;
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

        this.skipTrack = async function() {
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

        this.previousTrack = async function() {
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

        this.setElapsedAsPercent = async function(percentage) {
            percentage = percentage ?? 0;
            if (this.currentTrack) {
                const duration = this.currentTrack.duration;
                // sanity-check percentage so that it is in range [0.0 - 1.0]
                // then seek to the new position
                this.elapsed = duration * Math.max(Math.min(percentage, 1), 0);
                return this.seek(this.elapsed);
            }
        }

        this.getElapsedAsPercent = function() {
            if (!this.ready || !this.currentTrack) {
                return 0;
            }

            const duration = this.currentTrack.duration;
            return this.elapsed / duration;
        }

        function ConsoleWarn(func_name) {
            console.warn(`[SpotifyService]: Function ${func_name} called on SpotifyPlayer with no valid Spotify API.`);
        }

        function ConsoleWarnNotReady() {
            console.warn('[SpotifyService]: The Spotify Player API is not yet ready.');
        }
    }
}
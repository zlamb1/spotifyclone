// wrapper class for Spotify.Player from Spotify Web Playback SDK

export default class SpotifyPlayer {
    constructor() {
        this.ready = false;
        this.playerAPI = null;

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
                if (!this.playerAPI.ready) {
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
                if (!this.playerAPI.ready) {
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
                if (!this.playerAPI.ready) {
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
                if (!this.playerAPI.ready) {
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
                if (!this.playerAPI.ready) {
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
                if (!this.playerAPI.ready) {
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
                if (!this.playerAPI.ready) {
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
                if (!this.playerAPI.ready) {
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
                if (!this.playerAPI.ready) {
                    ConsoleWarnNotReady();
                    return;
                }
                return this.playerAPI.previousTrack();
            } else {
                ConsoleWarn('previousTrack');
            }
        }

        function ConsoleWarn(func_name) {
            console.warn(`[SpotifyService]: Function ${func_name} called on SpotifyPlayer with no valid Spotify API.`);
        }

        function ConsoleWarnNotReady() {
            console.warn('[SpotifyService]: The Spotify Player API is not yet ready.');
        }

        /**
         * @param state Spotify Web Playback SDK WebPlaybackState
         */
        function setState(state) {
            this.paused = state.paused;
            this.elapsed = state.position;
            this.repeatMode = state.repeat_mode;
            this.shuffle = state.shuffle;
            this.currentTrack = state.track_window.current_track;
        }

        function reset() {
            this.paused = false;
            this.elapsed = 0;
            this.currentTrack = null;
            this.shuffle = false;
            this.repeatMode = 0;
        }
    }
}
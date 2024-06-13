import {accessToken} from "./spotify_api.js";
import {reactive} from "vue";

// wrapper class for Spotify.Player
class SpotifyPlayer {
    constructor() {
        this.ready = false;

        this.volume = 0.5;
        this.name = 'Custom Client';
        this.paused = false;
        this.elapsed = 0;
        this.currentTrack = null;
        this.shuffle = false;
        this.repeatMode = 0;

        this.connect = async function() {
            if (this.playerApi) {
                this.playerApi.connect();
            } else {
                ConsoleWarn('connect');
            }
        }

        this.disconnect = async function() {
            if (this.playerApi) {
                this.playerApi.disconnect();
            } else {
                ConsoleWarn('disconnect');
            }
        }

        this.setName = async function(name) {
            this.name = name;
            if (this.playerApi) {
                return this.playerApi.setName(name);
            } else {
                ConsoleWarn('setName');
            }
        }

        this.setVolume = async function(volume) {
            this.volume = volume;
            if (this.playerApi) {
                return this.playerApi.setVolume(volume);
            } else {
                ConsoleWarn('setVolume');
            }
        }

        this.pause = async function() {
            if (this.playerApi) {
                return this.playerApi.pause();
            } else {
                ConsoleWarn('pause');
            }
        }

        this.resume = async function() {
            if (this.playerApi) {
                return this.playerApi.resume();
            } else {
                ConsoleWarn('resume');
            }
        }

        this.togglePlayer = async function() {
            this.paused = !this.paused;
            if (this.playerApi) {
                return this.playerApi.togglePlay();
            } else {
                ConsoleWarn('togglePlayer');
            }
        }

        this.seek = async function(position) {
            this.elapsed = position;
            if (this.playerApi) {
                return this.playerApi.seek(position);
            } else {
                ConsoleWarn('seek');
            }
        }

        this.skipTrack = async function() {
            if (this.playerApi) {
                return this.playerApi.nextTrack();
            } else {
                ConsoleWarn('skipTrack');
            }
        }

        this.previousTrack = async function() {
            if (this.playerApi) {
                return this.playerApi.previousTrack();
            } else {
                ConsoleWarn('previousTrack');
            }
        }

        function ConsoleWarn(func_name) {
            console.warn(`[SpotifyService]: Function ${func_name} called on SpotifyPlayer with no valid Spotify API.`);
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

const player = reactive(new SpotifyPlayer());

import 'https://sdk.scdn.co/spotify-player.js'
window.onSpotifyWebPlaybackSDKReady = () => {
    const token = '[My access token]';
    player.playerAPI = new Spotify.Player({
        name: player.name,
        getOAuthToken: cb => {
            cb(accessToken);
        },
        volume: player.volume,
    });

    player.playerAPI.addListener('ready', ({device_id}) => {
        player.ready = true;
    });

    player.playerAPI.addListener('unready', ({device_id}) => {
        player.ready = false;
        player.reset();
    });

    player.playerAPI.addListener('player_state_changed', (state) => {
        if (state) {
            player.setState(state);
        }
    });
}

// query Web Playback SDK as much as possible to avoid incurring API calls
const refreshInterval = 10;
setInterval(() => {
    if (player.playerAPI) {
        player.playerAPI.getCurrentState().then((state) => {
            if (state) {
                player.setState(state);
            }
        });

        player.playerAPI.getVolume().then((volume) => {
            if (volume) {
                player.volume = volume;
            }
        });
    }
}, refreshInterval);

export default player;
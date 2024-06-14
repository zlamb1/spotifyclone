import {accessToken, fetchSpotifyAPI} from "./spotify_api.js";
import {ref} from "vue";

import SpPlayer from "../model/SpPlayer.js";
import SpSong from "../model/SpSong.js";
import SpDevice from "../model/SpDevice.js";

const player = ref(new SpPlayer());
const activeDevice = ref(new SpDevice());
const spDevices = ref([]);

/**
 * @param player SpPlayer
 * @param state Spotify Web Playback SDK WebPlaybackState
 */
const setState = (player, state) => {
    player.value.paused = state.paused;
    player.value.elapsed = state.position;
    player.value.repeatMode = state.repeat_mode;
    player.value.shuffle = state.shuffle;
    player.value.currentTrack = SpSong.FromSpotifyAPI(state.track_window.current_track);
}

window.onSpotifyWebPlaybackSDKReady = () => {
    player.value.playerAPI = new Spotify.Player({
        name: player.value.name,
        getOAuthToken: cb => {
            cb(accessToken);
        },
        volume: player.value.volume,
    });

    player.value.playerAPI.addListener('ready', ({device_id}) => {
        player.value.id = device_id;
        player.value.ready = true;
    });

    player.value.playerAPI.addListener('not_ready', ({device_id}) => {
        player.value.ready = false;
    });

    player.value.playerAPI.addListener('player_state_changed', (state) => {
        if (state) {
            setState(player, state);
        }
    });

    player.value.connect();
}

const apiScript = document.createElement("script");
apiScript.src = 'https://sdk.scdn.co/spotify-player.js';
document.head.appendChild(apiScript);

// setup polling
const pollRate = 1000;

setInterval( () => {
    // api polling
    fetchSpotifyAPI({
        url: 'https://api.spotify.com/v1/me/player/devices'
    }).then(async (result) => {
        if (result.ok) {
            try {
                const { devices } = await result.json();
                spDevices.value = [];
                for (const device of devices) {
                    const spDevice = SpDevice.FromSpotifyAPI(device);
                    if (spDevice) {
                        spDevices.value.push(spDevice);
                        if (spDevice.id === player.value.id) {
                            player.value.active = spDevice.active;
                        }
                    }
                }
            } catch (err) {
                console.warn('[SpotifyService]: Failed to parse devices JSON: ', err);
            }
        }
    });

    fetchSpotifyAPI({
       url: 'https://api.spotify.com/v1/me/player',
    }).then(async (result) => {
        if (result.status === 204) {
            // no state
            return;
        }
        if (result.ok) {
            try {
                const { device, repeat_state, shuffle_state, progress_ms, is_playing } = await result.json();

                activeDevice.value = SpDevice.FromSpotifyAPI(device);

                player.value.elapsed = progress_ms;
                // prevent state from desyncing briefly during requests (i.e. togglePlayer)
                if (!player.active) {
                    player.value.repeatMode = repeat_state;
                    player.value.shuffle = shuffle_state;
                    player.value.paused = !is_playing;
                }
            } catch (err) {
                console.warn('[SpotifyService]: Failed to parse player state JSON: ', err);
            }
        }
    });
}, pollRate);

export { player, activeDevice, spDevices };
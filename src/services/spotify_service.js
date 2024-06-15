import {accessToken, fetchSpotifyAPI} from "./spotify_api.js";
import {ref} from "vue";

import SpPlayer from "../model/SpPlayer.js";
import SpSong from "../model/SpSong.js";
import SpDevice from "../model/SpDevice.js";
import SpRepeatMode from "../model/SpRepeatMode.js";
import SpType from "../model/SpType.js";
import {changeSpotifyDevice} from "../composables/useSpotifyAPI.js";
import SpTrack from "../model/SpSong.js";

const player = ref(new SpPlayer());
const activeDevice = ref(null);
const spDevices = ref([]);

/**
 * @param player SpPlayer
 * @param state Spotify Web Playback SDK WebPlaybackState
 */
const setState = (player, state) => {
    if (!player.value.isDebounced('playing')) player.value.playing = !state.paused;
    if (!player.value.isDebounced('elapsed')) player.value.elapsed = state.position;
    // does this factor in other types (i.e. Episode)
    // TODO: consider other types
    player.value.currentTime = SpSong.FromSpotifyAPI(state.track_window.current_track);
    if (!player.value.isDebounced('shuffle')) player.value.shuffle = state.shuffle;
    if (!player.value.isDebounced('repeatMode')) player.value.repeatMode = SpRepeatMode.FromSpotifyAPI(state.repeat_mode);
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
const criticalPollRate = 5 * 1000;
player.value.debouncingDuration = criticalPollRate;

const nonCriticalPollRate = 30 * 1000;

// solution to continue tracking elapsed time
const trackInterval = 250;
setInterval(() => {
    if (player.value.playing) {
        player.value.elapsed += trackInterval;
    }
}, trackInterval);

setInterval(async () => {
    const result = await fetchSpotifyAPI({url: 'https://api.spotify.com/v1/me/player/devices'});
    if (result.ok) {
        try {
            const { devices } = await result.json();
            spDevices.value = [];
            for (const device of devices) {
                const spDevice = SpDevice.FromSpotifyAPI(device);
                if (spDevice) {
                    spDevices.value.push(spDevice);
                }
            }
        } catch (err) {
            console.warn('[SpotifyService]: Failed to parse devices JSON: ', err);
        }
    }
}, nonCriticalPollRate);

setInterval( async () => {
    const result = await fetchSpotifyAPI({
        url: 'https://api.spotify.com/v1/me/player',
    })

    if (result.status === 204) {
        // no state
        return;
    }

    if (result.ok) {
        try {
            const { device, repeat_state, shuffle_state, progress_ms, is_playing, item, currently_playing_type } = await result.json();

            activeDevice.value = SpDevice.FromSpotifyAPI(device);
            if (device) {
                if (activeDevice.value.id === player.value.id) {
                    player.value.active = true;
                    player.value.useWebAPI = false;
                } else {
                    player.value.active = false;
                    player.value.useWebAPI = true;
                    if (!player.value.isDebounced('volume')) {
                        player.value.volume = activeDevice.value.volume / 100;
                    }
                }
            }

            // prevent state from desyncing
            if (!player.value.isDebounced('playing')) player.value.playing = is_playing;
            if (!player.value.isDebounced('elapsed')) player.value.elapsed = progress_ms;
            if (!player.value.isDebounced('shuffle')) player.value.shuffle = shuffle_state;
            if (!player.value.isDebounced('repeatMode')) player.value.repeatMode = SpRepeatMode.FromSpotifyAPI(repeat_state);

            const type = SpType.FromSpotifyAPI(currently_playing_type);
            if (type === SpType.Track) {
                player.value.currentlyPlaying = SpTrack.FromSpotifyAPI(item);
            }
        } catch (err) {
            console.warn('[SpotifyService]: Failed to parse player state JSON: ', err);
        }
    }
}, criticalPollRate);

export { player, activeDevice, spDevices };
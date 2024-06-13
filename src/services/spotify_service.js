import {accessToken} from "./spotify_api.js";
import {reactive} from "vue";

import SpotifyPlayer from "../model/SpotifyPlayer.js";

const player = reactive(new SpotifyPlayer());

window.onSpotifyWebPlaybackSDKReady = () => {
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

    player.playerAPI.addListener('not_ready', ({device_id}) => {
        player.ready = false;
        player.reset();
    });

    player.playerAPI.addListener('player_state_changed', (state) => {
        if (state) {
            player.setState(state);
        }
    });

    player.connect();
}

const apiScript = document.createElement("script");
apiScript.src = 'https://sdk.scdn.co/spotify-player.js';
document.head.appendChild(apiScript);

// query Web Playback SDK as much as possible to avoid incurring API calls
const refreshInterval = 10;
setInterval(() => {
    if (player.playerAPI?.ready) {
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
import {computed} from "vue";

import { fetchSpotifyAPI } from "../services/spotify_api.js";
import { player, activeDevice, spDevices } from '../services/spotify_service.js'

export function useSpotifyPlayer() {
    return player;
}

export function useDevices() {
    return spDevices;
}

export function useActiveDevice() {
    return activeDevice;
}

// API Calls

export async function changeSpotifyDevice(deviceId, play) {
    return fetchSpotifyAPI({
        url: 'https://api.spotify.com/v1/me/player',
        method: 'PUT',
        body: JSON.stringify({
            'device_ids': [deviceId],
            play: play ?? false,
        })
    });
}
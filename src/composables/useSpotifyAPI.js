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

function appendIf(target, postfix, value) {
    if (value) {
        return target + postfix;
    } else {
        return target;
    }
}

function appendArgs(url, args) {
    let appended = url + '?';
    let count = 0;
    Object.keys(args).forEach((key, index) => {
        if (args[key] !== undefined && args[key] !== null) {
            appended += `${count > 0 ? '&' : ''}${key}=${args[key]}`;
            count++;
        }
    });
    if (count === 0) return url;
    return appended;
}

// API Calls

export async function changeSpotifyDevice(deviceId, play) {
    return fetchSpotifyAPI({
        url: 'https://api.spotify.com/v1/me/player',
        method: 'PUT',
        body: JSON.stringify({
            'device_ids': [deviceId],
            play: play ?? false,
        }),
    });
}

export async function spotifySetVolume(volume, deviceId) {
    return fetchSpotifyAPI({
        url: appendArgs('https://api.spotify.com/v1/me/player/volume', {
            'volume_percent': volume ?? 0,
            'device_id': deviceId,
        }),
        method: 'PUT',
    })
}

export async function spotifyTogglePlayback(toggle, deviceId) {
    return fetchSpotifyAPI({
        url: appendArgs(`https://api.spotify.com/v1/me/player/${toggle ? 'play' : 'pause'}`, {
            'device_id': deviceId,
        }),
        method: 'PUT',
    });
}

export async function spotifySkipToNext(deviceId) {
    return fetchSpotifyAPI({
        url: appendArgs('https://api.spotify.com/v1/me/player/next', {
            'device_id': deviceId,
        }),
        method: 'POST',
    });
}

export async function spotifySkipToPrevious(deviceId) {
    return fetchSpotifyAPI({
        url: appendArgs('https://api.spotify.com/v1/me/player/previous', {
            'device_id': deviceId,
        }),
        method: 'POST',
    });
}

export async function spotifySeekToPosition(position, deviceId) {
    return fetchSpotifyAPI({
        url: `https://api.spotify.com/v1/me/player/seek?position_ms=${position ?? 0}`,
        method: 'PUT',
    });
}
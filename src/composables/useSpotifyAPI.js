import { fetchSpotifyAPI } from "../services/spotify_api.js";
import { player, spDevices, activeDevice, activePlaylist } from '../services/spotify_service.js'
import SpCategory from "../model/SpCategory.js";
import SpPlaylist from "../model/SpPlaylist.js";
import {onMounted, onUnmounted, ref, watch} from "vue";

export function useSpotifyPlayer() {
    return player;
}

export function useDevices() {
    return spDevices;
}

export function useActiveDevice() {
    return activeDevice;
}

function useRefresh(refreshFunc, refreshInterval) {
    let clearId;
    onMounted(() => {
        clearId = setInterval(refreshFunc, refreshInterval);
    });
    onUnmounted(() => {
       clearInterval(clearId);
       clearId = undefined;
    });
    refreshFunc();
}

export function usePlaylist(url) {
    const playlist = ref(null);
    const onRefresh = async () => {
        if (!url.value) {
            playlist.value = null;
            return;
        }
        playlist.value = await SpotifyWebAPI.Playlists.GetPlaylist(url.value);
    }
    watch(url, async () => {
        await onRefresh();
    });
    useRefresh(onRefresh, 15 * 1000);
    return playlist;
}

export function useActivePlaylist() {
    return usePlaylist(activePlaylist);
}

export function useOwnerPlaylists() {
    const playlists = ref([]);
    useRefresh(async () => {
        playlists.value = await SpotifyWebAPI.Playlists.GetOwnerPlaylists(50, 0);
    }, 15 * 1000);
    return playlists;
}

// utility functions

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

const tryParseResponse = async (res) => {
    if (!res) return;
    if (res.ok) {
        try {
            return await res.json();
        } catch (err) {
            console.warn('[SpotifyWebAPI]: Error occured while parsing response JSON: ', err);
        }
    }
}

export const SpotifyWebAPI = Object.freeze({
    Categories: {
        GetBrowseCategory: async (categoryId) => {
            const response = await fetchSpotifyAPI({
                url: `https://api.spotify.com/v1/browse/categories/${categoryId}`
            });

            const json = await tryParseResponse(response);
            if (json) return new SpCategory(json);
        },
        GetBrowseCategories: async (limit, offset) => {
            const response = await fetchSpotifyAPI({
                url: `https://api.spotify.com/v1/browse/categories?offset=${offset}&limit=${limit}`
            });

            const json = await tryParseResponse(response);
            if (json) return json?.categories?.items?.map((cat) => new SpCategory(cat));
        },
    },
    Player: {
        TransferPlayback: async (deviceId, play) => {
            return fetchSpotifyAPI({
                url: 'https://api.spotify.com/v1/me/player',
                method: 'PUT',
                body: JSON.stringify({
                    'device_ids': [deviceId],
                    play: play ?? false,
                }),
            });
        },
        TogglePlayback: async (play, deviceId) => {
            return fetchSpotifyAPI({
                url: appendArgs(`https://api.spotify.com/v1/me/player/${play ? 'play' : 'pause'}`, {
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        SkipToNext: async (deviceId) => {
            return fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/next', {
                    'device_id': deviceId,
                }),
                method: 'POST',
            });
        },
        SkipToPrevious: async (deviceId) => {
            return fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/previous', {
                    'device_id': deviceId,
                }),
                method: 'POST',
            });
        },
        SeekToPosition: async (position, deviceId) => {
            return fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/seek', {
                    'position_ms': position,
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        SetRepeatMode: async (repeatMode, deviceId) => {
            return fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/repeat', {
                    state: repeatMode,
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        SetPlaybackVolume: async (volume, deviceId) => {
            return fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/volume', {
                    'volume_percent': volume ?? 0,
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        TogglePlaybackShuffle: async (shuffle, deviceId) => {
            return fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/shuffle', {
                    state: shuffle,
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
    },
    Playlists: {
        GetPlaylist: async (playlistId) => {
            const res = await fetchSpotifyAPI({
                url: `https://api.spotify.com/v1/playlists/${playlistId}`,
            });

            const json = await tryParseResponse(res);
            if (json) return new SpPlaylist(json);
        },
        GetOwnerPlaylists: async (limit, offset) => {
            const res = await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/playlists', {
                    limit: limit,
                    offset: offset,
                }),
            });

            const json = await tryParseResponse(res);
            if (json) return json?.items?.map((playlist) => new SpPlaylist(playlist));
        }
    },
});
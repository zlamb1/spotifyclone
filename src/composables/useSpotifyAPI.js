import { fetchSpotifyAPI } from "../services/spotify_api.js";
import { player, spDevices, activeDevice, activePlaylist } from '../services/spotify_service.js'
import SpCategory from "../model/SpCategory.js";
import SpPlaylist from "../model/SpPlaylist.js";
import {onMounted, onUnmounted, ref, watch} from "vue";
import SpError from "../model/SpError.js";

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
    const clearId = ref(0);
    onMounted(() => {
        clearId.value = setInterval(refreshFunc, refreshInterval);
    });
    onUnmounted(() => {
       clearInterval(clearId);
       clearId.value = undefined;
    });
    refreshFunc();
    return clearId;
}

export function usePlaylist(url) {
    const playlist = ref(null);
    const onRefresh = async () => {
        if (!url.value) {
            playlist.value = null;
            return;
        }
        const res = await SpotifyWebAPI.Playlists.GetPlaylist(url.value);
        if (res !== SpError.RateLimit) {
            playlist.value = await SpotifyWebAPI.Playlists.GetPlaylist(url.value);
        }
    }
    const unwatch = watch(url, async () => {
        await onRefresh();
    });
    const clearId = useRefresh(onRefresh, 15 * 1000);
    const unsub = () => {
        if (clearId.value) clearInterval(clearId);
        unwatch();
    }
    return { playlist, unsub };
}

export function useActivePlaylist() {
    return usePlaylist(activePlaylist);
}

export function useUserPlaylists() {
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

const checkError = (res) => {
    if (res?.status === 429) return SpError.RateLimit;
}

const parseResponse = async (res, func) => {
    const error = checkError(res);
    if (error) return error;
    const json = await tryParseResponse(res);
    if (json) return func(json);
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
        StartPlayback: async (deviceId, body) => {
            return await fetchSpotifyAPI({
                url: appendArgs(`https://api.spotify.com/v1/me/player/play`, {
                    'device_id': deviceId,
                }),
                method: 'PUT',
                body: JSON.stringify(body),
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

            return parseResponse(res, (json) => {
                return new SpPlaylist(json);
            });
        },
        GetOwnerPlaylists: async (limit, offset) => {
            const res = await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/playlists', {
                    limit: limit,
                    offset: offset,
                }),
            });
            return parseResponse(res, (json) => {
                return json?.items?.map((playlist) => new SpPlaylist(playlist));;
            });
        }
    },
});
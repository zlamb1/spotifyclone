import { fetchSpotifyAPI } from "../services/spotify_api.js";
import { player, spDevices, activeDevice, activePlaylistId } from '../services/spotify_service.js'
import SpCategory from "../model/SpCategory.js";
import SpPlaylist from "../model/SpPlaylist.js";
import {onMounted, onUnmounted, ref, watch} from "vue";
import SpError from "../model/SpError.js";
import SpHistoryItem from "../model/SpHistoryItem.js";

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
       clearInterval(clearId.value);
       clearId.value = undefined;
    });
    refreshFunc();
    return clearId;
}

export function usePlaylist(id) {
    const playlist = ref({loading: true});
    const onRefresh = async () => {
        if (id.value) {
            if (playlist.value) playlist.value.loading = true;
            const res = await SpotifyWebAPI.Playlists.GetPlaylist(id.value);
            if (!SpError.IsError(res)) playlist.value = res;
        } else playlist.value = {loading: false};
    }
    const unwatch = watch(id, async () => await onRefresh());
    const clearId = useRefresh(onRefresh, 15 * 1000);
    const unsub = () => {
        if (clearId.value) clearInterval(clearId.value);
        unwatch();
    }
    return { playlist, unsub };
}

export function usePlaylists(ids) {
    const playlists = ref([]);
    const onRefresh = async () => {
        if (!ids.value) {
            playlists.value = [];
            return;
        }
        const found = [];
        for (const id of ids.value) {
            const res = await SpotifyWebAPI.Playlists.GetPlaylist(id);
            if (!SpError.IsError(res)) found.push(res);
        }
        if (ids.value.length > 0 && found.length === 0) return;
        playlists.value = found;
    }
    const unwatch = watch(ids, async () => {
        await onRefresh();
    });
    const clearId = useRefresh(onRefresh, 30 * 1000);
    const unsub = () => {
        if (clearId.value) clearInterval(clearId.value);
        unwatch();
    }
    return { playlists, unsub };
}

export function useActivePlaylist() {
    return usePlaylist(activePlaylistId);
}

export function useUserPlaylists() {
    const playlists = ref([]);
    useRefresh(async () => {
        const res = await SpotifyWebAPI.Playlists.GetCurrentUserPlaylists(50, 0);
        if (!SpError.IsError(res)) playlists.value = res;
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
    if (res === SpError.APIError) return res;
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
            return await fetchSpotifyAPI({
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
            return await fetchSpotifyAPI({
                url: appendArgs(`https://api.spotify.com/v1/me/player/${play ? 'play' : 'pause'}`, {
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        SkipToNext: async (deviceId) => {
            return await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/next', {
                    'device_id': deviceId,
                }),
                method: 'POST',
            });
        },
        SkipToPrevious: async (deviceId) => {
            return await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/previous', {
                    'device_id': deviceId,
                }),
                method: 'POST',
            });
        },
        SeekToPosition: async (position, deviceId) => {
            return await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/seek', {
                    'position_ms': position,
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        SetRepeatMode: async (repeatMode, deviceId) => {
            return await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/repeat', {
                    state: repeatMode,
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        SetPlaybackVolume: async (volume, deviceId) => {
            return await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/volume', {
                    'volume_percent': volume ?? 0,
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        TogglePlaybackShuffle: async (shuffle, deviceId) => {
            return await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/shuffle', {
                    state: shuffle,
                    'device_id': deviceId,
                }),
                method: 'PUT',
            });
        },
        GetRecentlyPlayedTracks: async (limit = 20, after, before) => {
            const res = await fetchSpotifyAPI({
                url: appendArgs('https://api.spotify.com/v1/me/player/recently-played', {
                    limit: limit,
                    after: after,
                    before: before,
                }),
            });

            return parseResponse(res, (json) => {
                return json?.items?.map((item) => new SpHistoryItem(item));
            })
        },
    },
    Playlists: {
        GetPlaylist: async (playlistId) => {
            const res = await fetchSpotifyAPI({
                url: `https://api.spotify.com/v1/playlists/${playlistId}`,
            });

            return parseResponse(res, (json) => new SpPlaylist(json))
        },
        GetCurrentUserPlaylists: async (limit, offset) => {
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
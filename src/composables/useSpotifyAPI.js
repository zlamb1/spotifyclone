import {fetchSpotifyAPI} from "../services/spotify_api.js";
import SpCategory from "../model/SpotifyAPI/SpCategory.js";
import SpHistoryItem from "../model/SpotifyAPI/SpHistoryItem.js";
import SpPlaylist from "../model/SpotifyAPI/SpPlaylist.js";
import SpStatus from "../model/SpotifyAPI/SpStatus.js";
import SpResult from "../model/SpResult.js";

export const SpotifyWebAPI = Object.freeze({
    Categories: {
        GetBrowseCategory: async (categoryId) => {
            const res = await fetchSpotifyAPI({
                url: `https://api.spotify.com/v1/browse/categories/${categoryId}`
            });

            return parseResponse(res, (json) => new SpCategory(json));
        },
        GetBrowseCategories: async (limit, offset) => {
            const res = await fetchSpotifyAPI({
                url: `https://api.spotify.com/v1/browse/categories?offset=${offset}&limit=${limit}`
            });

            return parseResponse(res, (json) => json.categories?.items?.map((cat) => new SpCategory(cat)));
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
            });
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
        },
    },
});

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

const getStatus = (res) => {
    if (res?.ok) return SpStatus.Okay;
    switch (res?.status) {
        case 429: return SpStatus.RateLimit;
        case SpStatus.APIError: return SpStatus.APIError;
        default: return SpStatus.Unknown;
    }
}

const parseResponse = async (res, func) => {
    const status = getStatus(res);
    const json = await tryParseResponse(res, func);
    const data = json && status === SpStatus.Okay ? func(json) : null;
    const next = json?.next ?? null;
    return new SpResult(data, status, next);
}
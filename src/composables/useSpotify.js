import { SpotifyWebAPI } from "./useSpotifyAPI.js";
import { player, spDevices, activeDevice, activePlaylistId } from '~/js/spotify_service.js'
import { onMounted, onUnmounted, ref, watch } from "vue";

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
        clearId.value = setInterval(() => refreshFunc(false), refreshInterval);
    });
    onUnmounted(() => {
       clearInterval(clearId.value);
       clearId.value = undefined;
    });
    refreshFunc(true);
    return clearId;
}

export function usePlaylist(id) {
    const playlist = ref({loading: true});
    const onRefresh = async (firstLoad) => {
        if (id.value) {
            if (playlist.value) playlist.value.loading = firstLoad;
            const res = await SpotifyWebAPI.Playlists.GetPlaylist(id.value);
            if (res.ok()) {
                playlist.value = res.data ?? null;
            }
        } else playlist.value = {loading: false};
    }
    const unwatch = watch(id, async () => await onRefresh(true));
    const clearId = useRefresh(onRefresh, 15 * 1000);
    const unsub = () => {
        if (clearId.value) clearInterval(clearId.value);
        unwatch();
    }
    return { playlist, unsub };
}

export function usePlaylists(ids) {
    const playlists = ref([]);
    playlists.value.loading = true;
    const onRefresh = async (firstLoad) => {
        if (ids.value) {
            if (playlists.value) playlists.value.loading = firstLoad;
            const found = [];
            for (const id of ids.value) {
                const res = await SpotifyWebAPI.Playlists.GetPlaylist(id);
                if (res.ok()) {
                    found.push(res.data);
                }
            }
            if (ids.value.length > 0 && found.length === 0) return;
            playlists.value = found;
        } else {
            playlists.value = [];
        }
    }
    const unwatch = watch(ids, async () => await onRefresh(true));
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

export function useOwnerPlaylists() {
    const playlists = ref([]);
    useRefresh(async () => {
        const res = await SpotifyWebAPI.Playlists.GetCurrentUserPlaylists(50, 0);
        if (res.ok()) {
            playlists.value = res.data ?? [];
        }
    }, 15 * 1000);
    return playlists;
}
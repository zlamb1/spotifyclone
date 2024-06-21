import {useSpotifyPlayer} from "./useSpotify.js";
import {computed} from "vue";

export function usePlayIcon() {
    const player = useSpotifyPlayer();
    return computed(() => {
        return player.value?.playing ? 'pause' : 'play_arrow';
    });
}
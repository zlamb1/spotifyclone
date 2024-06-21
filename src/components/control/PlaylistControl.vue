<script setup>

import {computed} from "vue";
import {activePlaylistId} from "../../services/spotify_service.js";
import {useSpotifyPlayer} from "../../composables/useSpotify.js";

const player = useSpotifyPlayer();

const props = defineProps({
  playlist: {
    type: Object,
  },
  color: {
    type: String,
    default: 'primary',
  },
  textColor: {
    type: String,
    default: 'accent',
  },
});

const onPlay = () => {
  if (props.playlist?.id) {
    if (props.playlist?.id === activePlaylistId.value) {
      player.value?.togglePlayer();
    } else if (props.playlist?.hasTracks()) {
      player.value?.playPlaylist(props.playlist);
    }
  }
}

const playIcon = computed(() => {
  if (props.playlist?.id && player.value?.playing && props.playlist?.id === activePlaylistId.value) {
    return 'pause';
  } else {
    return 'play_arrow';
  }
});

</script>

<template>
  <q-btn :icon="playIcon" :color="color" :text-color="textColor" size="18px" dense round push @click="onPlay" />
</template>
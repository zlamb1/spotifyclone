<script setup>

import {useDynamicComponent} from "../composables/useDynamicComponent.js";
import {useRoute} from "vue-router";
import {provide, ref, watch} from "vue";
import {usePlaylist} from "../composables/useSpotifyAPI.js";
import usePrimaryColor from "../composables/usePrimaryColor.js";

const PlaylistView = useDynamicComponent({
  xs: 'view/PlaylistView.xs',
  sm: 'view/PlaylistView.sm',
});

const route = useRoute();
const id = ref(route.params.id);

const { playlist } = usePlaylist(id);

provide('playlist', playlist);

const defaultColor = '#121212';
provide('defaultColor', defaultColor);

const primaryColor = ref(defaultColor);
provide('primaryColor', primaryColor);

const findPrimaryColor = usePrimaryColor();

watch(route, (_route) => {
  id.value = _route.params?.id;
});

watch(playlist, (newPlaylist, oldPlaylist) => {
  const url = newPlaylist?.getFirstImage();
  if (!newPlaylist || !url) {
    primaryColor.value = defaultColor;
    return;
  }

  if (!oldPlaylist?.images || newPlaylist?.images[0].url !== oldPlaylist?.images[0].url) {
    findPrimaryColor(url, (rgb) => primaryColor.value = rgb);
  }
});

</script>

<template>
 <PlaylistView />
</template>
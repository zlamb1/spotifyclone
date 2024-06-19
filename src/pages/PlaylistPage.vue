<script setup>

import {useDynamicComponent} from "../composables/useDynamicComponent.js";
import {useRoute} from "vue-router";
import {provide, ref, watch} from "vue";
import {usePlaylist} from "../composables/useSpotifyAPI.js";
import usePrimaryColor from "../composables/usePrimaryColor.js";

const PlaylistView = useDynamicComponent('view/PlaylistView');

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
  if (!newPlaylist || !(newPlaylist?.images?.length > 0)) {
    color.value = defaultColor;
    return;
  }

  if (!oldPlaylist?.images || newPlaylist?.images[0].url !== oldPlaylist?.images[0].url) {
    const img = new Image;
    img.setAttribute('crossOrigin', '');
    img.src = playlist.value.images[0].url;
    img.onload = () => {
      const newColor = findPrimaryColor(img);
      primaryColor.value = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;
    }
  }
});

</script>

<template>
 <PlaylistView />
</template>
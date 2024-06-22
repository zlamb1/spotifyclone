<script setup>

import { RouterView } from "vue-router";
import { provide, ref, watch } from "vue";
import { activePlaylistId } from "~/js/spotify_service.js";
import { useIsMobile, useDynamicComponent } from "~/composables/useDynamicComponent.js";
import { usePlaylist, useOwnerPlaylists } from "~/composables/useSpotify.js";
import { usePrimaryColor } from "~/composables/usePrimaryColor.js";
import tinycolor from "tinycolor2";

const activePlaylist = usePlaylist(activePlaylistId).playlist;
provide('activePlaylist', activePlaylist);

const defaultColor = '#242424';

const activePrimaryColor = ref(defaultColor);
provide('activePrimaryColor', activePrimaryColor)

const findPrimaryColor = usePrimaryColor();

watch(activePlaylist, () => {
  const url = activePlaylist.value?.getFirstImage?.();
  if (!url) activePrimaryColor.value = defaultColor;
  else {
    findPrimaryColor(url, (rgb) => {
      const color = tinycolor(rgb).darken(20).desaturate();
      activePrimaryColor.value = color.toHexString();
    });
  }
});

const userPlaylists = useOwnerPlaylists();
provide('userPlaylists', userPlaylists);

const isMobile = useIsMobile();
provide('isMobile', isMobile);

const DefaultLayout = useDynamicComponent({
  xs: 'layouts/xs/DefaultLayout',
  sm: 'layouts/DefaultLayout'
});

</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<style>
body.body--dark {
  --shadow-color: rgb(25, 24, 24);
}
body.body--dark .shadow-1 {
  box-shadow: 0 1px 3px var(--shadow-color), 0 1px 1px var(--shadow-color), 0 2px 1px -1px var(--shadow-color) !important;
}
body.body--dark .shadow-2 {
  box-shadow: 0 1px 5px var(--shadow-color), 0 2px 2px var(--shadow-color), 0 3px 1px -2px var(--shadow-color) !important;
}
body.body--dark .shadow-3 {
  box-shadow: 0 1px 8px var(--shadow-color), 0 3px 4px var(--shadow-color), 0 3px 3px -2px var(--shadow-color) !important;
}
body.body--dark .shadow-4 {
  box-shadow: 0 2px 4px -1px var(--shadow-color), 0 4px 5px var(--shadow-color), 0 1px 10px var(--shadow-color) !important;
}
body.body--dark .shadow-5 {
  box-shadow: 0 3px 5px -1px var(--shadow-color), 0 5px 8px var(--shadow-color), 0 1px 14px var(--shadow-color) !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
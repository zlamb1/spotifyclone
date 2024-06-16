<script setup>

import {useRoute} from "vue-router";
import {usePlaylist} from "../composables/useSpotifyAPI.js";
import {computed, ref, watch} from "vue";
import PlaylistThumbnail from "../components/thumbnail/PlaylistThumbnail.vue";
import HighlightBtn from "../components/btn/HighlightBtn.vue";

const route = useRoute();
const id = ref(route.params.id);

const playlist = usePlaylist(id);
const count = computed(() => {
  return playlist.value?.tracks?.items?.length;
})

watch(route, () => {
  id.value = route.params.id;
});

const color = ref('var(--q-dark-accent)');
const computedBackground = computed(() => {
  return `linear-gradient(to bottom, ${color.value}, #121212 20%)`;
});

const container = ref(null);

const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');

const findImgAverage = (img) => {
  let blockSize = 5, // only visit every 5 pixels
      defaultRGB = { r: 0, g: 0, b: 0}, // for non-supporting envs
      data, width, height,
      i = -4,
      length,
      rgb = { r: 0, g: 0, b: 0 },
      count = 0;

  if (!ctx) {
    return defaultRGB;
  }

  height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
  width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

  ctx.drawImage(img, 0, 0);

  try {
    data = ctx.getImageData(0, 0, width, height);
  } catch(e) {
    /* security error, img on diff domain */
    console.error(e);
    return defaultRGB;
  }

  length = data.data.length;

  while ( (i += blockSize * 4) < length ) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}

watch(playlist, (newPlaylist, oldPlaylist) => {
  if (!newPlaylist || !(newPlaylist?.images?.length > 0)) {
    color.value = 'var(--q-dark-accent)';
    return;
  }

  if (!oldPlaylist?.images || newPlaylist?.images[0].url !== oldPlaylist?.images[0].url) {
    const img = new Image;
    img.setAttribute('crossOrigin', '');
    img.src = playlist.value.images[0].url;
    img.onload = () => {
      const newColor = findImgAverage(img);
      //console.log(newColor, img.src);
      color.value = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;
    }
  }
});

</script>

<template>
  <div class="col rounded-borders q-px-lg" :style="`background: ${computedBackground}`" ref="container">
    <div class="q-py-lg">
      <div class="row" v-if="playlist">
        <PlaylistThumbnail color="accent" text-color="accent-two" class="col-auto shadow-2 thumbnail" icon-size="lg" :playlist="playlist" />
        <div class="col column justify-end q-mx-lg non-selectable">
          <div class="text-secondary" style="font-size: 15px">{{playlist?.public ? 'Public Playlist' : 'Private Playlist'}}</div>
          <div class="text-secondary text-h3">{{playlist?.name}}</div>
          <div class="row items-center q-gutter-x-sm">
            <div class="text-secondary">{{playlist?.owner?.display_name}}</div>
            <div class="text-accent-two">• {{count}} song{{count > 1 ? 's' : ''}}, {{playlist?.getDuration()}}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <HighlightBtn>#</HighlightBtn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.thumbnail {
  width: 200px;
  height: 200px;
}
</style>
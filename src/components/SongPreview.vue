<script setup>

import {onMounted, onUnmounted, ref} from "vue";

import SpSong from "../model/SpSong.js";

import IconBtn from "./IconBtn.vue";
import SongThumbnail from "./SongThumbnail.vue";

defineProps({
  song: {
    type: SpSong,
  },
  maxWidth: {
    type: Number,
    default: 150,
  },
});

const isHovering = ref(false);

const nameContainer = ref(null);
const pauseNameScroll = ref(false);

const artistsContainer = ref(null);
const pauseArtistsScroll = ref(false);

const scrollSpeed = 2;

const refresh = () => {
  const $nameEl = nameContainer.value;
  const $artistsEl = artistsContainer.value;

  if ($nameEl) {
    if (!pauseNameScroll.value) {
      $nameEl.scrollBy(scrollSpeed * (isHovering.value ? 1 : -1), 0);
    }
  }

  if ($artistsEl) {
    if (!pauseArtistsScroll.value) {
      $artistsEl.scrollBy(scrollSpeed * (isHovering.value ? 1 : -1), 0);
    }
  }
}

const onMouseOver = (event) => {
  isHovering.value = true;
  if (event?.target) {
    pauseNameScroll.value = event.target?.classList?.contains('name-link');
    pauseArtistsScroll.value = event.target?.classList?.contains('artist-link');
  }
}

let clearId;

onMounted(() => {
  clearId = setInterval(refresh, 100);
});

onUnmounted(() => {
  if (clearId) {
    clearInterval(clearId);
  }
});
</script>

<template>
  <div class="row items-center">
    <SongThumbnail style="width: 60px; height: 60px" :url="song.retrieveFirstImage()" />
    <div class="column q-pa-md" @mouseover="onMouseOver" @mouseleave="isHovering = false">
      <div class="song-scroller" :style="`max-width: ${maxWidth}px`" ref="nameContainer">
        <div class="full-height bg-red" />
        <RouterLink class="text-secondary link name-link" active-class="underline" :to="{name: 'track', params: { id: '0' }}">
          {{song.name}}
        </RouterLink>
      </div>
      <div class="song-scroller row no-wrap" :style="`max-width: ${maxWidth}px`" ref="artistsContainer">
        <div v-for="(artist, index) in song.artists" :key="index">
          <RouterLink class="text-accent-two link artist-link" :to="{name: 'artist', params: { id: 0 }}">
            {{artist.name}}
          </RouterLink>
          <span class="text-accent-two non-selectable" v-show="index !== song.artists.length - 1">,</span>
        </div>
      </div>
    </div>
    <div class="flex flex-center">
      <IconBtn color="primary" icon-color="dark" icon="check" size="6px" icon-size="12px" round />
    </div>
  </div>
</template>

<style scoped>
.song-scroller {
  overflow-x: scroll;
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.song-scroller::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
.link {
  text-decoration: none;
  white-space: nowrap;
}
.link:hover {
  text-decoration: underline !important;
}
</style>
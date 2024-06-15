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

const scrollContainer = ref(null);
const pauseScroll = ref(false);

const scrollSpeed = 2;

const refresh = () => {
  const $el = scrollContainer.value;
  if ($el && pauseScroll.value) {
    $el.scrollBy(scrollSpeed * (isHovering.value ? 1 : -1), 0);
  }
}

const onMouseOver = (event) => {
  isHovering.value = true;
  if (event?.target) {
    pauseScroll.value = !event.target?.classList?.contains('link');
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
    <div class="row col q-pa-md q-gutter-x-sm" @mouseover="onMouseOver" @mouseleave="isHovering = false">
      <div class="column song-scroller" ref="scrollContainer">
        <div>
          <RouterLink class="text-secondary link" active-class="underline" :to="{name: 'track', params: { id: '0' }}">
            {{song.name}}
          </RouterLink>
        </div>
        <div class="row no-wrap">
          <div v-for="(artist, index) in song.artists" :key="index">
            <RouterLink class="text-accent-two link" :to="{name: 'artist', params: { id: 0 }}">
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
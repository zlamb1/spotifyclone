<script setup>

import {onMounted, onUnmounted, ref} from "vue";

import SpTrack from "../model/SpotifyAPI/SpTrack.js";

import IconBtn from "./btn/IconBtn.vue";
import TrackThumbnail from "./thumbnail/TrackThumbnail.vue";

const props = defineProps({
  track: {
    type: SpTrack,
  },
  maxWidth: {
    type: Number,
    default: 150,
  },
  showAddToPlaylist: {
    type: Boolean,
    default: true,
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
  if (clearId) clearInterval(clearId);
});

</script>

<template>
  <div class="row items-center">
    <TrackThumbnail style="width: 60px; height: 60px" :track="track" />
    <div class="row col q-pa-md q-gutter-x-sm" @mouseover="onMouseOver" @mouseleave="isHovering = false">
      <div class="column song-scroller" ref="scrollContainer">
        <div>
          <RouterLink class="text-secondary non-selectable link" active-class="underline" :to="{name: 'track', params: { id: track?.id }}">
            {{track?.name}}
            <slot name="user-link" />
          </RouterLink>
        </div>
        <div class="row no-wrap">
          <div v-for="(artist, index) in track?.artists" :key="index">
            <RouterLink class="text-accent-two non-selectable link" :to="{name: 'artist', params: { id: artist.id }}">
              {{artist.name}}
              <slot name="artist-link" />
            </RouterLink>
            <span class="text-accent-two non-selectable q-mr-xs" v-show="index !== track?.artists?.length - 1">,</span>
          </div>
        </div>
      </div>
      <div class="flex flex-center" v-show="showAddToPlaylist">
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
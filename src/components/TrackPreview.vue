<script setup>

import IconBtn from "./btn/IconBtn.vue";
import TrackThumbnail from "./thumbnail/TrackThumbnail.vue";
import SpTrack from "~/model/SpotifyAPI/SpTrack.js";
import { onMounted, onUnmounted, ref } from "vue";

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
        <div class="row q-gutter-x-xs no-wrap">
          <div class="row text-accent-two" v-for="(artist, index) in track?.artists" :key="index">
            <RouterLink class="link non-selectable text-accent-two" :to="{name: 'artist', params: { id: artist.id }}">
              {{artist.name}}
              <slot name="artist-link" />
            </RouterLink>
            {{index !== track?.artists?.length - 1 ? ',' : ''}}
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
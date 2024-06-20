<script setup>

import {computed, ref} from "vue";
import {SpotifyWebAPI, usePlaylists, useSpotifyPlayer} from "../composables/useSpotifyAPI.js";
import {activePlaylistId} from "../services/spotify_service.js";

const player = useSpotifyPlayer();

const recentlyPlayed = ref([]);
const recentPlaylists = ref([]);

const { playlists } = usePlaylists(recentPlaylists);

(async() => {
  recentlyPlayed.value = await SpotifyWebAPI.Player.GetRecentlyPlayedTracks(50);
  const set = [];
  const deduped = [];
  for (const item of recentlyPlayed.value) {
    if (!item?.track?.id) continue;
    if (set.indexOf(item?.track?.id) < 0) {
      set.push(item.track.id);
      deduped.push(item);
    }
  }

  recentlyPlayed.value = deduped;

  const found = [];
  for (const item of recentlyPlayed.value) {
    if (item?.context && item.context?.type === 'playlist') {
      const id = item.context?.uri?.substring(item.context?.uri?.lastIndexOf(':') + 1);
      if (found.indexOf(id) < 0) {
        found.push(id);
      }
    }
  }

  recentPlaylists.value = found;
})();

const slide = ref(0);

const computedTracks = computed(() => {
  const tracks = [];
  for (let i = 0; i < recentlyPlayed.value.length; i += 3) {
    const arr = [];
    for (let j = 0; j < 3; j++) {
      if (recentlyPlayed.value.length > i + j) arr.push(recentlyPlayed.value[i + j].track);
    }
    tracks.push(arr);
  }
  return tracks;
});

const isHoveringCarousel = ref(false);

</script>

<template>
  <div class="container column bg-dark-accent q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col-6" v-for="playlist in playlists" :key="playlist?.id">
        <RouterLink :to="`/playlist/${playlist?.id ?? 0}`" class="text-secondary" style="text-decoration: none">
          <div class="row no-wrap items-center bg-accent rounded-borders cursor-pointer">
            <q-img :src="playlist.getFirstImage()" width="50px" height="50px" class="rounded-borders col-auto" ratio="1" />
            <span class="col on-right">{{playlist.name}}</span>
            <div v-show="player?.playing && playlist?.id === activePlaylistId">
              <q-spinner-audio class="on-left" color="primary" />
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
    <div class="q-mt-md" v-show="recentlyPlayed.length">
      <div class="text-h5 text-secondary">Recently played</div>
      <q-carousel v-model="slide" class="bg-dark-accent q-my-md" style="height: fit-content"
                  animated swipeable infinite :autoplay="isHoveringCarousel"
                  @mouseenter="isHoveringCarousel = true" @mouseleave="isHoveringCarousel = false">
        <q-carousel-slide class="row q-col-gutter-sm q-pa-none" :name="index" v-for="(tracks, index) in computedTracks">
          <div v-for="track in tracks" class="col-4">
            <RouterLink to="/" class="column q-gutter-y-xs text-secondary" style="text-decoration: none">
              <q-img :src="track.getFirstImage()" ratio="1" />
              <div class="ellipsis-hide" style="max-width: 30vw">{{track.name}}</div>
            </RouterLink>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: inherit;
}
.ellipsis-hide {
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
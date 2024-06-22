<script setup>

import TrackThumbnail from "~/components/thumbnail/TrackThumbnail.vue";
import { SpotifyWebAPI } from "~/composables/useSpotifyAPI.js";
import { usePlaylists, useSpotifyPlayer } from "~/composables/useSpotify.js";
import { activePlaylistId } from "~/js/spotify_service.js";
import { computed, ref } from "vue";

const player = useSpotifyPlayer();

const loadingRecentlyPlayed = ref(true);
const recentlyPlayed = ref();

const recentPlaylists = ref([]);

const { playlists } = usePlaylists(recentPlaylists);

(async() => {
  const res = await SpotifyWebAPI.Player.GetRecentlyPlayedTracks(50);
  recentlyPlayed.value = res?.data;

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
  loadingRecentlyPlayed.value = false;

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
  for (let i = 0; i < recentlyPlayed.value?.length; i += 3) {
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
      <div class="col-6" v-for="i in 4" v-show="playlists?.loading">
        <q-skeleton type="rect" height="50px" />
      </div>
      <div class="col-6" v-for="playlist in playlists" :key="playlist?.id" v-show="!playlists?.loading">
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
    <div class="q-mt-md" v-show="loadingRecentlyPlayed || recentlyPlayed?.length">
      <div class="text-h5 text-secondary">Recently played</div>
      <div class="row q-col-gutter-sm q-my-sm" v-show="loadingRecentlyPlayed">
        <div class="col-4" v-for="i in 3">
          <q-responsive ratio="1">
            <q-skeleton type="rect" />
          </q-responsive>
        </div>
      </div>
      <q-carousel v-model="slide" class="carousel bg-dark-accent q-my-md"
                  animated swipeable infinite :autoplay="isHoveringCarousel"
                  @mouseenter="isHoveringCarousel = true" @mouseleave="isHoveringCarousel = false" v-show="!loadingRecentlyPlayed">
        <q-carousel-slide class="row q-col-gutter-sm q-pa-none" :name="index" v-for="(tracks, index) in computedTracks">
          <div v-for="track in tracks" class="col-4">
            <RouterLink to="/" class="column q-gutter-y-xs text-secondary" style="text-decoration: none">
              <TrackThumbnail class="fit" :track="track" />
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
  min-height: 100vh;
}
.carousel {
  height: fit-content;
}
.ellipsis-hide {
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
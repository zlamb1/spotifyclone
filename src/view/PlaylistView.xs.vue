<script setup>

import {useSpotifyPlayer} from "../composables/useSpotifyAPI.js";
import {inject} from "vue";
import TrackThumbnail from "../components/thumbnail/TrackThumbnail.vue";
import {useRouter} from "vue-router";
import PlaylistThumbnail from "../components/thumbnail/PlaylistThumbnail.vue";
import PlayControl from "../components/control/PlaylistControl.vue";

const router = useRouter();
const player = useSpotifyPlayer();

const pageOffset = inject('pageOffset');
const playlist = inject('playlist');

const defaultColor = inject('defaultColor');
const primaryColor = inject('primaryColor');

const isTrackPlaying = (track) => {
  return player.value?.currentlyPlaying?.id === track?.id;
}

</script>

<template>
  <div class="container column no-wrap q-px-md" :style="`padding-bottom: ${pageOffset}px`">
    <div class="flex flex-center q-ma-sm">
      <div class="back-arrow">
        <q-btn icon="arrow_back" flat dense round @click="router.go(-1)" />
      </div>
      <q-responsive style="width: 40vw" ratio="1">
        <q-skeleton type="rect" class="fit" v-show="playlist?.loading" />
        <PlaylistThumbnail class="fit shadow-3" icon-size="100px" :playlist="playlist" v-show="!playlist?.loading" />
      </q-responsive>
    </div>
    <div class="row items-center justify-between">
      <div class="column">
        <div class="text-h5 non-selectable">
          <q-skeleton type="text" style="width: 50%" v-show="playlist?.loading" />
          {{playlist?.name}}
        </div>
        <div class="non-selectable">
          <q-skeleton type="text" style="width: 20%" v-show="playlist?.loading" />
          {{playlist?.owner?.display_name}}
        </div>
        <div class="row items-center text-accent-two q-gutter-x-xs">
          <q-icon name="language" />
          <q-skeleton type="text" style="width: 20%" v-show="playlist?.loading" />
          <div style="font-size: 12px">{{playlist?.getDuration?.()}}</div>
        </div>
      </div>
      <div class="row items-center q-gutter-x-xs">
        <q-btn icon="more_vert" color="accent-two" flat dense round />
        <PlayControl :playlist="playlist" />
      </div>
    </div>
    <div class="column no-wrap non-selectable q-my-md q-gutter-y-sm">
      <div class="row items-center cursor-pointer q-gutter-x-sm" v-for="track in playlist?.tracks" :key="track?.id" :disabled="track?.id ? undefined : true">
        <TrackThumbnail class="rounded-borders" width="35px" ratio="1" :track="track" />
        <div class="overflow-container col column justify-center">
          <div class="prevent-overflow" :class="isTrackPlaying(track) ? 'text-primary' : 'text-secondary'">
            {{track.name}}
          </div>
          <div class="prevent-overflow text-accent-two" style="font-size: 12px">{{track.getFormattedArtists()}}</div>
        </div>
        <div class="col-auto">
          <q-btn icon="more_vert" class="text-secondary-accent" size="md" round flat dense />
        </div>
      </div>
      <div v-for="i in 10" v-show="playlist?.loading">
        <q-skeleton height="48px" type="rect" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  background: linear-gradient(to bottom, v-bind(primaryColor), v-bind(defaultColor) 250px) local;
  height: 100vh;
  overflow-y: scroll;
}
.back-arrow {
  position: absolute;
  top: 5px;
  left: 5px;
}
.overflow-container {
  overflow-x: hidden;
}
.prevent-overflow {
  text-wrap: nowrap;
  text-overflow: ellipsis;
}
</style>
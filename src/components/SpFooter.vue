<script setup>

import {computed} from "vue";

import {useQuasar} from "quasar";
import {useActiveDevice, useSpotifyPlayer} from "../composables/useSpotifyAPI.js";

import SongPreview from "./TrackPreview.vue";
import ProgressBar from "./ProgressBar.vue";

import ChangeStrategy from "../model/ChangeStrategy.js";
import IconBtn from "./btn/IconBtn.vue";
import DeviceBtn from "./btn/DeviceBtn.vue";
import VolumeControl from "./control/VolumeControl.vue";
import SpRepeatMode from "../model/SpRepeatMode.js";
import RepeatControl from "./control/RepeatControl.vue";
import TrackPreview from "./TrackPreview.vue";
import PlaylistContextMenu from "./menu/PlaylistContextMenu.vue";
import ArtistContextMenu from "./menu/ArtistContextMenu.vue";

const player = useSpotifyPlayer();
const activeDevice = useActiveDevice();

const $q = useQuasar();
const screen = $q.screen;

const computedPlayIcon = computed((() => {
  if (player.value.playing) {
    return 'pause';
  } else {
    return 'play_arrow';
  }
}));

const formatDuration = (duration) => {
  duration = duration ?? 0;
  const seconds = Math.floor(duration / 1000) % 60;
  const minutes = Math.floor(duration / 1000 / 60) % 60;
  return `${minutes}:${(seconds < 10 ? '0' : '') + seconds}`;
}

</script>

<template>
  <q-footer>
    <div class="row justify-center q-py-sm q-px-md">
      <div class="col-4" v-show="screen.gt.xs">
        <TrackPreview :track="player.currentlyPlaying" v-if="player?.currentlyPlaying">
          <template #artist-link>
            <ArtistContextMenu />
          </template>
        </TrackPreview>
      </div>
      <div class="column col-10 col-sm-4 col-md full-height justify-center">
        <div class="row justify-center relative-position q-mb-sm q-gutter-x-sm">
          <DeviceBtn class="absolute-left" v-show="screen.lt.sm" />
          <IconBtn icon="shuffle" :icon-color="player.shuffle ? 'primary' : undefined" dense @click="player.toggleShuffle()" />
          <IconBtn icon="skip_previous" icon-size="md" dense @click="player.prev()" />
          <IconBtn :icon="computedPlayIcon" color="secondary" icon-color="dark" icon-size="md" round push @click="player.togglePlayer()" />
          <IconBtn icon="skip_next" icon-size="md" dense @click="player.skip()" />
          <RepeatControl />
          <VolumeControl class="absolute-right" collapsed v-show="screen.lt.sm" />
        </div>
        <div class="row no-wrap q-gutter-x-sm">
          <span class="non-selectable text-accent-two">{{formatDuration(player?.elapsed)}}</span>
          <ProgressBar :progress="player.getElapsedAsPercent()" @update="(newProgress) => player.setElapsedAsPercent(newProgress)"
                       style="width: 100%" :change-strategy="ChangeStrategy.Release"
                       color="accent-two" track-color="secondary" hover-track-color="primary"
                       knob-color="secondary" :debounce-duration="50" :disabled="!player.currentlyPlaying" />
          <span class="non-selectable text-accent-two">{{formatDuration(player?.currentlyPlaying?.duration)}}</span>
        </div>
      </div>
      <div class="col-4 row items-center" v-show="screen.gt.xs">
        <div class="col-4 col-sm-6 col-md-8 flex justify-end q-mr-sm">
          <DeviceBtn class="flex items-center q-mr-sm" />
        </div>
        <VolumeControl class="col" />
      </div>
    </div>
    <transition name="fade">
      <div class="q-px-sm q-pb-sm full-width" v-show="!player.active && activeDevice">
        <div class="flex justify-end items-center bg-primary full-width rounded-borders q-pa-sm non-selectable">
          <q-icon name="volume_down" color="dark" class="q-mr-xs"
                  style="border: 1px solid var(--q-dark); border-radius: 50%;" />
          <span class="text-dark">Playing on {{activeDevice?.name}}</span>
        </div>
      </div>
    </transition>
  </q-footer>
</template>
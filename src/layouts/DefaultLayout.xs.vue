<script setup>

import {computed, inject, provide, ref} from "vue";
import {activeDevice, player} from "../services/spotify_service.js";

import { usePlayIcon } from "../composables/usePlayIcon.js";

import DeviceButton from "../components/btn/DeviceButton.xs.vue";

const activePrimaryColor = inject('activePrimaryColor');

const offset = ref(0);
const calcPageHeight = computed(() => {
  return `calc(-${offset.value}px + 100vh)`;
});

const styleFn = (_offset) => {
  offset.value = _offset;
  return { minHeight: _offset ? `calc(100vh - ${_offset}px)` : '100vh' }
}

provide('calcPageHeight', calcPageHeight);

const usingOtherDevice = computed(() => {
  return !player.value?.active && activeDevice.value;
});

const playIcon = usePlayIcon();

</script>

<template>
  <q-layout class="fullscreen bg-accent" view="hHh lpR fFf">
    <q-footer class="transparent">
      <q-tabs class="tabs flex bg-transparent text-accent-two" indicator-color="transparent" active-color="secondary" dense>
        <q-route-tab to="/" name="home" icon="home" style="font-size: 10px" no-caps>Home</q-route-tab>
        <q-route-tab to="/search" name="search" icon="search" style="font-size: 10px" no-caps>Search</q-route-tab>
        <q-route-tab to="/library" name="library" icon="library_music" style="font-size: 10px" no-caps>Your Library</q-route-tab>
      </q-tabs>
      <div class="player-container" v-show="player?.currentlyPlaying">
        <div class="row no-wrap justify-between rounded-borders q-pa-xs q-mx-sm q-mb-sm">
          <div class="col row no-wrap" style="overflow-x: hidden">
            <q-img :src="player?.currentlyPlaying?.getFirstImage()" width="35px" class="col-auto rounded-borders" />
            <div class="col column non-selectable on-right" style="font-size: 12px">
              <div class="row no-wrap">
                <div style="text-wrap: nowrap" v-if="usingOtherDevice">
                  {{player?.currentlyPlaying?.name}} • {{player?.currentlyPlaying?.getFirstArtist()}}
                </div>
                <div v-else>
                  {{player?.currentlyPlaying?.name}}
                </div>
              </div>
              <div class="text-primary" v-if="usingOtherDevice">
                <q-icon name="volume_down" color="primary" class="primary-round q-mr-xs" />
                {{activeDevice?.name}}
              </div>
              <div class="text-accent-two" v-else>
                {{player?.currentlyPlaying?.getFirstArtist()}}
              </div>
            </div>
          </div>
          <div class="col-auto row no-wrap flex-center q-gutter-x-xs">
            <DeviceButton class="q-mr-xs" />
            <q-btn icon="check" color="primary" text-color="dark" size="6px" dense round  />
            <q-icon :name="playIcon" class="cursor-pointer" text-color="secondary" size="sm" flat dense @click="player?.togglePlayer()" />
          </div>
        </div>
      </div>
    </q-footer>
    <q-page-container>
      <q-page :style-fn="styleFn">
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.tabs::before {
  content: '';
  background: rgba(0, 0, 0, 0.9);
  filter: brightness(20%);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.primary-round {
  border: 1px solid var(--q-primary);
  border-radius: 50%;
}
.player-container {
  position: absolute;
  top: 0;
  width: 100%;
  transform: translateY(-100%);
}
.player-container > div {
  background: v-bind(activePrimaryColor);
}
</style>
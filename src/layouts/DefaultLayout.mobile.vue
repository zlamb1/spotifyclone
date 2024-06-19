<script setup>

import {computed, provide, ref} from "vue";
import {activeDevice, player} from "../services/spotify_service.js";

import DeviceButton from "../components/btn/DeviceButton.mobile.vue";

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

</script>

<template>
  <q-layout class="fullscreen bg-dark" view="hHh lpR fFf">
    <q-footer>
      <q-tabs class="flex bg-dark text-accent-two" indicator-color="transparent" active-color="secondary" dense>
        <q-route-tab to="/" name="home" icon="home" style="font-size: 10px" no-caps>Home</q-route-tab>
        <q-route-tab to="/search" name="search" icon="search" style="font-size: 10px" no-caps>Search</q-route-tab>
        <q-route-tab to="/library" name="library" icon="library_music" style="font-size: 10px" no-caps>Your Library</q-route-tab>
      </q-tabs>
      <div class="player-container" v-show="player?.currentlyPlaying">
        <div class="row justify-between bg-accent rounded-borders q-pa-xs q-mx-sm q-mb-sm">
          <div class="row">
            <q-img :src="player?.currentlyPlaying?.getFirstImage()" width="35px" class="rounded-borders" />
            <div class="column non-selectable on-right" style="font-size: 12px">
              <div class="row">
                {{player?.currentlyPlaying?.name}}
                <div class="q-ml-xs" v-show="usingOtherDevice">• {{player?.currentlyPlaying?.getFirstArtist()}}</div>
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
          <div class="row flex-center">
            <DeviceButton />
            <q-btn icon="check" color="primary" text-color="dark" size="8px" dense round  />
            <q-btn text-color="secondary" icon="play_arrow" flat dense />
          </div>
        </div>
      </div>
    </q-footer>
    <q-page-container class="bg-red">
      <q-page :style-fn="styleFn">
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
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
</style>
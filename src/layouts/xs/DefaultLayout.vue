<script setup>

import DeviceButton from "~/components/btn/xs/DeviceBtn.vue";
import { usePlayIcon } from "~/composables/usePlayIcon.js";
import { activeDevice, player } from "~/js/spotify_service.js";
import { computed, inject, provide, ref } from "vue";

const activePrimaryColor = inject('activePrimaryColor');

const offset = ref(0);
provide('pageOffset', offset);

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

const percentage = computed(() => {
  if (!player.value?.playingItem?.duration) return '0%';
  return 100 - (player.value?.elapsed / player.value?.playingItem?.duration * 100).toFixed(4) + '%';
});

</script>

<template>
  <q-layout class="fullscreen bg-accent" view="hHh lpR fFf">
    <q-footer class="bg-transparent">
      <div class="player-container" v-show="player?.playingItem">
        <div class="row no-wrap justify-between rounded-borders q-pa-xs q-mx-sm">
          <div class="col row no-wrap" style="overflow-x: hidden">
            <q-img :src="player?.playingItem?.getFirstImage()" width="35px" class="col-auto rounded-borders" />
            <div class="col column non-selectable on-right" style="font-size: 12px">
              <div class="row no-wrap">
                <div class="text-secondary" style="text-wrap: nowrap" v-if="usingOtherDevice">
                  {{player?.playingItem?.name}} • {{player?.playingItem?.getFirstArtist()}}
                </div>
                <div class="text-secondary" v-else>
                  {{player?.playingItem?.name}}
                </div>
              </div>
              <div class="text-primary" v-if="usingOtherDevice">
                <q-icon name="volume_down" class="primary-round q-mr-xs" />
                {{activeDevice?.name}}
              </div>
              <div class="artist text-secondary-accent" v-else>
                {{player?.playingItem?.getFirstArtist()}}
              </div>
            </div>
          </div>
          <div class="col-auto row no-wrap flex-center q-gutter-x-sm">
            <DeviceButton class="q-mr-xs" />
            <q-btn icon="check" color="primary" text-color="dark" size="8px" dense round  />
            <q-icon :name="playIcon" class="cursor-pointer" text-color="secondary" size="md" flat dense @click="player?.togglePlayer()" />
          </div>
        </div>
      </div>
      <q-tabs class="tabs q-py-xs flex text-accent-two" indicator-color="transparent" active-color="secondary" dense>
        <q-route-tab to="/" name="home" icon="home" style="font-size: 10px" no-caps>Home</q-route-tab>
        <q-route-tab to="/search" name="search" icon="search" style="font-size: 10px" no-caps>Search</q-route-tab>
        <q-route-tab to="/library" name="library" icon="library_music" style="font-size: 10px" no-caps>Your Library</q-route-tab>
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page :style-fn="styleFn">
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.tabs {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1) 60%);
}
.primary-round {
  border: 1px solid var(--q-primary);
  border-radius: 50%;
}
.player-container > div::before {
  content: '';
  position: absolute;
  left: 0;
  right: v-bind(percentage);
  bottom: 0;
  height: 1px;
  background: var(--q-secondary);
  border-radius: 50%;
  margin-left: 1px;
  margin-right: 1px;
}
.player-container > div {
  position: relative;
  background: v-bind(activePrimaryColor);
  transition: background-color 0.3s ease-in-out;
}
.artist {
  --shadow-color: rgba(0, 0, 0, 0.4);
}
</style>
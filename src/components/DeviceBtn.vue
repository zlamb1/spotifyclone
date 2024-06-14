<script setup>

import {ref, watch} from "vue";

import SpDeviceType from "../model/SpDeviceType.js";

import {changeSpotifyDevice, useActiveDevice, useDevices, useSpotifyPlayer} from "../composables/useSpotifyAPI.js";

const menu = ref(null);

const player = useSpotifyPlayer();
const devices = useDevices();
const activeDevice = useActiveDevice();

const getDeviceIcon = (type) => {
  switch (type) {
    case SpDeviceType.Computer:
      return 'laptop_windows';
    case SpDeviceType.Phone:
      return 'smartphone';
    case SpDeviceType.Speaker:
      return 'speaker';
    default:
      return 'device_unknown';
  }
}

watch(devices, () => {
  menu.value?.updatePosition();
});

</script>

<template>
  <q-btn icon="devices" :text-color="player.active ? 'primary' : 'accent-two'" dense>
    <q-menu anchor="top middle" self="bottom middle" class="bg-accent text-secondary column q-pa-lg" ref="menu">
      <div class="row items-center q-gutter-x-md q-mb-md">
        <q-icon name="laptop_windows" size="md" :class="`text-${player.active ? 'primary' : 'secondary'}`" />
        <div class="column non-selectable">
          <span style="font-size: 18px">Current device</span>
          <span style="font-size: 16px" :class="`text-${player.active ? 'primary' : 'secondary'}`">
            {{activeDevice?.name ?? 'None'}}
          </span>
        </div>
      </div>
      <div class="text-center non-selectable">
        <span class="text-bold" style="font-size: 16px;">Select Another Device</span>
      </div>
      <q-list>
        <q-item v-for="device in devices" :active="device.id === activeDevice?.id"
                active-class="text-primary" clickable v-close-popup
                @click="changeSpotifyDevice(device.id, !player.paused)">
          <q-item-section avatar>
            <q-icon :name="getDeviceIcon(device.type)" size="md" />
          </q-item-section>
          <q-item-section style="font-size: 16px">
            {{device.name}}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<style scoped>

</style>
<script setup>

import {ref} from "vue";
import {activeDevice} from "../../services/spotify_service.js";
import VolumeControl from "../control/VolumeControl.vue";

const dialog = ref(false);

</script>

<template>
  <div>
    <q-btn @click="dialog = true" icon="devices" color="secondary-accent" flat dense>
      <slot />
    </q-btn>
    <q-dialog v-model="dialog" transition-show="slide-up" transition-hide="slide-down" maximized>
      <q-card class="column bg-dark-accent">
        <q-card-actions class="row justify-end">
          <q-btn icon="close" class="q-mx-none" dense flat round @click="dialog = false" />
        </q-card-actions>
        <q-card-section class="q-pt-none">
          <div class="container q-pa-md non-selectable">
            <div class="row items-center no-wrap q-gutter-x-sm">
              <q-icon name="laptop" color="primary" />
              <div style="font-size: 18px">Current device</div>
            </div>
            <div class="row text-secondary" style="font-size: 12px">
              <div>{{activeDevice?.name}}</div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="q-mt-auto q-px-md full-width">
          <VolumeControl class="full-width" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.container {
  position: relative;
}
.container::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 10px;
  background: linear-gradient(to bottom, var(--q-primary), var(--q-accent) 200%), rgba(0, 0, 0, 0.1);
  filter: brightness(20%);
  pointer-events: none;
}
.container * {
  z-index: 1;
}
</style>
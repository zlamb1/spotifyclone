<script setup>

import {useSpotifyPlayer} from "../composables/useSpotifyAPI.js";
import {inject} from "vue";

const player = useSpotifyPlayer();

const playlist = inject('playlist');

const defaultColor = inject('defaultColor');
const primaryColor = inject('primaryColor');

const calcPageHeight = inject('calcPageHeight');

</script>

<template>
  <div class="container column q-pa-md q-gutter-y-md">
    <div class="flex flex-center">
      <q-img class="shadow-3" :src="playlist?.getFirstImage()" style="width: 60vw" />
    </div>
    <div class="text-h6 non-selectable">
      {{playlist?.name}}
    </div>
    <div class="non-selectable">
      {{playlist?.owner?.display_name}}
    </div>
  </div>
</template>

<style scoped>
.container {
  background: linear-gradient(to bottom, v-bind(primaryColor), v-bind(defaultColor) 250px);
  min-height: v-bind(calcPageHeight);
}
</style>
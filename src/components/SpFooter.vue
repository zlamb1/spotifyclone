<script setup>

import {ref} from "vue";

import {useQuasar} from "quasar";
import {useSpotifyPlayer} from "../composables/useSpotifyAPI.js";

import SongPreview from "./SongPreview.vue";
import ProgressBar from "./ProgressBar.vue";

import ChangeStrategy from "../model/ChangeStrategy.js";

const $q = useQuasar();
const screen = $q.screen;

const progress = ref(0.3);

const player = useSpotifyPlayer();

</script>

<template>
  <q-footer class="row q-py-lg q-px-md">
    <div class="col-4" v-show="screen.gt.xs">
      <SongPreview />
    </div>
    <div class="column col">
      <div>

      </div>
      <div class="row">
        <ProgressBar :progress="progress" @update="(newProgress) => progress = newProgress"
                     class="full-width" :change-strategy="ChangeStrategy.Release"
                     color="accent" track-color="secondary" hover-track-color="primary"
                     knob-color="secondary" />
      </div>
    </div>
    <div class="col-4" v-show="screen.gt.xs">

    </div>
  </q-footer>
</template>
<script setup>

import {useSpotifyPlayer} from "../composables/useSpotifyAPI.js";
import ProgressBar from "./ProgressBar.vue";
import {computed, ref} from "vue";
import ChangeStrategy from "../model/ChangeStrategy.js";
import IconBtn from "./IconBtn.vue";

const player = useSpotifyPlayer();

const isHoveringVolume = ref(false);
const trackedVolume = ref(player.value.volume);

const onClick = () => {
  if (player.value.volume > 0) {
    trackedVolume.value = player.value.volume;
    player.value.setVolume(0);
  } else {
    player.value.setVolume(trackedVolume.value);
  }
}

const volumeIcon = computed(() => {
  if (player.value.volume <= 0) {
    return 'volume_off';
  }
  if (player.value.volume < 0.5) {
    return 'volume_down';
  }
  return 'volume_up';
});

</script>

<template>
  <div class="row items-center">
    <IconBtn :icon="volumeIcon" text-color="accent-two" style="margin-right: 3px" dense round
             icon-size="28px" class="col-auto"
             @click="onClick" @mouseenter="isHoveringVolume = true" @mouseleave="isHoveringVolume = false" />
    <ProgressBar class="col" :progress="player.volume" @update="(value) => player.setVolume(value)"
                 :change-strategy="ChangeStrategy.Release" :hover-override="isHoveringVolume"
                 color="accent-two" track-color="secondary" hover-track-color="primary" knob-color="secondary" />
  </div>
</template>
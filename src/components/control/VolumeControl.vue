<script setup>

import ProgressBar from "../ProgressBar.vue";
import IconBtn from "../btn/IconBtn.vue";
import { useSpotifyPlayer } from "~/composables/useSpotify.js";
import ChangeStrategy from "~/model/ChangeStrategy.js";
import { computed, ref } from "vue";

const player = useSpotifyPlayer();

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  }
});

const isHoveringVolume = ref(false);
const trackedVolume = ref(player.value.volume);

const menuOpen = ref(false);

const onClick = () => {
  if (!props.collapsed) {
    if (player.value.volume > 0) {
      trackedVolume.value = player.value.volume;
      player.value.setVolume(0);
    } else {
      player.value.setVolume(trackedVolume.value);
    }
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
  <div class="row items-center justify-end">
    <IconBtn :icon="volumeIcon" text-color="accent-two" style="margin-right: 3px" dense round
             icon-size="28px" class="col-auto"
             @click="onClick" @mouseenter="isHoveringVolume = true" @mouseleave="isHoveringVolume = false">
      <q-menu v-model="menuOpen" class="q-px-sm" style="overflow: visible" anchor="top middle" self="bottom middle" :offset="[0, 5]" v-if="collapsed">
        <ProgressBar style="height: 100px; width: 5px;" :progress="player.volume" @update="(value) => player.setVolume(value)"
                     :change-strategy="ChangeStrategy.Release" :hover-override="isHoveringVolume" vertical inverted
                     color="accent-two" track-color="secondary" hover-track-color="primary" knob-color="secondary" />
      </q-menu>
    </IconBtn>
    <ProgressBar class="col" :progress="player.volume" @update="(value) => player.setVolume(value)"
                 :change-strategy="ChangeStrategy.Release" :hover-override="isHoveringVolume"
                 color="accent-two" track-color="secondary" hover-track-color="primary" knob-color="secondary" v-if="!collapsed" />
  </div>
</template>
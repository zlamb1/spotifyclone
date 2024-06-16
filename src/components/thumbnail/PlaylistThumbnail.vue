<script setup>

import SpPlaylist from "../../model/SpPlaylist.js";
import {computed} from "vue";

const props = defineProps({
  playlist: {
    type: SpPlaylist,
    required: true,
  },
  iconSize: {
    type: String,
  },
});

const url = computed(() => {
  if (props.playlist?.images?.length > 0) {
    return props.playlist?.images[0].url;
  }
});

</script>

<template>
  <q-avatar rounded>
    <q-img :src="url" v-if="url">
      <slot />
    </q-img>
    <q-icon name="music_note" :size="iconSize" v-else />
  </q-avatar>
</template>
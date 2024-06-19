<script setup>

import {ref, watch} from "vue";
import SpTrack from "../../model/SpTrack.js";

const props = defineProps({
  track: {
    type: SpTrack,
  }
});

const error = ref(false);

watch(() => props.track, () => {
  error.value = !props.track?.getFirstImage();
});

</script>

<template>
  <q-avatar color="accent" rounded>
    <q-icon name="music_note" v-if="error" />
    <q-img :src="track?.getFirstImage()" @load="error = false" @error="error = true" v-else>
      <template #loading>
        <q-spinner size="md" color="primary" />
      </template>
    </q-img>
  </q-avatar>
</template>
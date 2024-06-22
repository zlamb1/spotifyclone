<script setup>

import { ref, watch } from "vue";

const props = defineProps({
  track: {
    type: Object,
  }
});

const noImage = ref(!props.track?.getFirstImage?.());

watch(() => props.track, () => {
  noImage.value = !props.track?.getFirstImage?.();
});

</script>

<template>
  <q-avatar color="accent" rounded>
    <q-icon name="music_note" class="text-secondary-accent" v-if="noImage" />
    <q-img :src="track?.getFirstImage?.()" v-else>
      <template #loading>
        <q-spinner size="md" color="primary" />
      </template>
      <template #error>
        <q-icon name="music_note" class="text-secondary-accent" />
      </template>
    </q-img>
  </q-avatar>
</template>
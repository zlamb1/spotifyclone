<script setup>

import {ref, watch} from "vue";

const props = defineProps({
  playlist: {
    type: Object,
  },
  icon: {
    type: String,
    default: 'o_album',
  },
  iconSize: {
    type: String,
  },
});

const noImage = ref(!props.playlist?.getFirstImage?.());

watch(() => props.playlist, () => {
  noImage.value = !props.playlist?.getFirstImage?.();
});

</script>

<template>
  <q-avatar :class="noImage ? 'bg-accent' : ''" rounded>
    <q-icon :name="icon" :size="iconSize" v-show="noImage" />
    <q-img :src="playlist?.getFirstImage?.()" v-show="!noImage">
      <template #loading>
        <q-spinner color="primary" />
      </template>
      <template #error>
        <q-icon :name="icon" :size="iconSize" />
      </template>
      <slot />
    </q-img>
  </q-avatar>
</template>
<script setup>

import {computed} from "vue";

const props = defineProps({
  textColor: {
    type: String,
    default: 'accent-two',
  },
  activeColor: {
    type: String,
    default: 'secondary',
  },
  usePointer: {
    type: Boolean,
    default: false,
  }
});

const computedColor = computed(() => {
  return props.textColor;
});

</script>

<template>
  <div :class="usePointer ? 'cursor-pointer' : ''" :style="`color: ${computedColor}}`">
    <slot />
  </div>
</template>

<style scoped>

</style>
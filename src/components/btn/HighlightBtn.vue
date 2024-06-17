<script setup>

import {ref} from "vue";

const props = defineProps({
  class: {
    type: String,
  },
  activeClass: {
    type: String,
  },
  pointer: {
    type: String,
  }
});

const isHovering = ref(false);

</script>

<template>
  <div class="non-selectable" :class="`${isHovering ? activeClass : props.class} ${pointer ? `cursor-${pointer}` : ''}`" style="cursor: default"
       @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <slot />
  </div>
</template>

<style scoped>

</style>
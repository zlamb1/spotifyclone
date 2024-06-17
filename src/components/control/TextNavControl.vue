<script setup>

import {ref} from "vue";

const props = defineProps({
  class: {
    type: String,
  },
  activeClass: {
    type: String,
  },
  style: {
    type: Object,
  },
  activeStyle: {
    type: String,
  },
});

const isHovering = ref(false);

</script>

<template>
  <RouterLink :class="isHovering ? activeClass : props.class" :style="isHovering ? activeStyle : style"
              @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <slot />
  </RouterLink>
</template>
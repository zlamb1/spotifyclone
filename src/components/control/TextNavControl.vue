<script setup>

import {ref} from "vue";

const props = defineProps({
  to: {
    type: Object,
    required: true,
  },
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
  <RouterLink :to="to" :class="isHovering ? activeClass : props.class" :style="isHovering ? activeStyle : style"
              @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <slot />
  </RouterLink>
</template>
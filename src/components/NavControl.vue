<script setup>

import IconBtn from "./IconBtn.vue";
import {useRoute} from "vue-router";
import {computed} from "vue";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  activeIcon: {
    type: String,
  },
  activeClasses: {
    type: String,
  },
});

const route = useRoute();
const active = computed(() => props.to === route.path);

</script>

<template>
  <IconBtn :to="to" :icon="active ? (activeIcon ?? icon) : icon" :class="active ? activeClasses : undefined" icon-size="md" round>
    <slot />
  </IconBtn>
</template>
<script setup>

import IconBtn from "../btn/IconBtn.vue";
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
  iconColor: {
    type: String,
    default: 'accent-two',
  },
  activeIconColor: {
    type: String,
    default: 'secondary',
  },
});

const route = useRoute();
const active = computed(() => props.to === route.path);

</script>

<template>
  <IconBtn :to="to" :icon="active ? (activeIcon ?? icon) : icon" :icon-color="active ? activeIconColor : iconColor" icon-size="md" round>
    <slot />
  </IconBtn>
</template>
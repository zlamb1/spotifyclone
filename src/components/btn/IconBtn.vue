<script setup>

const props = defineProps({
  icon: {
    type: String,
  },
  iconColor: {
    type: String,
    default: undefined,
  },
  iconSize: {
    type: String,
    default: undefined,
  }
});

</script>

<template>
  <q-btn>
    <q-icon :name="icon" :color="iconColor" :size="iconSize">
      <slot />
    </q-icon>
  </q-btn>
</template>
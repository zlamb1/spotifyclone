<script setup>

import { useDynamicComponent } from "~/composables/useDynamicComponent.js";

const HomeView = useDynamicComponent({
  xs: 'view/xs/HomeView',
  sm: 'view/HomeView',
});

</script>

<template>
  <HomeView />
</template>
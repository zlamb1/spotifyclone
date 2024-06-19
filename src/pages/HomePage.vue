<script setup>

import {useDynamicComponent} from "../composables/useDynamicComponent.js";

const HomeView = useDynamicComponent({
  xs: 'view/HomeView.xs',
  sm: 'view/HomeView.sm',
});

</script>

<template>
  <HomeView />
</template>
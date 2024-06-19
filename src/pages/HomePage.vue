<script setup>

import {useDynamicComponent} from "../composables/useDynamicComponent.js";

const HomeView = useDynamicComponent('view/HomeView');

</script>

<template>
  <HomeView />
</template>
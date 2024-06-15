<script setup>
import SpHeader from "../components/SpHeader.vue";
import SpFooter from "../components/SpFooter.vue";
</script>

<template>
  <q-layout class="bg-dark" view="hHh lpR fFf">
    <SpHeader class="transparent q-px-md q-py-sm" />
    <SpFooter class="bg-dark" />
    <q-page-container>
      <q-page>
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
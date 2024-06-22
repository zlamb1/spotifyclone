<script setup>

import PlaylistList from "~/components/PlaylistList.vue";
import SpHeader from "~/components/SpHeader.vue";
import SpFooter from "~/components/SpFooter.vue";
import { computed, provide, ref } from "vue";

const offset = ref(0);

const calcPageHeight = computed(() => {
  return `calc(-${offset.value}px + 100vh)`;
});

provide('calcPageHeight', calcPageHeight);

const styleFn = (_offset) => {
  offset.value = _offset;
  return { minHeight: _offset ? `calc(100vh - ${_offset}px)` : '100vh' }
}

</script>

<template>
  <q-layout class="bg-dark" view="hHh lpR fFf">
    <SpHeader class="bg-dark q-px-md q-py-sm" />
    <SpFooter class="bg-dark" />
    <q-page-container>
      <q-page :style-fn="styleFn">
        <div class="row fit q-px-md" style="min-height: inherit;">
          <PlaylistList />
          <slot />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
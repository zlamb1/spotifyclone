<script setup>

import SongThumbnail from "./SongThumbnail.vue";

</script>

<template>
  <div class="row items-center">
    <SongThumbnail class="q-mr-md" url="" />
    <div class="column">
      <q-btn align="left" padding="none none" flat>Song Title</q-btn>
      <q-btn align="left" padding="none none" flat>By Artists...</q-btn>
    </div>
  </div>
</template>
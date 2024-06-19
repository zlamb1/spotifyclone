<script setup>

import {ref} from "vue";

const dialogOpen = ref(false);

</script>

<template>
  <div>
    <q-btn @click="dialogOpen = true" icon="devices" color="secondary-accent" flat dense>
      <slot />
    </q-btn>
    <q-dialog v-model="dialogOpen" position="bottom" full-width>
      <div class="full-width bg-dark-accent q-pa-md">
        Hello, dialog!
      </div>
    </q-dialog>
  </div>
</template>
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
        <div class="row fit q-px-md" style="min-height: inherit;">
          <div class="col-auto bg-dark-accent rounded-borders q-pa-md q-mr-sm">
            <q-btn icon="menu_book" color="accent-two" dense flat/>
          </div>
          <div class="col bg-dark-accent rounded-borders q-px-lg">
            <slot />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
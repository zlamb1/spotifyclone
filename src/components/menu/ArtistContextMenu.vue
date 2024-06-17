<script setup>

import {ref} from "vue";

const props = defineProps({
  fontSize: {
    type: String,
    default: '16',
  },
  iconSize: {
    type: String,
    default: '24px',
  },
  subMenuDebounce: {
    type: Number,
    default: 25,
  }
});

const hoveringShare = ref(false);
const showShareMenu = ref(false);

const onMouseLeave = () => {
  setTimeout(() => {
    if (!hoveringShare.value) {
      showShareMenu.value = false;
    }
  }, props.subMenuDebounce);
}

</script>

<template>
  <q-menu class="shadow-3" context-menu>
    <q-list class="bg-accent" :style="`font-size: ${fontSize}px`">
      <q-item class="flex flex-center q-px-sm" clickable>
        <q-icon name="o_person" color="accent-two" class="q-mr-sm" :size="iconSize" />
        <q-item-section class="text-secondary-accent">Follow</q-item-section>
      </q-item>
      <q-item class="flex flex-center justify-between q-px-sm" clickable @mouseenter="showShareMenu = true" @mouseleave="onMouseLeave">
        <div class="flex flex-center">
          <q-icon name="ios_share" color="accent-two" class="q-mr-sm" :size="iconSize" />
          <q-item-section class="text-secondary-accent">Share</q-item-section>
        </div>
        <q-icon name="arrow_right" size="24px" />
        <q-menu v-model="showShareMenu" class="shadow-2" anchor="top right" self="top left" @mouseenter="hoveringShare = true" @mouseleave="hoveringShare = false">
          <q-list class="bg-accent" :style="`font-size: ${fontSize}px`">
            <q-item class="flex flex-center q-px-sm" clickable>
              <q-icon name="content_copy" color="accent-two" :size="iconSize" class="q-mr-sm" />
              <q-item-section class="text-secondary-accent">Copy link to artist</q-item-section>
            </q-item>
            <q-item class="flex flex-center q-px-sm" clickable>
              <q-icon name="code" color="accent-two" :size="iconSize" class="q-mr-sm" />
              <q-item-section class="text-secondary-accent">Embed artist</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
    </q-list>
  </q-menu>
</template>
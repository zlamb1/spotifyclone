<script setup>

import { computed, inject, ref } from "vue";

const props = defineProps({
  findPlaylistLabel: {
    type: String,
    default: 'Find a playlist',
  },
});

const showAddSubMenu = ref(false);
const hoveringAddSubMenu = ref(false);

const onMouseLeave = () => {
  setTimeout(() => {
    if (!hoveringAddSubMenu.value) {
      showAddSubMenu.value = false;
    }
  }, 25);
}

const playlistInput = ref(null);
const playlistSearch = ref('');
const hasFocus = ref(false);

const computedPlaylistLabel = computed(() => {
  if (hasFocus.value || playlistSearch.value) return undefined;
  return props.findPlaylistLabel;
});

const onClear = () => {
  playlistSearch.value = '';
  playlistInput.value?.focus();
}

const userPlaylists = inject('userPlaylists');
const filteredPlaylists = computed(() => {
  if (!playlistSearch.value) return userPlaylists.value;
  return userPlaylists.value?.filter((playlist) => playlist?.name?.toLowerCase()?.indexOf(playlistSearch.value.toLowerCase()) > -1);
});

</script>

<template>
  <q-menu class="shadow-3" context-menu>
    <q-list style="font-size: 16px" class="bg-accent text-secondary">
      <q-item class="row items-center justify-between q-px-xs" @mouseenter="showAddSubMenu = true" @mouseleave="onMouseLeave" clickable>
        <div class="flex flex-center">
          <q-icon name="add" size="24px" color="accent-two" class="q-mx-sm" />
          <q-item-section>Add to playlist</q-item-section>
        </div>
        <q-icon name="arrow_right" size="32px" />
        <q-menu v-model="showAddSubMenu" class="shadow-2" anchor="top right" self="top left" @mouseenter="hoveringAddSubMenu = true" @mouseleave="hoveringAddSubMenu = false">
          <q-list class="bg-accent text-secondary" style="min-height: fit-content; max-height: 300px">
            <q-item>
              <q-input v-model="playlistSearch" :label="computedPlaylistLabel" filled dense
                       @focus="hasFocus = true" @blur="hasFocus = false" ref="playlistInput">
                <template #prepend>
                  <q-icon name="search" />
                </template>
                <template #append>
                  <q-icon name="clear" @click="onClear" :style="playlistSearch ? '' : 'visibility: collapse'" />
                </template>
              </q-input>
            </q-item>
            <q-item class="flex flex-center" clickable>
              <q-icon name="add" size="24px" color="accent-two" class="q-mx-sm" />
              <q-item-section>New playlist</q-item-section>
            </q-item>
            <q-item class="bg-accent" v-for="playlist in filteredPlaylists" @click="console.log(playlist)" clickable>
              <q-item-section>{{playlist?.name}}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
      <q-item class="flex flex-center q-px-xs" clickable>
        <q-icon name="o_delete" size="24px" color="accent-two" class="q-mx-sm" />
        <q-item-section>Remove from this playlist</q-item-section>
      </q-item>
      <q-item class="flex flex-center q-px-xs" clickable>
        <q-icon name="add_circle" size="24px" color="accent-two" class="q-mx-sm" />
        <q-item-section>Save to your Liked Songs</q-item-section>
      </q-item>
      <q-separator class="q-mx-sm" />
      <q-item class="flex flex-center q-px-xs" clickable>
        <q-icon name="o_person" size="24px" color="accent-two" class="q-mx-sm" />
        <q-item-section>Go to artist</q-item-section>
      </q-item>
      <q-item class="flex flex-center q-px-xs" clickable>
        <q-icon name="o_album" size="24px" color="accent-two" class="q-mx-sm" />
        <q-item-section>Go to album</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
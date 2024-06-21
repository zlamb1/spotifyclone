<script setup>

import SpHeader from "../components/SpHeader.vue";
import SpFooter from "../components/SpFooter.vue";
import PlaylistThumbnail from "../components/thumbnail/PlaylistThumbnail.vue";
import {computed, inject, provide, ref} from "vue";

import {activePlaylistId} from "../services/spotify_service.js";

const userPlaylists = inject('userPlaylists');

const offset = ref(0);
const calcPageHeight = computed(() => {
  return `calc(-${offset.value}px + 100vh)`;
});

const styleFn = (_offset) => {
  offset.value = _offset;
  return { minHeight: _offset ? `calc(100vh - ${_offset}px)` : '100vh' }
}

provide('calcPageHeight', calcPageHeight);

</script>

<template>
  <q-layout class="bg-dark" view="hHh lpR fFf">
    <SpHeader class="bg-dark q-px-md q-py-sm" />
    <SpFooter class="bg-dark" />
    <q-page-container>
      <q-page :style-fn="styleFn">
        <div class="row fit q-px-md" style="min-height: inherit;">
          <div class="column no-wrap items-center bg-dark-accent rounded-borders q-mr-sm q-gutter-y-xs" :style="`max-height: ${calcPageHeight}`">
            <q-btn icon="menu_book" text-color="accent-two" class="col-auto q-pa-md" round>
              <q-tooltip class="bg-accent" anchor="center right" self="center left">
                <div class="tooltip-text">Expand Your Library</div>
              </q-tooltip>
            </q-btn>
            <q-list style="overflow-y: scroll">
              <q-item v-for="playlist in userPlaylists" :key="playlist.id" :to="`/playlist/${playlist.id}`" class="q-px-sm" active-class="" clickable>
                <PlaylistThumbnail icon="music_note" :playlist="playlist" />
                <q-tooltip class="row items-center bg-accent tooltip-text" anchor="center right" self="center left">
                  <div class="column">
                    <div class="tooltip-text" :class="activePlaylistId === playlist.id ? 'text-primary' : ''">{{playlist.name}}</div>
                    <div class="subtitle">Playlist • {{playlist.owner.display_name}}</div>
                  </div>
                  <q-icon name="volume_up" size="20px" color="primary" class="q-ml-md" v-show="activePlaylistId === playlist.id" />
                </q-tooltip>
              </q-item>
            </q-list>
          </div>
          <slot />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.tooltip-text {
  font-size: 16px;
}
.subtitle {
  font-size: 14px;
  color: $accent-two;
}
</style>
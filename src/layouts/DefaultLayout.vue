<script setup>

import SpHeader from "../components/SpHeader.vue";
import SpFooter from "../components/SpFooter.vue";
import {useActivePlaylist, useOwnerPlaylists} from "../composables/useSpotifyAPI.js";
import PlaylistThumbnail from "../components/thumbnail/PlaylistThumbnail.vue";

const activePlaylist = useActivePlaylist();
const playlists = useOwnerPlaylists();

</script>

<template>
  <q-layout class="bg-dark" view="hHh lpR fFf">
    <SpHeader class="bg-dark q-px-md q-py-sm" />
    <SpFooter class="bg-dark" />
    <q-page-container>
      <q-page>
        <div class="row fit q-px-md" style="min-height: inherit;">
          <div class="col-auto column bg-dark-accent rounded-borders q-mr-sm">
            <q-btn icon="menu_book" text-color="accent-two" class="q-pa-md" dense>
              <q-tooltip class="bg-accent" anchor="center right" self="center left">
                <div class="tooltip-text">Expand Your Library</div>
              </q-tooltip>
            </q-btn>
            <q-separator />
            <q-list class="q-ma-none" style="overflow-y: scroll">
              <q-item v-for="playlist in playlists" :key="playlist.id" :to="`/playlist/${playlist.id}`" class="q-px-sm" clickable>
                <PlaylistThumbnail color="accent" text-color="secondary" :playlist="playlist" />
                <q-tooltip class="row items-center bg-accent tooltip-text" anchor="center right" self="center left">
                  <div class="column">
                    <div class="tooltip-text" :class="activePlaylist?.id === playlist.id ? 'text-primary' : ''">{{playlist.name}}</div>
                    <div class="subtitle">Playlist • {{playlist.owner.display_name}}</div>
                  </div>
                  <q-icon name="volume_up" size="20px" color="primary" class="q-ml-md" v-show="activePlaylist?.id === playlist.id" />
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
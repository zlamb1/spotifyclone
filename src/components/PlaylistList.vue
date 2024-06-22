<script setup>

import { activePlaylistId } from "../services/spotify_service.js";
import {inject, ref} from "vue";

import PlaylistThumbnail from "../components/thumbnail/PlaylistThumbnail.vue";
import {morph} from "quasar";

const calcPageHeight = inject('calcPageHeight');
const userPlaylists = inject('userPlaylists');

const container = ref(null);
const searchInput = ref(null);
const searchBtn = ref(null);

const libraryExpanded = ref(false);
const searchExpanded = ref(false);

const onMorph = (from, to, onToggle) => {
  morph({
    from: from,
    to: to,
    onToggle,
    duration: 100,
    tween: true,
    tweenFromOpacity: 0.8,
    tweenToOpacity: 0.4,
  });
}

const onMorphInput = () => {
  const getInput = () => searchInput.value ? searchInput.value.$el : void 0;
  const getBtn = () => searchBtn.value ? searchBtn.value.$el : void 0;

  morph({
    from: searchExpanded.value ? getInput : getBtn,
    to: searchExpanded.value ? getBtn : getInput,
    onToggle: () => searchExpanded.value = !searchExpanded.value,
    onEnd: () => {
      if (searchExpanded.value) {
        searchInput.value?.focus();
      }
    },
    duration: 200,
    resize: true,
  });
}

</script>

<template>
  <div class="column no-wrap bg-dark-accent rounded-borders q-mr-sm q-gutter-y-xs" :style="`max-height: ${calcPageHeight}`" ref="container">
    <div class="row justify-center items-center justify-between">
      <q-btn icon="menu_book" text-color="accent-two" class="col q-pa-md" no-caps @click="onMorph(container, container, () => libraryExpanded = !libraryExpanded)">
        <span class="on-right" style="font-size: 18px" v-show="libraryExpanded">Your Library</span>
        <q-tooltip class="bg-accent" anchor="top middle" self="bottom middle" v-if="libraryExpanded">
          <div class="tooltip-text">Collapse Your Library</div>
        </q-tooltip>
        <q-tooltip class="bg-accent" anchor="center right" self="center left" v-else>
          <div class="tooltip-text">Expand Your Library</div>
        </q-tooltip>
      </q-btn>
      <q-btn icon="add" text-color="accent-two" class="col-auto full-height" v-show="libraryExpanded">
        <q-tooltip class="bg-accent" anchor="top middle" self="bottom middle">
          <div class="tooltip-text">Create playlist or folder</div>
        </q-tooltip>
      </q-btn>
    </div>
    <div class="row relative-position q-px-sm" v-show="libraryExpanded">
      <transition name="width">
        <q-input label="Search in Your Library" dense filled ref="searchInput" @blur="searchExpanded = false" v-if="searchExpanded">
          <template #prepend>
            <q-icon name="search" color="accent-two" />
          </template>
        </q-input>
        <q-btn icon="search" text-color="accent-two" round ref="searchBtn" @click="searchExpanded = true" v-else="!searchExpanded" />
      </transition>
    </div>
    <q-list class="full-width q-pa-sm" style="overflow-y: scroll">
      <q-item v-for="playlist in userPlaylists" :key="playlist.id" :to="`/playlist/${playlist?.id}`" class="q-px-sm" active-class="" clickable>
        <PlaylistThumbnail icon="music_note" :playlist="playlist" />
        <div class="column on-right" v-show="libraryExpanded">
          <div>{{playlist?.name}}</div>
          <div class="subtitle">Playlist • {{playlist?.owner?.display_name}}</div>
        </div>
        <q-tooltip class="row items-center bg-accent tooltip-text" anchor="center right" self="center left" v-if="!libraryExpanded">
          <div class="column">
            <div class="tooltip-text" :class="activePlaylistId === playlist.id ? 'text-primary' : ''">{{playlist?.name}}</div>
            <div class="subtitle">Playlist • {{playlist?.owner?.display_name}}</div>
          </div>
          <q-icon name="volume_up" size="20px" color="primary" class="q-ml-md" v-show="activePlaylistId === playlist?.id" />
        </q-tooltip>
      </q-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
.width-leave-to {
  opacity: 0;
  width: 0;
}
.width-leave-from {
  width: 100%;
}
.width-leave-active {
  position: absolute;
  left: 5px;
  transition: all 1s;
}

.tooltip-text {
  font-size: 16px;
}
.subtitle {
  font-size: 14px;
  color: $accent-two;
}
</style>
<script setup>

import {useRoute} from "vue-router";
import {usePlaylist, useSpotifyPlayer} from "../composables/useSpotifyAPI.js";
import {computed, inject, ref, watch} from "vue";
import PlaylistThumbnail from "../components/thumbnail/PlaylistThumbnail.vue";
import HighlightBtn from "../components/btn/HighlightBtn.vue";
import TrackTableRow from "../components/table/TrackTableRow.vue";
import {activePlaylist} from "../services/spotify_service.js";
import {useEventListenerRef} from "../composables/useEventListener.js";
import usePrimaryColor from "../composables/usePrimaryColor.js";
import TableHeader from "../components/table/TableHeader.vue";

const route = useRoute();
const id = ref(route.params.id);

const player = useSpotifyPlayer();

const { playlist } = usePlaylist(id);

const count = computed(() => {
  return playlist.value?.tracks?.items?.length;
});

const defaultColor = '#121212';
const color = ref(defaultColor);

const container = ref(null);
const btnContainer = ref(null);

const tableColumns = [
  { text: '#', btnClass: 'text-accent-two', activeBtnClass: 'text-accent-two' },
  { text: 'Title', style: 'text-align: left', btnClass: 'text-accent-two', activeBtnClass: 'text-secondary' },
  { text: 'Album', style: 'text-align: left', btnClass: 'text-accent-two', activeBtnClass: 'text-secondary' },
  { text: 'Date added', style: 'text-align: left', btnClass: 'text-accent-two', activeBtnClass: 'text-secondary' },
  { icon: 'schedule', style: 'text-align: left', btnClass: 'text-accent-two', activeBtnClass: 'text-secondary' }
];

const computedBackground = computed(() => {
  return `linear-gradient(to bottom, ${color.value} 0%, ${defaultColor} 400px)`;
});

const computedRows = computed(() => {
  if (!playlist.value?.tracks) return [];
  return playlist.value?.tracks?.map((track, index) => ({
    index: index + 1,
    track: track,
    playlist: playlist.value,
  }));
});

const scrollY = ref(0);
useEventListenerRef(container, 'scroll', () => {
  scrollY.value = container.value?.scrollTop;
});

const computedShowHeader = computed(() => {
  return scrollY.value > btnContainer.value?.offsetTop;
});

const playIcon = computed(() => {
  if (playlist.value?.id === activePlaylist.value) {
    return player.value?.playing ? 'pause' : 'play_arrow';
  }
  return 'play_arrow';
});

const onClick = () => {
  if (activePlaylist.value && playlist.value?.id === activePlaylist.value) {
    player.value?.togglePlayer();
    return;
  }
  if (playlist.value?.tracks?.length > 0) {
    player.value?.playPlaylist(playlist.value);
  }
}

const findPrimaryColor = usePrimaryColor();

watch(route, (_route) => {
  id.value = _route.params?.id;
});

watch(playlist, (newPlaylist, oldPlaylist) => {
  if (!newPlaylist || !(newPlaylist?.images?.length > 0)) {
    color.value = defaultColor;
    return;
  }

  if (!oldPlaylist?.images || newPlaylist?.images[0].url !== oldPlaylist?.images[0].url) {
    const img = new Image;
    img.setAttribute('crossOrigin', '');
    img.src = playlist.value.images[0].url;
    img.onload = () => {
      const newColor = findPrimaryColor(img);
      color.value = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;
    }
  }
});

const pageHeight = inject('pageHeight');

</script>

<template>
  <div class="col rounded-borders relative-position" style="overflow-y: scroll" :style="`max-height: ${pageHeight}px`" ref="container">
    <transition name="fade">
      <div style="position: sticky; top: 0; height: 0; z-index: 9999" v-show="computedShowHeader">
        <div class="row items-center q-gutter-x-sm q-px-lg q-py-sm" :style="`background: ${computedBackground}`">
          <q-btn :icon="playIcon" color="primary" text-color="dark" size="16px" round @click="onClick" />
          <div class="text-h5 non-selectable">{{playlist?.name}}</div>
        </div>
        <div class="row justify-between bg-dark-accent q-py-none q-px-lg" style="border-bottom: 1px solid rgba(255, 255, 255, 0.15)">
          <q-table class="dummy-table" :rows="computedRows" :rows-per-page-options="[0]" separator="horizontal" hide-bottom dense flat>
            <template #header>
              <TableHeader :columns="tableColumns" />
            </template>
            <template #body="props">
              <TrackTableRow style="visibility: collapse" :row="props.row" />
            </template>
          </q-table>
        </div>
      </div>
    </transition>
    <div style="background-attachment: fixed" :style="`background: ${computedBackground}`" >
      <div class="row q-pa-lg" v-if="playlist">
        <PlaylistThumbnail color="accent" text-color="accent-two" class="col-auto shadow-1 thumbnail" icon-size="lg" :playlist="playlist" />
        <div class="col column justify-end q-mx-lg non-selectable">
          <div class="text-secondary" style="font-size: 15px">{{playlist?.public ? 'Public Playlist' : 'Private Playlist'}}</div>
          <div class="text-secondary text-h3">{{playlist?.name}}</div>
          <div class="row items-center q-gutter-x-sm">
            <div class="text-secondary">{{playlist?.owner?.display_name}}</div>
            <div class="text-accent-two">• {{count}} song{{count > 1 ? 's' : ''}}, {{playlist?.getDuration()}}</div>
          </div>
        </div>
      </div>
      <div class="column q-px-lg" style="background: linear-gradient(rgba(0, 0, 0, 0.1), #121212)">
        <div class="row q-my-md" ref="btnContainer">
          <q-btn :icon="playIcon" color="primary" text-color="dark-accent" size="lg" push round @click="onClick" />
        </div>
        <q-table class="bg-transparent full-width" :rows="computedRows" :rows-per-page-options="[0]" separator="horizontal" dense flat>
          <template #header>
            <TableHeader :columns="tableColumns" />
          </template>
          <template #body="props">
            <TrackTableRow :row="props.row" />
          </template>
          <template #bottom></template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dummy-table {
  background: transparent;
  width: 100%;
}
.dummy-table tr, .dummy-table th {
  border: none !important;
}
.dummy-table .q-table__bottom {
  min-height: 0 !important;
}

.thumbnail {
  width: 200px;
  height: 200px;
}
th {
  font-size: 16px;
}
</style>
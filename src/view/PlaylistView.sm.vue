<script setup>

import {useSpotifyPlayer} from "../composables/useSpotify.js";
import {computed, inject, ref} from "vue";
import PlaylistThumbnail from "../components/thumbnail/PlaylistThumbnail.vue";
import HighlightBtn from "../components/btn/HighlightBtn.vue";
import TrackTableRow from "../components/table/TrackTableRow.vue";
import {activePlaylistId} from "../services/spotify_service.js";
import {useEventListenerRef} from "../composables/useEventListener.js";
import TableHeader from "../components/table/TableHeader.vue";
import PlaylistFind from "../components/PlaylistFind.vue";

const player = useSpotifyPlayer();

const playlist = inject('playlist');

const defaultColor = inject('defaultColor');
const primaryColor = inject('primaryColor');

const count = computed(() => {
  return playlist.value?.tracks?.items?.length;
});

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
  return `linear-gradient(to bottom, ${primaryColor.value}, ${defaultColor} 500px)`;
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

const computedPlayIcon = computed(() => {
  if (playlist.value?.id === activePlaylistId.value) {
    return player.value?.playing ? 'pause' : 'play_arrow';
  }
  return 'play_arrow';
});

const computedHasTracks = computed(() => {
  return playlist.value?.tracks?.length > 0;
});

const onClick = () => {
  if (activePlaylistId.value && playlist.value?.id === activePlaylistId.value) {
    player.value?.togglePlayer();
    return;
  }
  if (playlist.value?.tracks?.length > 0) {
    player.value?.playPlaylist(playlist.value);
  }
}

const onInviteCollaborators = () => {
  const href = playlist.value?.href;
  if (href) {
    navigator.clipboard.writeText(href);
  } else {

  }
}

const calcPageHeight = inject('calcPageHeight');

const selected = ref([]);

const onSelected = (props) => {
  if (props.selected) {
    selected.value.length = 0;
  } else {
    selected.value.length = 0;
    props.selected = true;
  }
}

</script>

<template>
  <div class="col rounded-borders relative-position" style="overflow-y: scroll" :style="`min-height: ${calcPageHeight}; max-height: ${calcPageHeight}`" ref="container">
    <transition name="fade">
      <div style="position: sticky; top: 0; height: 0; z-index: 9999" v-show="computedShowHeader">
        <div class="row items-center q-gutter-x-sm q-px-lg q-py-sm" :style="`background: ${computedBackground}`">
          <q-btn :icon="computedPlayIcon" color="primary" text-color="dark" size="16px" round @click="onClick" v-show="computedHasTracks" />
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
    <div style="background-attachment: fixed;" :style="`background: ${computedBackground}; min-height: ${calcPageHeight}`" >
      <div class="row q-pa-lg" v-if="playlist">
        <PlaylistThumbnail color="accent" text-color="accent-two" class="col-auto shadow-1 thumbnail" icon-size="lg" :playlist="playlist" />
        <div class="col column justify-end q-mx-lg non-selectable">
          <div class="text-secondary" style="font-size: 15px">{{playlist?.public ? 'Public Playlist' : 'Private Playlist'}}</div>
          <div class="text-secondary text-h3">{{playlist?.name}}</div>
          <div class="row items-center q-gutter-x-sm">
            <div class="text-secondary">{{playlist?.owner?.display_name}}</div>
            <div class="text-secondary-accent">• {{count ?? 0}} song{{count !== 1 ? 's' : ''}}, {{playlist?.getDuration?.()}}</div>
          </div>
        </div>
      </div>
      <div class="column q-px-lg" style="background: linear-gradient(rgba(0, 0, 0, 0.1), #121212)">
        <div class="row items-center q-gutter-x-md q-my-md" ref="btnContainer">
          <q-btn :icon="computedPlayIcon" color="primary" text-color="dark-accent" size="lg" push round @click="onClick" v-show="computedHasTracks" />
          <HighlightBtn class="text-accent-two" active-class="text-secondary" @click="onInviteCollaborators">
            <q-icon size="lg" name="o_person_add" />
            <q-tooltip class="bg-accent shadow-1" anchor="top middle" self="bottom middle" style="font-size: 14px">
              Invite collaborators {{playlist?.name}}
            </q-tooltip>
          </HighlightBtn>
          <HighlightBtn class="text-accent-two" active-class="text-secondary">
            <q-icon size="lg" name="more_horiz" />
            <q-tooltip class="bg-accent shadow-1" anchor="top middle" self="bottom middle" style="font-size: 14px">
              More options for {{playlist?.name}}
            </q-tooltip>
          </HighlightBtn>
        </div>
        <q-table class="playlist-table transparent full-width" :rows="computedRows"
                 :rows-per-page-options="[0]" row-key="index" separator="horizontal"
                 selection="multiple" v-model:selected="selected"
                 dense flat v-show="computedHasTracks">
          <template #header>
            <TableHeader :columns="tableColumns" />
          </template>
          <template #body="props">
            <TrackTableRow :row="props.row" :selected="props.selected" @click="onSelected(props)" />
          </template>
          <template #bottom></template>
        </q-table>
        <div v-show="!computedHasTracks">
          <q-separator />
          <PlaylistFind class="q-py-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.playlist-table .q-table__bottom {
  border: none !important;
}
</style>

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
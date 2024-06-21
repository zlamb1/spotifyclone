<script setup>

import TextNavControl from "../control/TextNavControl.vue";
import TrackPreview from "../TrackPreview.vue";
import {ref} from "vue";
import {useSpotifyPlayer} from "../../composables/useSpotify.js";
import PlaylistContextMenu from "../menu/PlaylistContextMenu.vue";
import ArtistContextMenu from "../menu/ArtistContextMenu.vue";

const props = defineProps({
  row: {
    type: Object,
  },
  selected: {
    type: Boolean,
  },
});

const player = useSpotifyPlayer();

const isHovering = ref(false);

const formatDate = (date) => {
  if (!date) return '';
  const _date = new Date(date);
  const month = _date.toLocaleString('default', { month: 'short' });
  return `${month} ${_date.getDate()}, ${_date.getFullYear()}`;
}

const isPlaying = (id) => {
  return player.value?.playingItem?.id === id;
}

const isActive = (id) => {
  return isPlaying(id) && player.value?.playing;
}

const getPlayIcon = (id) => {
  return isActive(id) ? 'pause' : 'play_arrow';
}

const onPlay = () => {
  if (isPlaying(props.row?.track?.id)) {
    player.value?.togglePlayer();
  } else {
    player.value?.playPlaylist(props.row?.playlist, props.row?.track);
  }
}

</script>

<template>
  <q-tr class="text-accent-two" :style="selected ? 'background: color-mix(in srgb, var(--q-secondary), transparent 93%)' : ''" style="font-size: 24px"
        @dblclick="onPlay" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <PlaylistContextMenu />
    <q-td class="non-selectable" style="border: 0; font-size: 20px; padding-left: 8px !important;" auto-width>
      <div class="flex flex-center" :class="isPlaying(row?.track?.id) ? 'text-primary' : ''" style="width: 20px">
        <q-icon :name="getPlayIcon(row?.track?.id)" class="cursor-pointer" color="secondary" v-if="isHovering" @click="onPlay" />
        <div v-else>
          <q-spinner-audio v-if="isActive(row?.track?.id)" />
          <span v-else>{{row?.index}}</span>
        </div>
      </div>
    </q-td>
    <q-td style="border: 0">
      <TrackPreview :track="row?.track" :show-add-to-playlist="false">
        <template #artist-link>
          <ArtistContextMenu />
        </template>
      </TrackPreview>
    </q-td>
    <q-td style="border: 0;">
      <TextNavControl class="text-accent-two" active-class="text-secondary underline"
                      style="text-decoration: none;"
                      :to="{ name: 'album', params: { id:  row?.track?.album?.id ?? 0 } }">
        {{row?.track?.album?.name}}
      </TextNavControl>
    </q-td>
    <q-td class="non-selectable" style="border: 0">{{formatDate(row?.track?.item?.addedAt)}}</q-td>
    <q-td class="non-selectable" style="border: 0">{{row?.track?.getFormattedDuration()}}</q-td>
  </q-tr>
</template>
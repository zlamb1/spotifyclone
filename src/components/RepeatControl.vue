<script setup>

import {useSpotifyPlayer} from "../composables/useSpotifyAPI.js";

import IconBtn from "./IconBtn.vue";

import SpRepeatMode from "../model/SpRepeatMode.js";

const player = useSpotifyPlayer();

</script>

<template>
  <IconBtn :icon="player.repeatMode === SpRepeatMode.Track ? 'repeat_one' : 'repeat'"
           :icon-color="player.repeatMode !== SpRepeatMode.Off ? 'primary' : undefined" dense @click="player.toggleRepeatMode()" />
</template>
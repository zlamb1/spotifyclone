<script setup>

import { useSpotifyPlayer } from "~/composables/useSpotify.js";

import IconBtn from "../btn/IconBtn.vue";

import SpRepeatMode from "../../model/SpotifyAPI/SpRepeatMode.js";

const player = useSpotifyPlayer();

</script>

<template>
  <IconBtn :icon="player.repeatMode === SpRepeatMode.Track ? 'repeat_one' : 'repeat'"
           :icon-color="player.repeatMode !== SpRepeatMode.Off ? 'primary' : 'secondary-accent'" dense @click="player.toggleRepeatMode()" />
</template>
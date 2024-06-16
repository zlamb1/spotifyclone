<script setup>

import {onMounted, ref, watch} from "vue";

const props = defineProps({
  url: {
    type: String,
  }
});

const error = ref(false);

watch(() => props.url, () => {
  error.value = !props.url;
});

</script>

<template>
  <q-avatar color="accent" rounded>
    <q-icon name="music_note" v-if="error" />
    <q-img :src="url" @load="error = false" @error="error = true" v-else>
      <template #loading>
        <q-spinner size="md" color="primary" />
      </template>
    </q-img>
  </q-avatar>
</template>
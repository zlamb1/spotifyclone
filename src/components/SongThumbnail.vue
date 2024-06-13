<script setup>

import {ref, watch} from "vue";

const props = defineProps({
  url: {
    type: String,
  }
});

const error = ref(false);

watch(() => props.url, (newUrl) => {
  if (!props.url) error.value = true;
})

</script>

<template>
  <q-avatar color="accent" rounded>
    <q-icon name="music_note" color="secondary" v-if="error" />
    <q-img @load="error = false" @error="error = true" v-else>
      <template #loading>
        <q-spinner size="md" color="primary" />
      </template>
    </q-img>
  </q-avatar>
</template>
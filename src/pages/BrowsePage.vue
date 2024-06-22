<script setup>

import { SpotifyWebAPI } from "~/composables/useSpotifyAPI.js";
import { ref } from "vue";

const categories = ref([]);

const fetchCategories = async () => {
  const res = await SpotifyWebAPI.Categories.GetBrowseCategories(20, 0);
  categories.value = res.data;
}

fetchCategories();

</script>

<template>
  <div class="col bg-dark-accent rounded-borders q-px-lg">
    <h4 class="text-secondary non-selectable">Browse All</h4>
    <div class="row q-col-gutter-lg">
      <div class="col-xs-6 col-sm-4 col-md-3 card" v-for="cat in categories">
        <q-img :src="cat.icons[0].url" class="rounded-borders">
          <div class="text-h4 q-ma-lg transparent">{{cat.name}}</div>
        </q-img>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  cursor: pointer;
}
</style>
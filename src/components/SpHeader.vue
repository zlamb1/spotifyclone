<script setup>
import {computed, ref} from "vue";
import {useRouter} from "vue-router";

import IconBtn from "./IconBtn.vue";
import {useQuasar} from "quasar";
import NavControl from "./NavControl.vue";

const $q = useQuasar();
const screen = $q.screen;

const inputEl = ref(null);
const search = ref('');

const router = useRouter();

const inputHasFocus = ref(false);

const showLabel = computed(() => {
  return !inputHasFocus.value && !search.value;
})

const label = computed(() => {
  return showLabel.value ? 'What do you want to play?' : undefined;
});

const onRouteBack = () => {
  router.go(1);
}

const onRouteNext = () => {
  router.go(-1);
}

const onClear = async () => {
  const length = search.value?.length;
  for (let i = 0; i < length; i++) {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 10);
    });

    search.value = search.value?.substring(0, search.value.length - 1);
  }

  inputEl.value?.focus();
}

</script>

<template>
  <q-header>
    <div class="row">
      <div class="row col-3 col-md-4 items-center">
        <div class="flex items-center" v-if="screen.gt.xs">
          <IconBtn icon="chevron_left" icon-size="lg" icon-color="accent-two" round flat @click="onRouteBack" />
          <IconBtn icon="chevron_right" icon-size="lg" icon-color="accent-two" round flat @click="onRouteNext" />
        </div>
        <NavControl to="/" icon="o_home" active-icon="home" active-classes="text-secondary"
                    color="accent" text-color="accent-two" class="q-ml-sm">
          <q-tooltip class="bg-accent" style="font-size: 14px">Home</q-tooltip>
        </NavControl>
      </div>
      <div class="col row justify-center">
        <q-input v-model="search" class="full-width text-h6" color="secondary" bg-color="accent" :label="label"
                 label-color="accent-two" outlined rounded ref="inputEl"
                 @focus="inputHasFocus = true" @blur="inputHasFocus = false">
          <template #prepend>
            <q-btn icon="search" text-color="accent-two" size="lg" dense round flat />
          </template>
          <template #append>
            <q-separator vertical class="q-my-md" color="accent-two" />
            <q-btn icon="clear" size="md" text-color="accent-two" round flat @click="onClear" v-if="search" />
            <NavControl to="/browse" icon="sym_o_browse" active-classes="text-secondary"
                        text-color="accent-two" icon-size="md" v-else>
              <q-tooltip class="bg-accent" style="font-size: 14px">Browse</q-tooltip>
            </NavControl>
          </template>
        </q-input>
      </div>
      <div class="row col-3 col-md-4 items-center justify-end">
        <div v-if="screen.gt.xs">
          <q-btn icon="o_notifications" text-color="accent-two" round flat />
          <q-btn icon="o_groups" text-color="accent-two" round flat />
        </div>
        <q-btn class="q-pa-sm" color="accent" round>
          <q-avatar icon="person" size="md" color="primary" text-color="accent" />
        </q-btn>
      </div>
    </div>
  </q-header>
</template>

<style scoped>
.icon-search:before {
  content: "\e900";
}
</style>
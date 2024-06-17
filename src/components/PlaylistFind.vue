<script setup>

import {computed, ref} from "vue";

const props = defineProps({
  headerText :{
    type: String,
    default: "Let's find something for your playlist"
  },
  inputLabel: {
    type: String,
    default: 'Search for songs or episodes',
  },
});

const search = ref('');
const hasFocus = ref(false);

const input = ref(null);

const computedLabel = computed(() => {
  if (hasFocus.value || search.value) return undefined;
  return props.inputLabel;
});

const onClear = () => {
  search.value = '';
  input.value?.focus();
}

</script>

<template>
  <div class="column q-gutter-y-md">
    <div class="text-h5">{{headerText}}</div>
    <q-input v-model="search" :label="computedLabel" style="width: 300px" dense filled
      @focus="hasFocus = true" @blur="hasFocus = false" ref="input">
      <template #prepend>
        <q-icon name="search" />
      </template>
      <template #append>
        <q-icon name="clear" v-show="search" @click="onClear" />
      </template>
    </q-input>
  </div>
</template>
<script setup>

import HighlightBtn from "../btn/HighlightBtn.vue";

defineProps({
  columns: {
    type: Array,
  },
  fontSize: {
    type: String,
    default: '16',
  },
});

</script>

<template>
  <q-tr>
    <q-th v-for="column in columns" :style="column?.style" :class="column?.class">
      <HighlightBtn :style="column?.btnStyle" :class="column?.btnClass" :active-class="column?.activeBtnClass">
        <div :style="`font-size: ${fontSize}px`" v-if="!column?.icon">{{column?.text}}</div>
        <q-icon :name="column.icon" :style="`font-size: ${fontSize}px`"  v-else />
      </HighlightBtn>
    </q-th>
    <slot />
  </q-tr>
</template>

<style scoped>
tr, th {
  border: none !important;
}
th:first-child {
  padding-left: 8px !important;
}
</style>
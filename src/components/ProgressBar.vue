<script setup>

import ChangeStrategy from "../model/ChangeStrategy.js";
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps({
  changeStrategy: {
    type: Symbol,
    default: ChangeStrategy.Constant,
  },
  progress: {
    type: Number,
    default: 0.5,
  },
  color: {
    type: String,
    default: 'secondary',
  },
  hoverColor: {
    type: String,
    default: undefined,
  },
  trackColor: {
    type: String,
    default: 'primary',
  },
  hoverTrackColor: {
    type: String,
    default: undefined,
  },
  showKnob: {
    type: Boolean,
    default: true,
  },
  knobColor: {
    type: String,
    default: (props) => props.color,
  },
  size: {
    type: Number,
    default: 5,
  },
  hoverOverride: {
    type: Boolean,
    default: undefined,
  },
});

const emit = defineEmits(["update"]);

const trackedProgress = ref(0);
const isGrabbing = ref(false);
const isHovering = ref(false);

const barRef = ref(null);

const computedWidth = computed(() => {
  return props.changeStrategy === ChangeStrategy.Release ?
      trackedProgress.value : props.progress;
})

const sanitizedWidth = computed(() => {
  if (!computedWidth.value || isNaN(computedWidth.value)) return 0;
  return Math.min(Math.max(computedWidth.value, 0), 1) * 100;
});

const computedHovering = computed(() => {
  return props.hoverOverride || isHovering.value;
});

const calculateChange = (mouseX, lastChange) => {
  const $el = barRef.value;
  if ($el) {
    const boundingRect = $el.getBoundingClientRect();
    const deltaX = Math.min(Math.max(mouseX - boundingRect.left, 0), boundingRect.width);
    const percentage = deltaX / boundingRect.width;

    switch (props.changeStrategy) {
      case ChangeStrategy.Constant:
        emit('update', percentage);
        break;
      case ChangeStrategy.Release:
        if (lastChange) {
          emit('update', percentage);
        } else {
          trackedProgress.value = percentage;
        }
        break;
    }
  }
}

const onMouseDown = () => {
  isGrabbing.value = true;
}

onMounted(() => {
  trackedProgress.value = props.progress;

  document.addEventListener('mousemove', (event) => {
    if (isGrabbing.value) {
      calculateChange(event.clientX);
    }
  });

  document.addEventListener('mouseup', (event) => {
    if (isGrabbing.value) {
      isGrabbing.value = false;
      calculateChange(event.clientX, true);
    }
  });
});

watch(() => props.changeStrategy, (newStrategy) => {
  if (newStrategy === ChangeStrategy.Release) {
    trackedProgress.value = props.progress;
  }
});

watch(() => props.progress, (newProgess) => {
  if (props.changeStrategy === ChangeStrategy.Release) {
    trackedProgress.value = newProgess;
  }
});

</script>

<template>
  <div class="outer q-pa-sm" @mousedown="onMouseDown" draggable="false"
       @mouseover="isHovering = true" @mouseleave="isHovering = false">
    <div class="s-progress-bar" :class="`bg-${computedHovering && hoverColor ? hoverColor : color}`"
         :style="`height: ${size}px`" ref="barRef">
      <div class="s-progress-bar-track flex items-center full-height"
           :class="`bg-${computedHovering && hoverTrackColor ? hoverTrackColor : trackColor}`"
           :style="`width: ${sanitizedWidth}%`">
        <div class="s-progress-bar-knob"
             :class="`background: bg-${knobColor}`" v-show="showKnob" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer {
  cursor: grab;
}
.s-progress-bar, .s-progress-bar-track {
  border-radius: 25px;
}
.s-progress-bar-track {
  float: left;
  position: relative;
}
.s-progress-bar-knob {
  width: 12px;
  height: 12px;
  position: absolute;
  right: 0;
  border-radius: 50%;
  border: 1px solid #b5b5b5;
  transform: translateX(50%);
}
</style>
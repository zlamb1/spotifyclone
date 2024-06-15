<script setup>

import ChangeStrategy from "../model/ChangeStrategy.js";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";

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
  showKnobOnHover: {
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
  debounceDuration: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["update"]);

const trackedProgress = ref(0);

const isDebouncing = ref(false);
const isDragging = ref(false);
const isHovering = ref(false);

const barRef = ref(null);

const sanitizedWidth = computed(() => {
  const width = props.changeStrategy === ChangeStrategy.Release ? trackedProgress.value : props.progress;
  if (!width || isNaN(width)) return 0;
  return Math.min(Math.max(width, 0), 1) * 100;
});

const computedHovering = computed(() => {
  return (props.hoverOverride || isHovering.value) && !props.disabled;
});

const computedShowKnob = computed(() => {
  return props.showKnob && (!props.showKnobOnHover || computedHovering.value);
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

const onMouseDown = (event) => {
  if (!props.disabled && event.button === 0) {
    isDragging.value = true;
  }
}

const onMouseMove = (event) => {
  if (isDragging.value) {
    calculateChange(event.clientX);
  }
}

const onTouchStart = () => {
  if (!props.disabled) {
    isDragging.value = true;
  }
}

const onTouchMove = (event) => {
  if (isDragging.value && event?.touches?.length > 0) {
    calculateChange(event.touches[0].clientX);
  }
}

const onTouchEnd = (event) => {
  if (isDragging.value && event?.touches?.length > 0) {
    if (props.changeStrategy === ChangeStrategy.Release && props.debounceDuration > 0) {
      isDebouncing.value = true;
      setTimeout(() => {
        isDebouncing.value = false;
        // reset state of trackedProgress
        trackedProgress.value = props.progress;
      }, props.debounceDuration);
    }
    isDragging.value = false;
    calculateChange(event.touches[0].clientX, true);
  }
}

const onMouseUp = (event) => {
  if (isDragging.value) {
    if (props.changeStrategy === ChangeStrategy.Release && props.debounceDuration > 0) {
      isDebouncing.value = true;
      setTimeout(() => {
        isDebouncing.value = false;
        // reset state of trackedProgress
        trackedProgress.value = props.progress;
      }, props.debounceDuration);
    }
    isDragging.value = false;
    calculateChange(event.clientX, true);
  }
}

onMounted(() => {
  trackedProgress.value = props.progress;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchcancel', onTouchEnd);
  document.addEventListener('touchend', onTouchEnd);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('touchcancel', onTouchEnd);
  document.removeEventListener('touchend', onTouchEnd);
});

watch(() => props.changeStrategy, (newStrategy) => {
  if (newStrategy === ChangeStrategy.Release) {
    trackedProgress.value = props.progress;
  }
});

watch(() => props.progress, (newProgess) => {
  if (props.changeStrategy === ChangeStrategy.Release && !isDragging.value && !isDebouncing.value) {
    trackedProgress.value = newProgess;
  }
});

</script>

<template>
  <div class="outer q-py-sm" @mousedown="onMouseDown"  @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
       draggable="false" :disabled="disabled ? 'true' : undefined"
       @mouseover="isHovering = true" @mouseleave="isHovering = false">
    <div class="s-progress-bar" :class="`bg-${computedHovering && hoverColor ? hoverColor : color}`"
         :style="`height: ${size}px`" ref="barRef">
      <div class="s-progress-bar-track flex items-center full-height"
           :class="`bg-${computedHovering && hoverTrackColor ? hoverTrackColor : trackColor}`"
           :style="`width: ${sanitizedWidth}%`">
        <div class="s-progress-bar-knob"
             :class="`background: bg-${knobColor}`" v-show="computedShowKnob" />
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
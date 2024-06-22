<script setup>

import ChangeStrategy from "~/model/ChangeStrategy.js";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

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
  vertical: {
    type: Boolean,
    default: false,
  },
  inverted: {
    type: Boolean,
    default: false,
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

const sanitizedSize = computed(() => {
  const size = props.changeStrategy === ChangeStrategy.Release ? trackedProgress.value : props.progress;
  if (!size || isNaN(size)) return 0;
  return Math.min(Math.max(size, 0), 1) * 100;
});

const computedHovering = computed(() => {
  return (props.hoverOverride || isHovering.value || isDragging.value) && !props.disabled;
});

const computedShowKnob = computed(() => {
  return props.showKnob && (!props.showKnobOnHover || computedHovering.value);
});

const calculateChange = (position, lastChange) => {
  const $el = barRef.value;
  if ($el) {
    const boundingRect = $el.getBoundingClientRect();
    const edge = props.vertical ? boundingRect.top : boundingRect.left;
    const delta = Math.min(Math.max(position - edge, 0),
        props.vertical ? boundingRect.height : boundingRect.width);
    const size = props.vertical ? boundingRect.height : boundingRect.width;
    const percentage = props.inverted ? (size - delta) / size : delta / size;
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
    calculateChange(props.vertical ? event.clientY : event.clientX);
  }
}

const onTouchStart = () => {
  if (!props.disabled) {
    isDragging.value = true;
  }
}

const trackedMove = ref(0);
const onTouchMove = (event) => {
  if (isDragging.value && event?.touches?.length > 0) {
    const move = props.vertical ? event.touches[0].clientY : event.touches[0].clientX;
    calculateChange(move);
    trackedMove.value = move;
  }
}

const onTouchEnd = (event) => {
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
    calculateChange(trackedMove.value, true);
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
    calculateChange(props.vertical ? event.clientY : event.clientX, true);
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
    <div class="s-progress-bar relative-position" :class="`bg-${computedHovering && hoverColor ? hoverColor : color} ${vertical ? 'vertical' : 'horizontal'}`"
         :style="`--size: ${size}px`" ref="barRef">
      <div class="s-progress-bar-track flex items-center"
           :class="`bg-${computedHovering && hoverTrackColor ? hoverTrackColor : trackColor} ${inverted ? 'inverted' : ''}`"
           :style="`--size: ${sanitizedSize}%`">
        <div class="s-progress-bar-knob"
             :class="`bg-${knobColor} ${vertical ? 'vertical' : 'horizontal'}`" v-show="computedShowKnob" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.outer {
  cursor: grab;
}
.s-progress-bar {
  --size: 0px;
}
.s-progress-bar, .s-progress-bar-track {
  border-radius: 25px;
}
.s-progress-bar.horizontal {
  width: 100%;
  height: var(--size);
}
.s-progress-bar.vertical {
  width: var(--size);
  height: 100%;
}
.s-progress-bar-track {
  --size: 0%;
  position: relative;
}
.s-progress-bar-track.inverted {
  transform: rotate(180deg);
}
.s-progress-bar.horizontal .s-progress-bar-track {
  width: var(--size);
  height: 100%;
}
.s-progress-bar.horizontal .s-progress-bar-track.inverted {
  left: calc(100% - var(--size));
}
.s-progress-bar.vertical .s-progress-bar-track {
  width: 100%;
  height: var(--size);
}
.s-progress-bar.vertical .s-progress-bar-track.inverted {
  top: calc(100% - var(--size));
}
.s-progress-bar-knob {
  width: 12px;
  height: 12px;
  position: absolute;
  border-radius: 50%;
  border: 1px solid #b5b5b5;
}
.s-progress-bar-knob.horizontal {
  right: 0;
  transform: translateX(50%);
}
.s-progress-bar-knob.vertical {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 50%);
}
</style>
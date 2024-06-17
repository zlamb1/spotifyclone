import {onMounted, onUnmounted} from "vue";

export  function useEventListener(target, event, callback) {
    onMounted(() => {
        target.addEventListener(event, callback);
    });
    onUnmounted(() => {
        target.removeEventListener(event, callback);
    })
}

export function useEventListenerRef(target, event, callback) {
    onMounted(() => {
        if (target.value) {
            target.value.addEventListener(event, callback);
        }
    });
    onUnmounted(() => {
        if (target.value) {
            target.value.removeEventListener(event, callback);
        }
    });
}
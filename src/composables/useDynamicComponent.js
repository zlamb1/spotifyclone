import {computed, defineAsyncComponent} from "vue";
import {useQuasar} from "quasar";

export function useIsMobile() {
    const $q = useQuasar();
    return computed(() => $q.screen.lt.sm);
}

export function useDynamicComponent(path) {
    const isMobile = useIsMobile();
    return computed(() => {
        const _path = '../' + path + (isMobile.value ? '.mobile.vue' : '.vue');
        return defineAsyncComponent(() => import(_path));
    });
}
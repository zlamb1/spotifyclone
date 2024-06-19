import {computed, defineAsyncComponent} from "vue";
import {useQuasar} from "quasar";

const BREAKPOINTS = [ 'xs', 'sm', 'md', 'lg', 'xl' ];

export function useIsMobile() {
    const $q = useQuasar();
    return computed(() => $q.screen.lt.sm);
}

export function useDynamicComponent(routes) {
    const $q = useQuasar();
    return computed(() => {
        const breakpoint = $q.screen.name;
        const index = BREAKPOINTS.indexOf(breakpoint);
        if (index < 0) {
            console.error(`Failed to resolve dynamic component due to invalid breakpoint: ${breakpoint}`);
            return null;
        } else {
            for (let i = index; i >= 0; i--) {
                const current = BREAKPOINTS[i];
                if (routes[current]) {
                    return defineAsyncComponent(() => import('../' + routes[current] + '.vue'));
                }
            }

            console.error(`Incorrectly configured component: ${routes}`);
            return null;
        }
    });
}
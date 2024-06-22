import {computed, defineAsyncComponent, ref, shallowRef, watch} from "vue";
import {useQuasar} from "quasar";

const BREAKPOINTS = [ 'xs', 'sm', 'md', 'lg', 'xl' ];

export function useIsMobile() {
    const $q = useQuasar();
    return computed(() => $q.screen.lt.sm);
}

export function useDynamicComponent(routes) {
    const $q = useQuasar();

    const currentRoute = ref('');
    const dynamicComponent = shallowRef();

    const resolveRoute = (breakpoint) => {
        const index = BREAKPOINTS.indexOf(breakpoint);
        if (index < 0) {
            console.error(`Failed to resolve dynamic component due to invalid breakpoint: ${breakpoint}`);
            return null;
        } else {
            for (let i = index; i >= 0; i--) {
                const current = BREAKPOINTS[i];
                if (routes[current]) {
                    const route = routes[current];
                    const importName = './src/' + route + '.vue';
                    if (importName !== currentRoute.value) {
                        currentRoute.value = importName;
                        dynamicComponent.value = defineAsyncComponent(() => import(importName));
                        return;
                    }
                }
            }

            console.error(`Incorrectly configured component: `, routes);
            return null;
        }
    }

    const breakpoint = computed(() => $q.screen.name);
    resolveRoute(breakpoint.value);
    watch(breakpoint, () => {
        resolveRoute(breakpoint.value)
    });

    return dynamicComponent;
}
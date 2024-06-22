import { fileURLToPath, URL } from "url";
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        supported: {
            'top-level-await': true,
        },
    },
    plugins: [
        vue({
            transformAssetUrls
        }),
        quasar({
            sassVariables: 'src/quasar-variables.sass'
        }),
    ],
    resolve: {
        alias: [
            { find: '~', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ],
    },
})

import { createApp } from 'vue';
import {
    Quasar,
    LocalStorage,
    SessionStorage
} from 'quasar';

import App from './App.vue';

// Import Spotify services
import './services/spotify_service.js';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

// Create router
import HomePage from "./pages/HomePage.vue";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    { path: '/', component: HomePage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Create app
const app = createApp(App);

app.use(Quasar, {
    config: {
        dark: 'auto',
    },
    plugins: {
        LocalStorage,
        SessionStorage
    }, // import Quasar plugins and add here
});

app.use(router);

app.mount('#app');
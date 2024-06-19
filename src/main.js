import { createApp } from 'vue';
import {
    Quasar,
    LocalStorage,
    SessionStorage, Notify
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
import {createRouter, createWebHistory} from "vue-router";

import HomePage from "./pages/HomePage.vue";
import BrowsePage from "./pages/BrowsePage.vue";
import PlaylistPage from "./pages/PlaylistPage.vue";

const routes = [
    { path: '/', component: HomePage },
    { path: '/library', component: HomePage },
    { path: '/search', component: HomePage },
    { path: '/browse', component: BrowsePage },
    { path: '/playlist/:id', name: 'playlist', component: PlaylistPage },
    { path: '/track/:id', name: 'track', component: HomePage },
    { path: '/artist/:id', name: 'artist', component: HomePage },
    { path: '/album/:id', name: 'album', component: HomePage }
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
        SessionStorage,
        Notify,
    }, // import Quasar plugins and add here
});

app.use(router);

app.mount('#app');
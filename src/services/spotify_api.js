import { SessionStorage } from 'quasar'

const clientId = '00f1b2d78e0c482c95743608061e35d3';
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

const location = window.location;
const redirectUri = location.protocol + '//' + location.host + location.pathname;

// config
const scopes = 'user-read-private user-read-email ' +
    'user-read-playback-state user-modify-playback-state user-read-currently-playing ' +
    'app-remote-control streaming ';

let accessToken = undefined;

if (SessionStorage.has('spotify_access_token')) {
    accessToken = SessionStorage.getItem('spotify_access_token');
    if (SessionStorage.has('spotify_refresh_token')) {
        await refreshTokens(clientId);
    } else {
        // TODO: handle
    }
} else {
    if (code) {
        window.history.pushState({}, '', '/');
        const request = await requestTokens(clientId, code);
        if (request.ok) {
            const {access_token, refresh_token} = await request.json();
            setTokens(access_token, refresh_token);
        } else {
            console.error('[SpotifyAPI]: Error while requesting API token.');
        }
    } else {
        await redirectToAuthCodeFlow(clientId);
    }
}

async function refreshTokens(clientId) {
    const refreshToken = SessionStorage.getItem('spotify_refresh_token');
    if (refreshToken) {
        const url = "https://accounts.spotify.com/api/token";
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId
            }),
        }

        const result = await fetch(url, payload);
        if (result.ok) {
            const {access_token, refresh_token} = await result.json();
            setTokens(access_token, refresh_token);
        }
    }
}

function setTokens(newAccessToken, newRefreshToken) {
    SessionStorage.set('spotify_access_token', newAccessToken);
    accessToken = newAccessToken;

    SessionStorage.set('spotify_refresh_token', newRefreshToken);
}

async function requestTokens(clientId, code){
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);
    params.append("code_verifier", verifier);

    return fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
}

async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", redirectUri);
    params.append("scope", scopes);
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export async function fetchSpotifyAPI(request) {
    if (!accessToken) {
        console.error('[SpotifyAPI]: Attempted to make API call with invalid access token.');
        return;
    }

    if (request.url) {
        const requestInit = {
            method: request.method ?? 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Access-Control-Request-Headers': 'Retry-After',
            },
            body: request.body ?? undefined,
        }

        const result = await fetch(request.url, requestInit);

        // expired token
        if (result.status === 401) {
            await refreshTokens(clientId);
            // make one more attempt
            return await fetch(request.url, requestInit);
        }

        if (result.status === 429) {
            console.log(result.headers)
        }

        return result;
    } else {
        console.error('[SpotifyAPI]: Attempted to make API call with no URL.');
    }
}

export { accessToken }
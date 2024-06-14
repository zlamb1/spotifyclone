export default class SpSong {
    constructor() {
        this.name = '';
        this.artists = [];
        this.is_playable = true;
        this.album = {};
        this.duration = 0;
        this.id = '';

        this.retrieveFirstImage = () => {
            if (this.album?.images?.length > 0) {
                return this.album.images[0].url;
            }
        }
    }

    static FromSpotifyAPI(apiSong) {
        if (!apiSong) {
            return null;
        }

        const song = new SpSong();
        song.name = apiSong.name;
        song.artists = apiSong.artists;
        song.is_playable = apiSong.is_playable;
        song.album = apiSong.album;
        song.duration = apiSong.duration_ms;
        song.id = apiSong.id;
        return song;
    }
}
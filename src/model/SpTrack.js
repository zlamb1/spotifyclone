export default class SpTrack {
    constructor(data) {
        this.name = data.name;
        this.artists = data.artists;
        this.is_playable = data.is_playable;
        this.album = data.album;
        this.duration = data.duration_ms;
        this.id = data.id;

        this.retrieveFirstImage = () => {
            if (this.album?.images?.length > 0) {
                return this.album.images[0].url;
            }
        }
    }
}
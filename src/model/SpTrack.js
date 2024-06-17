export default class SpTrack {
    constructor(item, data) {
        this.item = item;

        this.name = data.name;
        this.artists = data.artists;
        this.is_playable = data.is_playable;
        this.album = data.album;
        this.duration = data.duration_ms;
        this.id = data.id;

        this.getUri = () => {
            return 'spotify:track:' + this.id;
        }

        this.retrieveFirstImage = () => {
            if (this.album?.images?.length > 0) {
                return this.album.images[0].url;
            }
        }

        this.getFormattedDuration = () => {
            const duration = this.duration ?? 0;
            const seconds = Math.floor(duration / 1000) % 60;
            const minutes = Math.floor(duration / 1000 / 60) % 60;
            return `${minutes}:${(seconds < 10 ? '0' : '') + seconds}`;
        }
    }
}
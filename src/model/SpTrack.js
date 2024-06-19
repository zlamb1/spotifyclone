export default class SpTrack {
    constructor(data, item) {
        this.name = data.name;
        this.artists = data.artists;
        this.is_playable = data.is_playable;
        this.album = data.album;
        this.duration = data.duration_ms;
        this.id = data.id;

        this.item = item;

        this.getUri = () => {
            return 'spotify:track:' + this.id;
        }

        this.getFirstImage = () => {
            if (this.album?.images?.length > 0) {
                return this.album.images[0].url;
            }
        }

        this.getFirstArtist = () => {
            if (this.artists?.length > 0) {
                return this.artists[0].name;
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
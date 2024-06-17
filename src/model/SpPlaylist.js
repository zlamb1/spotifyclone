import SpTrack from "./SpTrack.js";
import SpItem from "./SpItem.js";

export default class SpPlaylist {
    constructor(data) {
        this.id = data.id;
        this.images = data.images;
        this.name = data.name;
        this.owner = data.owner;
        this.public = data.public;
        this.href = data.external_urls.spotify;

        this.tracks = data?.tracks?.items?.map((item) => new SpTrack(new SpItem(item), item.track));

        this.getDuration = () => {
            if (!this.tracks) return '';

            let duration = 0;
            for (const track of this?.tracks) {
                duration += track?.duration;
            }

            const seconds = Math.floor(duration / 1000) % 60;
            const minutes = Math.round(duration / 1000 / 60) % 60;
            const hours = Math.floor(duration / 1000 / 60 / 60);

            if (hours > 0) return hours + ` hour${hours > 1 ? 's' : ''} ${minutes} min`;
            return `${minutes} min ${seconds} sec`;
        }
    }
}
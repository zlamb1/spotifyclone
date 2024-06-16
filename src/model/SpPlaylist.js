import SpTrack from "./SpTrack.js";

export default class SpPlaylist {
    constructor(data) {
        this.id = data.id;
        this.images = data.images;
        this.name = data.name;
        this.owner = data.owner;
        this.public = data.public;

        this.tracks = data?.tracks?.items?.map((item) => new SpTrack(item.track));

        this.getDuration = () => {
            let duration = 0;
            for (const track of this.tracks) {
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
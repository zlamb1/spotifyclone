import SpTrack from "./SpTrack.js";

export default class SpHistoryItem {
    constructor(data) {
        this.track = new SpTrack(data.track);
        this.playedAt = data.played_at;
        this.context = data.context;
    }
}
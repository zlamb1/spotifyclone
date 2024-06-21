import SpStatus from "./SpotifyAPI/SpStatus.js";

export default class SpResult {
    constructor(data, status, next) {
        this.data = data;
        this.status = status;
        this.next = next;

        this.ok = () => {
            return this.status === SpStatus.Okay;
        }
    }
}
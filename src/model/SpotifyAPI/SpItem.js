export default class SpItem {
    constructor(data) {
        this.addedAt = data.added_at;
        this.addedBy = data.added_by;
        this.isLocal = data.is_local;
    }
}
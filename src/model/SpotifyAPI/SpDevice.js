import SpDeviceType from "./SpDeviceType.js";

export default class SpDevice {
    constructor() {
        this.id = 0;
        this.active = false;
        this.private = false;
        this.name = '';
        this.type = SpDeviceType.Unknown;
        this.volume = 0;
        this.supportsVolume = false;
    }

    static FromSpotifyAPI(device) {
        if (!device) return null;
        const spDevice = new SpDevice();
        spDevice.id = device.id;
        spDevice.active = device.is_active;
        spDevice.private = device.is_private_session;
        spDevice.name = device.name;
        spDevice.type = SpDeviceType.FromSpotifyAPI(device.type);
        spDevice.volume = device.volume_percent;
        spDevice.supportsVolume = device.supports_volume;
        return spDevice;
    }
}
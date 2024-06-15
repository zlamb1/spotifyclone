const SpDeviceType = Object.freeze({
    Computer: Symbol('Computer'),
    Phone: Symbol('Phone'),
    Speaker: Symbol('Speaker'),
    Unknown: Symbol('Unknown'),

    FromSpotifyAPI: (type) => {
        switch (type) {
            case 'Computer':
                return SpDeviceType.Computer;
            case 'Smartphone':
                return SpDeviceType.Phone;
            case 'Speaker':
                return SpDeviceType.Speaker;
            default:
                return SpDeviceType.Unknown;
        }
    }
});

export default SpDeviceType;
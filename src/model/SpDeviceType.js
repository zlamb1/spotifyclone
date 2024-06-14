const SpDeviceType = Object.freeze({
    Computer: Symbol('Computer'),
    Phone: Symbol('Phone'),
    Speaker: Symbol('Speaker'),
    Unknown: Symbol('Unknown'),

    FromSpotifyAPI: (type) => {
        switch (type) {
            case 'computer':
                return SpDeviceType.Computer;
            case 'smartphone':
                return SpDeviceType.Phone;
            case 'speaker':
                return SpDeviceType.Speaker;
            default:
                return SpDeviceType.Unknown;
        }
    }
});

export default SpDeviceType;
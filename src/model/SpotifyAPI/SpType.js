const SpType = Object.freeze({
    Track: Symbol('Track'),
    Episode: Symbol('Episode'),
    Unknown: Symbol('Unknown'),

    FromSpotifyAPI: (type) => {
        switch(type) {
            case 'track': return SpType.Track;
            case 'episode': return SpType.Episode;
            default: return SpType.Unknown;
        }
    }
});

export default SpType;
const SpRepeatMode = Object.freeze({
    Off: Symbol('Off'),
    Context: Symbol('Context'),
    Track: Symbol('Track'),

    NextMode: (repeatMpde) => {
        switch (repeatMpde) {
            case SpRepeatMode.Off:
                return SpRepeatMode.Context;
            case SpRepeatMode.Context:
                return SpRepeatMode.Track;
            case SpRepeatMode.Track:
                return SpRepeatMode.Off;
            default: return SpRepeatMode.Off;
        }
    },

    FromSpotifyAPI: (repeatMode) => {
        switch (repeatMode) {
            case 0:
            case 'off':
                return SpRepeatMode.Off;
            case 1:
            case 'context':
                return SpRepeatMode.Context;
            case 2:
            case 'track':
                return SpRepeatMode.Track;
            default: return SpRepeatMode.Off;
        }
    },
});

export default SpRepeatMode;
const SpStatus = Object.freeze({
    Okay: Symbol('Okay'),
    RateLimit: Symbol('RateLimit'),
    APIError: Symbol('APIError'),
    Unknown: Symbol('Unknown'),

    IsError: (err) => {
        switch (err) {
            case SpStatus.RateLimit:
            case SpStatus.APIError:
                return true;
            default: return false;
        }
    }
});

export default SpStatus;
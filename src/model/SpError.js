const SpError = Object.freeze({
    RateLimit: Symbol('RateLimit'),
    APIError: Symbol('APIError'),

    IsError: (err) => {
        switch (err) {
            case SpError.RateLimit:
            case SpError.APIError:
                return true;
            default: return false;
        }
    }
});

export default SpError;
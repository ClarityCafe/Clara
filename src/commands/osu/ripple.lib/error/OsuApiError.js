'use strict';

/**
 * Error from the osu! API.
 */
class OsuApiError extends Error {
    /**
     * Creates the osu! API error object.
     * @param  {String} message     Describes the error caused from the osu! API.
     * @return {OsuApiError}        The API error object.
     */
    constructor(message) {
        super(message);
        this.name = 'OsuApiError';
    }
}

module.exports = OsuApiError;
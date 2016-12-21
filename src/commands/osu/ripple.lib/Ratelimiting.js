'use strict';

const RateLimiter = require('limiter').RateLimiter;

/**
 * Class to handle ratelimiting.
 */
class Ratelimiting {
    constructor(api) {
        this.api = api;

        this.mainBucket = new RateLimiter(api.requestsPerMinute, 'minute');
        this.replayBucket = new RateLimiter(10, 'minute');
    }
}

module.exports = Ratelimiting;
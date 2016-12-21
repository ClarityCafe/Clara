'use strict';

const https = require('https')
    , querystring = require('querystring');

const ApiConstants = require('./Constants').API
    , OsuApiError = require('./error/OsuApiError');

/**
 * Class for API requests
 * @property {String} userAgent The useragent used to make requests.
 */
class Requester {
    /**
     * Creates the internal requester
     * @return {Requester} A Requester instance
     */
    constructor(api) {
        this.api = api;
        this.userAgent = `nodesu v${require('../package.json').version} (https://github.com/nicholastay/nodesu)`;
    }

    /**
     * Gets data from an API endpoint.
     * @param  {String} endpoint        The endpoint to get the data from.
     * @param  {Object} payloadOptions  An object of options to be used as the query string.
     * @param  {Boolean} withKey        To use the API key defined in the parent client or not.
     * @param  {Boolean} ratelimit      Ratelimit the request on the main bucket if ratelimiting is enabled.
     * @return {Promise<Object>}        The returned data from the API.
     */
    get(endpoint, payloadOptions, withKey, ratelimit) {
        if (ratelimit && !this.api.disableRateLimiting) {
            // this probably needs to be cleaned up somehow
            return new Promise((resolve, reject) => {
                this.api.ratelimiting.mainBucket.removeTokens(1, () => {
                    this._get(endpoint, payloadOptions, withKey)
                        .then(resolve)
                        .catch(reject);
                });
            });
        }

        return this._get(endpoint, payloadOptions, withKey);
    }

    _get(endpoint, payloadOptions, withKey) {
        let options = {};
        if (withKey)    
            options.k = this.api.apiKey; // api key
        Object.assign(options, payloadOptions || {}); // merge in payload of options

        const requestOptions = {
            hostname: ApiConstants.HOST,
            path: `${ApiConstants.BASE_PATH}${endpoint}?${querystring.stringify(options)}`,
            headers: {
                'User-Agent': this.userAgent
            }
        };

        return new Promise((resolve, reject) => {
            https.get(requestOptions, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.once('end', () => {
                    // parse json
                    let j;
                    try {
                        j = JSON.parse(data);
                    }
                    catch (e) {
                        reject(e);
                    }

                    if (j.error) // error from api
                        reject(new OsuApiError(j.error));

                    resolve(j); // resolve json
                });
            })
        });
    }
}

module.exports = Requester;
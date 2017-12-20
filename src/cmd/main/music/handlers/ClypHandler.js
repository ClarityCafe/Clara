/**
 * @file Music handler for Clyp.it sources.
 * @author Ovyerus
 */

const got = require('got');

class ClypHandler {
    constructor() {}

    getInfo(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            got(`https://api.clyp.it/${url.split('/').pop()}`).then(res => {
                let body = JSON.parse(res.body);
                let r = {
                    url,
                    stream: body.SecureOggUrl,
                    title: body.Title,
                    uploader: 'N/A',
                    thumbnail: body.ArtworkPictureUrl || 'https://static.clyp.it/site/images/logos/clyp-og-1200x630.png',
                    length: Math.floor(body.Duration),
                    type: 'ClypAudio'
                };

                return r;
            }).then(resolve).catch(reject);
        });
    }

    getStream(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            got(`https://api.clyp.it/${url.split('/').pop()}`).then(res => {
                let body = JSON.parse(res.body);

                return got.stream(body.SecureOggUrl);
            }).then(resolve).catch(reject);
        });
    }
}

module.exports = ClypHandler;
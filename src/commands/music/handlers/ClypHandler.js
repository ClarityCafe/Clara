const got = require('got');

class ClypHandler {
    constructor() {}

    getInfo(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            let reqURL = `https://api.clyp.it/${api.split('/').pop()}`;
            got(reqURL).then(res => {
                let body = JSON.parse(res.body);
                let r = {
                    url: body.SecureOggUrl,
                    title: body.title,
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

            this.getInfo(url).then(info => {
                return [got.stream(info.url), info];
            }).then(resolve).catch(reject);
        });
    }
}

module.exports = ClypHandler;
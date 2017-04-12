const scr = require('soundcloud-resolve');
const got = require('got');

class SoundCloudHandler {
    constructor(bot) {
        this.clientID = bot.config.soundCloudKey;
    }

    getInfo(url) {
        return new Promise(resolve => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            scr(this.clientID, url, (err, json, url) => {
                if (err) throw err;

                let res = {
                    url,
                    title: json.title,
                    uploader: json.user.username,
                    thumbnail: json.artwork_url,
                    length: json.duration,
                    type: 'SoundCloudTrack'
                };

                resolve(res);
            });
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

module.exports = SoundCloudHandler;
/**
 * @file Music handler for SoundCloud.com tracks.
 * @author Ovyerus
 */

const scr = require('soundcloud-resolve');
const got = require('got');

class SoundCloudHandler {
    constructor(bot) {
        this.clientID = bot.config.soundCloudKey;
    }

    getInfo(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            scr(this.clientID, url, (err, json, stream) => {
                if (err) {
                    reject(err);
                } else {
                    let res = {
                        url: json.permalink_url,
                        stream,
                        title: json.title,
                        uploader: json.user.username,
                        thumbnail: json.artwork_url,
                        length: json.duration / 1000,
                        type: 'SoundCloudTrack'
                    };

                    resolve(res);
                }
            });
        });
    }

    getStream(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            this.getInfo(url).then(info => {
                let stream = info.stream;
                delete info.stream;

                return [got.stream(stream), info];
            }).then(resolve).catch(reject);
        });
    }
}

module.exports = SoundCloudHandler;
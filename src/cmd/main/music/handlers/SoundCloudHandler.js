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

            scr(this.clientID, url, (err, json) => {
                if (err) {
                    reject(err);
                } else {
                    let res = {
                        url: json.permalink_url,
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

            scr(this.clientID, url, (err, _, stream) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(got.stream(stream));
                }
            });
        });
    }
}

module.exports = SoundCloudHandler;
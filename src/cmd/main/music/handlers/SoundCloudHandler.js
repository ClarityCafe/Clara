/**
 * @file Music handler for SoundCloud.com tracks.
 * @author Ovyerus
 */

const got = require('got');

class SoundCloudHandler {
    constructor(bot) {
        this.clientID = bot.config.tokens.soundcloud;
    }

    async getInfo(url) {
        if (typeof url !== 'string') throw new TypeError('url is not a string.');

        return await infoGetter(this.clientID, url);
    }

    async getStream(url) {
        if (typeof url !== 'string') throw new TypeError('url is not a string.');

        let res = await infoGetter(this.clientID, url, true);
        return await got.stream(res);
    }
}

async function infoGetter(clientID, url, stream) {
    let res = await got(`https://api.soundcloud.com/resolve?client_id=${clientID}&url=${url}`);
    res = JSON.parse(res.body);

    if (res.errors) throw res.errors[0].error_message;

    if (!stream) {
        return {
            url: res.permalink_url,
            title: res.title,
            uploader: res.user.user_name,
            thumbnail: res.artwork_url || res.user.avatar_url,
            length: res.duration / 1000,
            type: 'SoundCloudTrack'
        };
    } else return `${res.stream_url}?client_id=${clientID}`;
}

module.exports = SoundCloudHandler;
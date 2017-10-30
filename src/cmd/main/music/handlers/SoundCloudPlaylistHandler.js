/**
 * @file Music handler for SoundCloud.com playlists.
 * @author Ovyerus
 */

const got = require('got');

class SoundCloudPlaylistHandler {
    constructor(bot) {
        this.maxGet = bot.config.musicPlaylistMaxAmt || 200;
        this.clientID = bot.config.soundCloudKey;
    }

    async getPlaylist(url) {
        if (typeof url !== 'string') throw new TypeError('url is not a string.');

        let pl = await infoGetter(this.clientID, url);

        if (pl.tracks.filter(t => t.kind === 'track').length === 0) throw new Error('Playlist is empty.');

        let ret = {
            title: pl.title,
            items: []
        };

        for (let item of pl.tracks.filter(t => t.kind === 'track')) {
            if (ret.items.length >= this.maxGet) break;

            ret.items.push({
                url: item.permalink_url,
                title: item.title,
                uploader: item.user.username,
                thumbnail: item.artwork_url || item.user.avatar_url,
                length: item.duration / 1000,
                type: 'SoundCloudTrack'
            });
        }

        return ret;
    }
}

async function infoGetter(clientID, url) {
    let res = await got(`https://api.soundcloud.com/resolve?client_id=${clientID}&url=${url}`);
    res = JSON.parse(res.body);

    if (res.errors) throw res.errors[0].error_message;

    return res;
}

module.exports = SoundCloudPlaylistHandler;
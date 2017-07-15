/**
 * @file Music handler for SoundCloud.com playlists.
 * @author Ovyerus
 */

const scr = require('soundcloud-resolve');

class SoundCloudPlaylistHandler {
    constructor(bot) {
        this.maxGet = bot.config.musicPlaylistMaxAmt || 200;
        this.clientID = bot.config.soundCloudKey;
    }

    getPlaylist(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            scr(this.clientID, url, (err, pl) => {
                if (err) {
                    reject(err);
                } else {
                    if (pl.tracks.filter(t => t.kind === 'track').length === 0) throw new Error('Playlist is empty.');

                    let returnMe = {
                        title: pl.title,
                        items: []
                    };

                    for (let item of pl.tracks.filter(t => t.kind === 'track')) {
                        if (pl.tracks.indexOf(item) >= this.maxGet) break;

                        returnMe.items.push({
                            url: item.permalink_url,
                            title: item.title,
                            uploader: item.user.username,
                            thumbnail: item.artwork_url,
                            length: item.duration / 1000,
                            type: 'SoundCloudTrack'
                        });
                    }

                    resolve(returnMe);
                }
            });
        });
    }
}

module.exports = SoundCloudPlaylistHandler;
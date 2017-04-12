const twitch = require('twitch.tv');
const twitchStream = require('twitch-get-stream');
const got = require('got');

class TwitchHandler {
    constructor(bot) {
        this.streamGetter = twitchStream(bot.config.twitchKey);
    }
    
    getInfo(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            twitchInfo(`streams/${url.split('/').pop()}`, {clientID: this.clientID}).then(res => {
                let r = {
                    title: res.status,
                    uploader: res.display_name,
                    thumbnail: res.video_banner,
                    length: 'Unknown',
                    type: 'TwitchStream'
                };

                return Promise.all([this.streamGetter(url.split('/').pop()), r]);
            }).then(res => {
                let want = res[0].find(s => s.quality === 'Audio Only');
                if (!want) throw new Error('Unable to find ideal quality for Twitch stream.');

                res[1].url = want.url;
                return res[1];
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

// Promises are dank yo
function twitchInfo(url, options) {
    return new Promsie(resolve => {
        twitch(url, options, (err, res) => {
            if (err) throw err;
            resolve(res);
        });
    });
}

module.exports = TwitchHandler;
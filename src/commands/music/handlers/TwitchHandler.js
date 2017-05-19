const twitch = require('twitch.tv');
const twitchStream = require('twitch-get-stream');

class TwitchHandler {
    constructor(bot) {
        this.clientID = bot.config.twitchKey;
        this.streamGetter = twitchStream(bot.config.twitchKey);
    }
    
    getInfo(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            twitchInfo(`streams/${url.split('/').pop()}`, {clientID: this.clientID}).then(res => {
                let r = {
                    url,
                    title: res.channel.status,
                    uploader: res.display_name,
                    thumbnail: res.preview.large,
                    length: 'Unknown',
                    type: 'TwitchStream'
                };

                return Promise.all([this.streamGetter.get(url.split('/').pop()), r]);
            }).then(res => {
                let want = res[0].find(s => s.quality === 'Audio Only');
                if (!want) throw new Error('Unable to find ideal quality for Twitch stream.');

                res[1].stream = want.url;
                return res[1];
            }).then(resolve).catch(reject);
        });
    }

    getStream(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            this.getInfo(url).then(info => {
                let stream = info.stream;
                delete info.stream;
                
                return [stream, info];
            }).then(resolve).catch(reject);
        });
    }
}

// Promises are dank yo
function twitchInfo(url, options) {
    return new Promise(resolve => {
        twitch(url, options, (err, res) => {
            if (err) throw err;
            resolve(res.stream);
        });
    });
}

module.exports = TwitchHandler;
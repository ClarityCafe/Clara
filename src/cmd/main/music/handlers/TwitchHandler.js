/**
 * @file Music handler for Twitch.tv streams.
 * @author Ovyerus
 */

// TFW two libraries.
// I'll probably write my own thing for 0.4
const twitch = require('twitch.tv');
const twitchStream = require('twitch-get-stream');

class TwitchHandler {
    constructor(bot) {
        this.clientID = bot.config.tokens.twitch;
        this.streamGetter = twitchStream(bot.config.tokens.twitch);
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

                return r;
            }).then(resolve).catch(reject);
        });
    }

    getStream(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            this.streamGetter.get(url.split('/').pop()).then(res => {
                return res.find(s => s.quality === 'Audio Only').url;
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
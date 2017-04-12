const ytdl = require('ytdl');

class YouTubeHandler {
    constructor() {}

    getInfo(url) {
        return new Promise(resolve => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            ytdl.getInfo(url, {filter: 'audioonly'}).then(info => {
                let bitrates = info.formats.filter(f => f.audioBitrate <= 96 && typeof f.audioBitrate === 'number');
                bitrates = bitrates.map(f => {return {bitrate: f.bitrate, url: f.url};}).sort((a, b) => b.bitrate - a.bitrate);

                let res = {
                    url: bitrates[0].url,
                    title: info.fulltitle,
                    uploader: info.uploader,
                    thumbnail: info.thumbnail,
                    length: formatToSeconds(info.duration),
                    type: 'YouTubeVideo'
                };

                return res;
            }).then(resolve).catch(reject);
        });
    }

    getStream(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');
            
            this.getInfo(url).then(info => {
                return [ytdl(info.url), info];
            }).then(resolve).catch(reject);
        });
    }
}

module.exports = YouTubeHandler;
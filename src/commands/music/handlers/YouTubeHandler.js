const ytdl = require('ytdl-core');
// const got = require('got');

class YouTubeHandler {
    constructor() {}

    getInfo(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            ytdl.getInfo(url, {filter: 'audioonly'}).then(info => {
                let res = {
                    url,
                    title: info.title,
                    uploader: info.author.name,
                    thumbnail: info.thumbnail_url.replace('default.jpg', 'hqdefault.jpg'),
                    length: Number(info.length_seconds),
                    type: 'YouTubeVideo',
                    formats: info.formats
                };

                return res;
            }).then(resolve).catch(reject);
        });
    }

    getStream(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');
            
            this.getInfo(url).then(info => {
                let bitrates = info.formats.filter(f => f.audioBitrate <= 96 && typeof f.audioBitrate === 'number');
                bitrates = bitrates.map(f => {return {bitrate: f.bitrate, url: f.url};}).sort((a, b) => b.bitrate - a.bitrate);

                delete info.formats;
                return [bitrates[0].url, info];
            }).then(resolve).catch(reject);
        });
    }
}

module.exports = YouTubeHandler;
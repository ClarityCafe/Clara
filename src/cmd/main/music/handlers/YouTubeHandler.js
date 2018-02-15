/**
 * @file Music handler for YouTube videos. Does not support livestreams.
 * @author Ovyerus
 */

const ytdl = require('youtube-dl');
const got = require('got');

// List of all itag qualities can be found here: https://en.wikipedia.org/w/index.php?title=YouTube&oldid=800910021#Quality_and_formats.
const ITAG = '140'; // Preferred itag quality to get. Default: 140.
const ITAG_FALLBACK = '22'; // In the event that the previous itag could not be found, try finding this one. Should probably be a lower value.

class YouTubeHandler {
    constructor() {}

    async getInfo(url) {
        if (typeof url !== 'string') throw new TypeError('url is not a string.');

        let info = await new Promise((res, rej) => ytdl.getInfo(url, (err, i) => err ? rej(err) : res(i)));
        let res = {
            url,
            title: info.title,
            uploader: info.author.name,
            thumbnail: info.thumbnail_url.replace('default.jpg', 'hqdefault.jpg'),
            length: Number(info.length_seconds),
            type: 'YouTubeVideo'
        };

        return res;
    }

    async getStream(url) {
        if (typeof url !== 'string') throw new TypeError('url is not a string.');
            
        let info = await new Promise((res, rej) => ytdl.getInfo(url, (err, i) => err ? rej(err) : res(i)));
        let format = info.formats.find(f => f.itag === ITAG) || info.formats.find(f => f.itag === ITAG_FALLBACK);
        format = format ? format.url : info.url; // Fallback to default URL if the wanted itags could not be found;

        return got.stream(format);
    }
}

module.exports = YouTubeHandler;

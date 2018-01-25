/**
 * @file Music handler for YouTube videos. Does not support livestreams.
 * @author Ovyerus
 */

const ytdl = require('ytdl-core');
const got = require('got');

const ITAG = '251'; // Preferred iTag quality to get. Default: 251.

class YouTubeHandler {
    constructor() {}

    async getInfo(url) {
        if (typeof url !== 'string') throw new TypeError('url is not a string.');

        let info = await ytdl.getInfo(url);
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
            
        let info = await ytdl.getInfo(url);
        return got.stream(info.formats.find(f => f.itag === ITAG).url);
    }
}

module.exports = YouTubeHandler;
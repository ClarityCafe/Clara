/**
 * @file Template handler for music handler.
 * @author Ovyerus
 */

/* eslint-disable */
const got = require('got');

class TemplateHandler {
    /**
     * Initiates the handler.
     * 
     * @param {Eris.Client} [bot] Instance of the bot.
     */
    constructor(bot) {
        this.whatever = bot.something; 
    }

    /**
     * Get info for the provider the handler is designed for.
     * 
     * @param {String} url URL that the provider handles.
     * @returns {Promise<Object>} Info object that should be returned.
     */
    getInfo(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');

            doSomethingThatGetsData(url, otherShitIDK).then(r => {
                let res = {
                    url, // Human readable URL, most of the time should just be the one that got passed to the function.
                    title, // Name of the audio thing.
                    uploader, // Uploader. If not applicable, just put 'N/A'
                    thumbnail, // Thumbnail for the source. Can just be some logo of the provider.
                    length, // Length in seconds of the source. If unknown, put 'Unknown'.
                    type: 'NameOfServiceAndType' // ie. YouTubeVideo, SoundCloudTrack
                    // You can other stuff here, ie. a raw stream source to pass to getStream.
                };

                return res;
            }).then(resolve).catch(reject);
        });
    }

    /**
     * Get the stream for the service.
     * 
     * @param {String} url URL that the provider handles. 
     * @returns {Promise<Array>} Index 0 should be the stream, index 1 should be the info object.
     */
    getStream(url) {
        return new Promise((resolve, reject) => {
            if (typeof url !== 'string') throw new TypeError('url is not a string.');
            
            this.getInfo(url).then(info => {
                // Do processing to get the stream url, if need be.
                return [got.stream(info.url), info]; // First argument should be `got.stream(streamURL)`. If you have issues with that for some reason, just pass the stream string and Eris will handle it.
            }).then(resolve).catch(reject);
        });
    }
}

module.exports = TemplateHandler;
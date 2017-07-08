/* SauceNao query Handler
 * 
 * 
 * Contributed by Capuccino
 */

const got = require('got');
const urlRegex = str => /(http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(str);

/** 
 * Query Handler for SauceNao-related requests.
 */

class SauceHandler {
    /**
     * @param {String} key your API Key for Saucenao
     * @param {Number} outputType type of output you want the API to show. Default is value 2 (JSON Response)
     * @param {Number} numRes amount of responses you want returned from the API. Default is 5 Responses.
     * @see {link} https://saucenao.com/user.php?page=search-api
     */
    constructor({key, numRes, outputType}) {
        if (!key) throw new TypeError('NO API Key provided!');
        this.key = key,
        this.outputType = outputType || 2,
        this.numRes = numRes || 5;
    }
    /**
     * Gets the source and outputs it in your preffered output type
     * @param {String} path filepath for the image you want to get the source from (Not Implemented yet).
     * @param {String} link web address for the source, must be a valid HTTP/HTTPS address.
     * @returns {Promise} and JSON output.
     * @example client.getSauce(path/link).then(res => { console.log(res); });
     */
    getSauce(path, link) {
        return new Promise((resolve, reject) => {
            if (!path === typeof path) {
                throw new TypeError('path is not string');
            } else if (path) {
                /** @todo Finalize this. We need to input file as a stream then convert to MIMEType */
                throw new Error('This is not implemented yet!');
                /* got(`http://saucenao.com/search.php?output_type=${this.outputType}&numres=${this.numRes}&api_key=${this.key}`, {}).then(res => {               
                 });*/
            } else if (link) {
                if (!urlRegex) {
                    throw new TypeError('Link is not valid HTTP/HTTPS Address.');
                } else {
                    /** @todo I need a regex for making the following URL in the URL parameter */
                    got(`http://saucenao.com/search.php?output_type=${this.outputType}&numres=${this.numRes}&api_key=${this.key}&url=${encodeURIComponent(link)}`).then(res => {
                        resolve(res.body);
                    }).catch(reject);
                }
            }
        });
    }
}

module.exports = SauceHandler;
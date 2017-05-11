/* SauceNao query Handler
 * 
 * 
 * Contributed by Capuccino
 */

const got = require('got');
const urlRegex = str => /(http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(str);

/** 
 * Query Handler for SauceNao-related requests.
 * PEPPYNOTE: Do not add Discord-Related hooks here as this would be backported to Sagiri
 */

class SauceHandler {
    /**
     * @param {Object} options Query Options for queries.
     * @param {Number} options.dbMaskI Mask for selecting specific indexes to ENABLE. dbmask=8191 will search all of the first 14 indexes. If intending to search all databases, the db=999 option is more appropriate.
     * @param {Number} options.dbMask  Mask for selecting specific indexes to DISABLE. dbmaski=8191 would search only indexes higher than the first 14. This is ideal when attempting to disable only certain indexes, while allowing future indexes to be included by default.
     * @param {Number} options.outputType 0=normal html 1=xml api(not implemented) 2=json api.
     * @param {Number} options.numRes number to change maximum results requested. Default 5.
     * @param {String} apiKey  API Key for SauceNao.
     */
    constructor(options = {}, apiKey) {
        this.apiKey = apiKey;
        this.options = {
            outputType: this.options.outputType || 2,
            numRes: this.options.numRes || 5
        };
        if (!this.apiKey || apiKey === typeof string) {
            throw new TypeError('No API Key or invalid key was provided');
        }
    }
    getSauce(path, link) {
        return new Promise((resolve, reject) => {
            if (!path === typeof path) {
                throw new TypeError('path is not string');
            } else if (path) {
                /** @todo Finalize this. We need to output this as a stream then convert to MIMEType */
                throw new Error('This is not implemented yet!');
                /* got(`http://saucenao.com/search.php?output_type=${this.options.outputType}&numres=${this.options.numRes}&api_key=${this.apiKey}`, {}).then(res => {               
                 });*/
            } else if (link) {
                if (!urlRegex) {
                    throw new Error('Link is not valid HTTP/HTTPS Address.');
                } else {
                    /** @todo I need a regex for making the following URL in the URL parameter */
                    got(`http://saucenao.com/search.php?output_type=${this.options.outputType}&numres=${this.options.numRes}&api_key=${this.apiKey}&url=${encodeURIComponent(link)}`).then(res => {
                        resolve(res);
                    }).catch(reject);
                }
            }
        });
    }
}

module.exports = SauceHandler;
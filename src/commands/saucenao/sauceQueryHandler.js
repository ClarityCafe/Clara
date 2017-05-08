/* SauceNao query Handler
 * 
 * 
 * Contributed by Capuccino
 */

const got = require('got');
const fs = require('fs');
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
            outputType: 2,
            dbMask: this.dbMask,
            dbMaskI: this.dbMaskI,
            numRes: 5
        };
    }
    getSauce(file, link) {
        if (file === typeof path) {
            /** @todo figure out how to upload images/links in saucenao */
            throw new Error('This is not yet implemented.');
            //do nothing for now
        } else if (link) {
            if (!urlRegex) {
                throw new Error('Link is not valid HTTP/HTTPS Address.');
            } else {
                got('', () => {
                    
                }).then();
            }
            /** @todo figure out how to upload images/links in saucenao */
            //do nothing for now
        }
    }
}

module.exports = SauceHandler;

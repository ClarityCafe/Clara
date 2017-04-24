/* SauceNao query Handler
 * 
 * 
 * Contributed by Capuccino
 */

const got = require('got');

/** 
 * Query Handler for SauceNao-related requests.
 */

class SauceHandler {
    /**
     * @param {Object} options Query Options for queries.
     * @param {Number} [options.dbMaskI] Mask for selecting specific indexes to ENABLE. dbmask=8191 will search all of the first 14 indexes. If intending to search all databases, the db=999 option is more appropriate.
     * @param {Number} [options.dbMask]  Mask for selecting specific indexes to DISABLE. dbmaski=8191 would search only indexes higher than the first 14. This is ideal when attempting to disable only certain indexes, while allowing future indexes to be included by default.
     * @param {Number} [options.outputType = 1] 0=normal html 1=xml api(not implemented) 2=json api.
     * @param {String} apiKey  API Key for SauceNao.
     */
    constructorP(options, apiKey) {
        this.apiKey = apiKey;
        this.options = {
            outputType: 1,
            dbMask: this.dbMask,
            dbMaskI: this.dbMaskI
        };
    }
}

module.exports = SauceHandler;

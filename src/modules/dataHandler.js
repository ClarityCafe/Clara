/**
 *  Clara - Data Handler for Database related queries
 * 
 *  Contributed by Capuccino
 *
 */

const rethonk = require('rethinkdbdash');
const Eris = require('eris');

class dataHandler {
    /**
     *  Creates a new Data Adapter
     * @param {String} dataHandlerType Type of Data Handler. 'eris' if Eris.Collection, 'rethink' if Rethonk
     * @todo automatically fallback to eris Collection if Rethink is not present.
     * @see {link} https://github.com/awau/Clara/issues/68
     * @returns {*} Could return a ReQL driver or a Eris Collection
     */
    static dataAdapter(dataHandlerType) {
        if (dataHandlerType === 'eris') {
            //do nothing for now
            return undefined;
        } else if (dataHandlerType === 'rethink') {
            /**
             * @todo do a dynamic connect and parse error automatically so we can fallback
             */
        }
    }
}

module.exports= dataHandler;
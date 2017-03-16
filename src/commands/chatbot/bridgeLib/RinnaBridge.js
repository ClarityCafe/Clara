/* 
 * Bridge for Rinna using LINE
 *
 * Contributed by Capuccino and Ovyerus
 */

const LINE = require('node-line-bot-api/lib/clients/v2/Service');
const LINESigValidator = require('node-line-bot-api/lib/clients/v2/SignitureValidator');
const Message = require('./Message');

/**
 * Initializes a new LINE Client for DM Bridge.
 * 
 * @prop {LINE.SignitureValidator} validator Signiture validator for the LINE API lib. 
 * @prop {Object} options Options used when client was constructed.
 * @prop {String} rinnaID Rinna's ID.
 */

class RinnaClient extends LINE {

    /**
     * @param {Object} options The options to create the client with.
     * @param {String} options.accessToken Token to authenticate with.
     * @param {String} [options.channelSecret] For webhook signiture validation.
     */
    constructor(options) {
        if (typeof options.accessToken !== 'string') {
            throw new Error('accessToken is not a string.');
        } else if (options.channelSecret && typeof options.channelSecret !== 'string') {
            throw new Error('channelSecret is not a string.');
        } else {
            super(options);
            this.validator = new LINESigValidator(options);
            this.options = options;
            this.rinnaID = ''; 
        }
    }

    /**
     * Create a message and send it to Rinna.
     * 
     * @param {String} content Message content.
     * @returns {Promise} 
     * @see {Link} https://github.com/tejitak/node-line-bot-api 
     */
    createMessage(content) {
        return new Promise((resolve, reject) => {
            this.pushMessage({
                to: this.rinnaID,
                messages: [{
                    type: 'text',
                    text: content
                }]
            }).then(() => {
                return this.getMessageContent('id');
            }).then(content => {
                resolve(content);
            }).catch(reject);
        });
    }
}

function RinnaBridge(options) {
    return new RinnaClient(options);
}

module.exports = RinnaBridge;
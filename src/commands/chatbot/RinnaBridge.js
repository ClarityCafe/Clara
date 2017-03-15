/* Bridge for Rinna using Twitter
*
*
* Contributed by Capuccino
*/

const Twitter = require('twitter');

/**
 * Initializes a new Twitter Client for DM Bridge.
 * @prop {string} __consumerkey your consumer key for twitter.
 * @prop {string} __consumersecret your consumer secret for twitter.
 */

class RinnaClient extends Twitter {
    constructor(options) {
        super(options);
        this.consumerkey = options.consumerKey;
        this.consumersecret = options.consumerSecret;
        this.accessKey = options.accessKey;
        this.accessSecret = options.accessSecret;
    }

    /**
     * sends a message through DM
     * @prop {string} message message to send
     * @returns {Promise}
     */
    createMessage(message) {
        return new Promise((resolve, reject) => {
            this.post(message).then(() => {
                resolve(body.description);
            }).catch(reject);
        });
    }

}

module.exports = RinnaClient;

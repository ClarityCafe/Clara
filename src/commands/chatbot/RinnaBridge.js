/* Bridge for Rinna using Twitter
*
*
* Contributed by Capuccino
*/

const Twitter = require('twitter');

/**
 * Initializes a new Twitter Client for DM Bridge.
 * @prop {Object} options everythonk for auth
 * @prop {string} consumerKey your consumer key for twitter.
 * @prop {string} consumerSecret your consumer secret for twitter.
 * @prop {string} accessKey your access key for twitter.
 * @prop {string} accessSecret your access secret for twitter.
 */

class RinnaClient extends Twitter {
    constructor(options) {
        super(options);
        this.consumerkey = options.consumerKey;
        this.consumerSecret = options.consumerSecret;
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
                this.get().then(() => {
                    resolve(body.description);
                });
            }).catch(reject(new Error(err)));
        });
    }

}

module.exports = RinnaClient;

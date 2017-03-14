/* Bridge for Rinna using Twitter
*
*
* Contributed by Capuccino
*/

const Twitter = require('twitter');

/**
 * Initializes a new Twitter Client.
 * @prop {string} __consumerkey your consumer key for twitter.
 * @prop {string} __consumersecret your consumer secret for twitter.
 */

class RinnaClient extends Twitter {
    super(options)
    constructor(__consumerKey,__consumerSecret, __accessKey, __accessSecret) {
        this.__consumerkey = __consumerKey;
        this.__consumersecret = __consumerSecret;
        this.__accessKey = __accessKey;
        this.__accessSecret = __accessSecret;
    }

    /**
     * sends a message through DM
     * @prop {string} message message to send
     */
    createMessage(message) {
        this.post()
    }

}

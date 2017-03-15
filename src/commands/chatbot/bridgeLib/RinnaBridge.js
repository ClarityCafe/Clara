/* Bridge for Rinna using LINE
*
*
* Contributed by Capuccino
*/

const Line = require('line-bot-api');

/**
 * Initializes a new LINE Client for DM Bridge.
 * @prop {Object} options everythonk for auth
 * @prop {String} accessToken your access token for LINE.
 * @prop {String} channelSecret your channel secret for Line
 */

class RinnaAuthHandler extends Line.init {
    constructor() {
        super(options);
        this.accessToken = options.accessToken;
        this.channelSecret = options.channelSecret;
    }
}

class RinnaClient extends Line.client {
    constructor() {
        super();
    }
    /**
     * creates a new message then pushes to the line API
     * @param {String} message your message
     * @returns {Promise} 
     * @see {link} https://github.com/tejitak/node-line-bot-api 
     */
    createMessage(message) {
        return new Promise((resolve, reject) => {
            this.pushMessage({
                to: 'placeholder',
                messages: [
                    {
                        type: 'text',
                        text: message
                    }
                ]
            }).then(() => {
                this.getMessageContent('id').then(content => {
                    resolve(JSON.parse(content.body.message));
                });
            }).catch(err => reject(err));
        });
    }

}


module.exports = RinnaAuthHandler;
module.exports = RinnaClient;

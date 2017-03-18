/*
 * dog.js - Show dogs from random.dog
 * 
 * Contributed by Capuccino and Ovyerus
 */

const request = require('request');

exports.commands = [
    'woof'
];

exports.woof = {
    desc: `It's like nyaa, only it's dogs`,
    longDesc: 'Prints out a random dog image from random.dog',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            request('http://random.dog/woof', (err, res, body) => {
                if (err) {
                    reject(err);
                } else if (res.statusCode !== 200) {
                    reject(new Error(`Unexpected Response Code from random.dog (Code ${res.statusCode})`));
                } else {
                    ctx.msg.channel.createMessage(`http://random.dog/${body}`).then(resolve).catch(reject);
                }
            });
        });
    }

};

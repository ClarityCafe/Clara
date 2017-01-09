/* It's Joke!
 *
 * Contributed by Ohara Mari.
 * 
 * Don't ask why is this a thing.
 * 
 */

exports.command = [
    'itsjoke'
];

const fs = require('fs');
const Promise = require('bluebird');

exports.itsjoke = {
    desc: "it's Joke!",
    longDesc: "it's Joke!",
    usage: "<It's Joke!>",
    main: (bot, ctx) => {
        return new Promise((reject, resolve) => {
            ctx.msg.channel.createMessage({file: fs.readFileSync('../res/528.jpg'), name: 'joke.jpg'}).then(() => resolve()).catch(err => reject([err]));
        });
    }
};

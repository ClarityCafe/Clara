/* It's Joke!
 *
 * Contributed by Ohara Mari.
 * 
 * Don't ask why is this a thing.
 * 
 */

const Promise = require('bluebird');

exports.commands = [
    'itsjoke'
];


exports.itsjoke = {
    desc: "it's Joke!",
    longDesc: "it's Joke!",
    usage: "<It's Joke!>",
    main: (bot, ctx) => {
        return new Promise((reject, resolve) => {
            ctx.msg.channel.createMessage('',{file: fs.readFileSync('../res/528.jpg'), name: '528.jpg'}).then(() => resolve()).catch(err => reject([err]));
        });
    }
};

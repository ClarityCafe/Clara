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

const Promise = require('bluebird');

exports.itsjoke = {
    desc: "it's Joke!",
    longDesc: "it's Joke!",
    usage: "<It's Joke!>",
    main: (bot, ctx) => {
        return new Promise((reject, resolve) => {
            ctx.msg.channel.createMessage(msg.channel.id, "It's joke!", {file: fs.readFileSync('file.png'), name: 'joke.png'});.then(() => resolve()).catch(err => reject([err]));
        });
    }
};

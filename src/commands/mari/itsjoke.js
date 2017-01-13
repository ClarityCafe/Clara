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

const fs = require('fs');
var files = fs.readdirSync('res/mari');
var file = fs.readFileSync('directory' + files[Math.floor(Math.random() * files.length)]);
exports.itsjoke = {
    desc: "it's Joke!",
    longDesc: "it's Joke!",
    usage: "<It's Joke!>",
    main: (bot, ctx) => {
        return new Promise((reject, resolve) => {
            ctx.msg.channel.createMessage('',{file: file , name:file.name }).then(() => resolve()).catch(err => reject([err]));
        });
    }
};

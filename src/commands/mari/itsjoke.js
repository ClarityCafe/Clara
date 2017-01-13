/* It's Joke!
 *
 * Contributed by Ohara Mari.
 * 
 * Don't ask why is this a thing.
 * 
 */

const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');

exports.commands = [
    'itsjoke'
];

var files = fs.readdirSync(path.resolve(__baseDir) + '/res');

exports.itsjoke = {
    desc: "it's Joke!",
    longDesc: "it's Joke!",
    usage: "<It's Joke!>",
    main: (bot, ctx) => {
        return new Promise((reject, resolve) => {
            var file = fs.readFileSync(files + `${files[Math.floor(Math.random() * files.length)]}`);
            ctx.msg.channel.createMessage('', {file: file, name:''}).then(() => resolve()).catch(err => reject([err]));
        });
    }
};

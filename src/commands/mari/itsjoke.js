/* It's Joke!
 *
 * Contributed by Ohara Mari.
 * 
 * Don't ask why is this a thing.
 * 
 */


const fs = require('fs');

exports.commands = [
    'mari'
];

var files = fs.readdirSync(`${__baseDir}/res`);

exports.mari = {
    desc: "It's Joke!",
    main: (bot, ctx) => {
        return new Promise((reject, resolve) => {
            ctx.msg.channel.sendTyping();
            var fileName = files[Math.floor(Math.random() * files.length)];
            var file = fs.readFileSync(`${__baseDir}/res/${fileName}`);
            ctx.msg.channel.createMessage('', {file: file, name: fileName}).then(() => resolve()).catch(err => reject([err]));
        });
    }
};

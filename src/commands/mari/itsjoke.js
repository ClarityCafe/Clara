/* 
 * itsjoke.js - It's Joke!.
 *
 * Contributed by Capuccino and Ovyerus.
 */

/* eslint-env node */

const fs = require('fs');

exports.commands = [
    'mari'
];

var files = fs.readdirSync(`${__baseDir}/res/itsjoke`);

exports.mari = {
    desc: "It's joke!",
    longDesc: "Send a random picture of the it's joke meme.",
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.sendTyping();
            let fileName = files[Math.floor(Math.random() * files.length)];
            let file = fs.readFileSync(`${__baseDir}/res/itsjoke/${fileName}`);
            ctx.createMessage('', {file, name: fileName}).then(resolve).catch(reject);
        });
    }
};

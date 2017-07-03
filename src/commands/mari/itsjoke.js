/* 
 * itsjoke.js - It's Joke!.
 *
 * Contributed by Capuccino and Ovyerus.
 */

/* eslint-env node */

const fs = require('fs');
const files = fs.readdirSync(`${__baseDir}/res/itsjoke`);

exports.commands = [
    'mari'
];

exports.mari = {
    desc: "It's joke!",
    longDesc: "Send a random picture of the it's joke meme.",
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.channel.sendTyping();
            let fileName = files[Math.floor(Math.random() * files.length)];
            let file = fs.readFileSync(`${__baseDir}/assets/itsjoke/${fileName}`);
            ctx.createMessage('', {file, name: fileName}).then(resolve).catch(reject);
        });
    }
};

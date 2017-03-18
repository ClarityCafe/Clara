/* 
 * itsjoke.js - Mari memes.
 *
 * Contributed by Capuccino and Ovyerus.
 */

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
            let file = fs.readFileSync(`${__baseDir}/res/${fileName}`);
            ctx.msg.channel.createMessage('', {file, name: fileName}).then(resolve).catch(reject);
        });
    }
};

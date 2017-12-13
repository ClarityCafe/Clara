/**
 * @file It's joke!
 * 
 * @author Capuccino 
 * @author Ovyerus
 */

const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(path.resolve(`${__dirname}`, '../', '../', '../', './assets/itsjoke'));

exports.commands = [
    'mari'
];

exports.mari = {
    desc: "It's joke!",
    longDesc: "Send a random picture of the it's joke meme.",
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let fileName = files[Math.floor(Math.random() * files.length)];
        let file = fs.readFileSync(`./assets/itsjoke/${fileName}`);

        await ctx.createMessage('', {file, name: fileName});
    }
};

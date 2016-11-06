/*
 * The Nyaaa~! Command
 * Contributed by Capuccino.
 * Core Command Module for owo-whats-this
 */

exports.commands = [
    "nyaa"
];
const request = require('request');
exports.nyaa = {
    name: "nyaa",
    desc: "Nyaaa!",
    longDesc: "Returns a picture of a cat from LoremPixel",
    main: (bot, ctx) => {
        request('http://random.cat/meow', (err, res, body) => {
            if (!err && res.statusCode === 200) {
                var kitty = JSON.parse(body).file;
                ctx.msg.channel.sendMessage(kitty);
            }
        });
    }
}
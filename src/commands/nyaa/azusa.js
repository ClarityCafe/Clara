/*
 * The Nyaaa~! Command
 * Contributed by Capuccino.
 * Core Command Module for owo-whats-this
 */

exports.commands = [
    "nyaa"
];
const azusa = require('random-cat');
exports.nyaa = {
    name: "nyaa",
    desc: "Nyaaa!",
    longDesc: "Returns a picture of a cat from LoremPixel",
    main: function(bot, ctx) {
        var url = azusa.get({
            // just to make sure Gus never whines
            //about ant-sized images.
            width: 1080,
            height: 1920
        });
        ctx.msg.channel.sendMessage(url);
    }
}
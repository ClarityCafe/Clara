"use strict";
exports.commands = [
    "talk"
];

var cleverbot = require("cleverbot-node");
var talkbot = new cleverbot();
cleverbot.prepare(function() {});

exports.talk = {
    desc: "Talk directly to the bot",
    longDesc: "talk to the bot",
    usage: "<message>",
    main: function(bot, ctx) {
        talkbot.write(ctx.suffix, function(response) {
            ctx.msg.channel.makeMessage(response.message);
        });
    }
}

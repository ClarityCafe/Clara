/*
 * chat.js - Talk with the bot using the CleverBot API.
 * Based from chalda/DiscordBot.
 * Contributed by Capuccino, Ovyerus.
 * Core Command Module for owo-whats-this
 */
"use strict";
exports.commands = [
    "talk"
];

var cleverbot = require("cleverbot-node");
var talkbot = new cleverbot();
cleverbot.prepare(function() {});

exports.talk = {
    name: "talk",
    desc: "Talk directly to the bot",
    longDesc: "talk to the bot",
    usage: "<message>",
    main: function(bot, ctx) {
        talkbot.write(ctx.suffix, function(response) {
            ctx.msg.channel.sendMessage(response.message);
        });
    }
}
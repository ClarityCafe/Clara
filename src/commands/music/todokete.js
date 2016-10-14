exports.commands = [
    "play",
    "add",
    "remove",
    "clear",
    "queue",
    "summon",
    "disconnect"
];
var spawn = require('child_process').spawn;
const request = require('request');
const fs = require('fs');
const path = require('path');
const youtubedl = require('youtube-dl');
const m3u8 = require('mu38');
const stream = require('stream');

var voice_channel = {};
var ffmpegs = {};
var songQ = {};
var summoners = {};
var votes = {};

exports.summon = {
    desc: 'summon the bot to a voice channel',
    longDesc: 'summon the bot to specific voice channel. you need to be in the target channel to summon the bot there.',
    main: function(bot, ctx) {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) {
            return ctx.reply(`Please be in a voice channel first!`);
        }
        voiceChannel.join();
        ctx.msg.channel.sendMessage("Ready to Play, Imouto!");
    }
}

exports.disconnect = {
    desc: "make the bot leave (Admin Only)",
    longDesc: " make the bot disconnect out of a specific VC. You mast be in the AdminList",
    main: function(bot, ctx) {
        bot.destroy();
    }
}
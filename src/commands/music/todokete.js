exports.commands = [
    "play",
    "add",
    "remove",
    "clear",
    "queue",
    "summon",
    "disconnect"
];
const request = require('request');
const fs = require('fs');
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
        voice_channel(voice_channel_id, function() {
            summoners[serverID] = userID;
            voice_channel[serverID] = voice_channel_id;
            ctx.msg.channel.sendMessage("Ready to Play, Imouto!");
        });
    }

}
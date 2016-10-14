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
    main: function (bot, ctx) {
        voice_channel_id = bot.servers[serverID].members[userID].voice_channel_id;
        bot.joinVoiceChannel(voice_channel_id, function () {
            summoners[serverID] = userID;
            voice_channel[serverID] = voice_channel_id;
            ctx.msg.channel.sendMessage("Ready to Play, Imouto!");
        });
    }

}
exports.disconnect = {
    desc : "make the bot leave (Admin Only)",
    longDesc: " make the bot disconnect out of a specific VC. You mast be in the AdminList",
    main: function (bot , ctx){
        bot.destroy();
    }
}
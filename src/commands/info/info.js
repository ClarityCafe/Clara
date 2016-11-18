/*
 * info.js - Various information of the bot.
 * 
 * Contributed by Ovyerus
 */

const Promise = require('bluebird');
const prettyBytes = require('pretty-bytes');
const path = require('path');
const fs = require('fs');
const util = require(`${_baseDir}/lib/util.js`);
const version = JSON.parse(fs.readFileSync(path.join(_baseDir, '../package.json'))).version;

exports.commands = [
    'info'
];

exports.info = {
    desc: 'Information about the bot.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            var infoTxt = `**${bot.user.username} Information**\n`;
            infoTxt += '```prolog\n';
            infoTxt += '% Discord Stats %\n';
            infoTxt += `Guilds: ${bot.guilds.size}\n`;
            infoTxt += `Channels: ${bot.channels.size}\n`;
            infoTxt += `Users Seen: ${bot.users.size}\n\n`;
            infoTxt += '% Other %\n';
            infoTxt += `Uptime: ${util.msToTime(bot.uptime)}\n`
            infoTxt += `Memory Usage: ${prettyBytes(process.memoryUsage().rss)}\n`;
            infoTxt += `Version: ${version}\n`;
            infoTxt += '```';
            ctx.msg.channel.sendMessage(infoTxt).then(() => resolve()).catch(err => reject([err]));
        });
    }
}
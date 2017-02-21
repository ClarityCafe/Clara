/*
 * info.js - Various information of the bot.
 *
 * Contributed by Ovyerus
 */


const os = require('os');
const prettyBytes = require('pretty-bytes');
const fs = require('fs');
const path = require('path');
const utils = require(`${__baseDir}/lib/utils.js`);
var version;

try {
    version = JSON.parse(fs.readFileSync(path.normalize(`${__baseDir}/../package.json`))).version;
} catch(_) {
    version = JSON.parse(fs.readFileSync(`${__baseDir}/package.json`)).version;
}


exports.commands = [
    'info'
];

exports.info = {
    desc: 'Information about the bot.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            let date = new Date();
            let sysTime = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getDate()}\n${('0' + (date.getHours() + 1)).slice(-2)}:${('0' + (date.getMinutes() + 1)).slice(-2)}:${('0' + (date.getSeconds() + 1)).slice(-2)}`;
            let roleColour = ctx.msg.channel.guild.roles.get(ctx.guildBot.roles.sort((a, b) => {
                return ctx.guildBot.guild.roles.get(b).position - ctx.guildBot.guild.roles.get(a).position;
            })[0]).color;
            ctx.msg.channel.createMessage({embed: {
                title: `${bot.user.username} Info`,
                description: '[Source Code](https://github.com/owo-dev-team/owo-whats-this)',
                thumbnail: {url: bot.user.avatarURL.replace('https://cdn.discordapp.com', 'https://images.discordapp.net') + '?size=1024', height: 128, width: 128},
                color: roleColour,
                fields: [
                    {name: 'Guilds', value: bot.guilds.size, inline: true},
                    {name: 'Users Seen', value: bot.users.size, inline: true},
                    {name: 'Uptime', value: utils.msToTime(bot.uptime), inline: true},
                    {name: 'System Time', value: sysTime, inline: true},
                    {name: 'OS Release', value: os.release(), inline: true},
                    {name: 'OS Platform', value: os.platform(), inline: true},
                    {name: 'Shards Active', value: bot.shards.size, inline: true},
                    {name: 'Memory Usage', value: prettyBytes(process.memoryUsage().rss), inline: true},
                    {name: 'Version', value: version, inline: true}
                ]
            }}).then(resolve).catch(reject);
        });
    }
};
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
                title: `${bot.user.username}'s Info`,
                description: `[${localeManager.t('info-source', 'en-UK')}](https://github.com/awau/Clara) | [${localeManager.t('info-supportServer', 'en-UK')}](https://discord.gg/ZgQkCkm)`,
                thumbnail: {url: bot.user.avatarURL},
                color: roleColour,
                fields: [
                    {name: localeManager.t('info-guilds', 'en-UK'), value: bot.guilds.size, inline: true},
                    {name: localeManager.t('info-users', 'en-UK'), value: bot.users.size, inline: true},
                    {name: localeManager.t('info-uptime', 'en-UK'), value: utils.msToTime(bot.uptime), inline: true},
                    {name: localeManager.t('info-sysTime', 'en-UK'), value: sysTime, inline: true},
                    {name: localeManager.t('info-os', 'en-UK'), value: os.platform(), inline: true},
                    {name: localeManager.t('info-shards', 'en-UK'), value: bot.shards.size, inline: true},
                    {name: localeManager.t('info-mem', 'en-UK'), value: prettyBytes(process.memoryUsage().rss), inline: true},
                    {name: localeManager.t('info-version', 'en-UK'), value: version, inline: true}
                ],
                footer: {text: localeManager.t('info-footer', 'en-UK', {name: bot.user.username})}
            }}).then(resolve).catch(reject);
        });
    }
};
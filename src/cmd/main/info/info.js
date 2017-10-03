/**
 * @file Various information of the bot.
 * @author Ovyerus
 */

/* eslint-env node */

const prettyBytes = require('pretty-bytes');
const fs = require('fs');
const path = require('path');
var version;

try {
    version = JSON.parse(fs.readFileSync('../package.json')).version;
} catch(_) {
    version = JSON.parse(fs.readFileSync(`${__baseDir}/package.json`)).version;
}

exports.commands = [
    'info'
];

exports.info = {
    desc: 'Information about the bot.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let date = new Date();
            let sysTime = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getDate()}\n${('0' + (date.getHours() + 1)).slice(-2)}:${('0' + (date.getMinutes() + 1)).slice(-2)}:${('0' + (date.getSeconds() + 1)).slice(-2)}`;
            let roleColour = ctx.guildBot.roles.sort((a, b) => ctx.guild.roles.get(b).position - ctx.guild.roles.get(a).position)[0];
            roleColour = roleColour ? ctx.guild.roles.get(roleColour).color : 0;

            ctx.createMessage({embed: {
                title: `${bot.user.username}'s Info`,
                description: `[${localeManager.t('info-source')}](https://github.com/ClaraIO/Clara) | [${localeManager.t('info-supportServer')}](https://discord.gg/rmMTZue)`,
                thumbnail: {url: bot.user.avatarURL},
                color: roleColour,
                fields: [
                    {name: 'info-guilds', value: bot.guilds.size, inline: true},
                    {name: 'info-users', value: bot.users.size, inline: true},
                    {name: 'info-uptime', value: utils.msToTime(bot.uptime), inline: true},
                    {name: 'info-sysTime', value: sysTime, inline: true},
                    {name: 'info-shards', value: bot.shards.size, inline: true},
                    {name: 'info-mem', value: prettyBytes(process.memoryUsage().rss), inline: true},
                    {name: 'info-NodeVersion', value: process.version, inline: true},
                    {name: 'info-version', value: version, inline: true}
                ],
                footer: {text: 'info-footer'}
            }}, null, 'channel', {name: bot.user.username}).then(resolve).catch(reject);
        });
    }
};
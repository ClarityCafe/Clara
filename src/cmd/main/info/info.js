/**
 * @file Various information of the bot.
 * @author Ovyerus
 */

const fs = require('fs');
const path = require('path');
var version;

try {
    version = JSON.parse(fs.readFileSync(path.resolve(`${mainDir}`, '../', './package.json'))).version;
} catch(_) {
    version = JSON.parse(fs.readFileSync(path.resolve(`${mainDir}`, '../', './package.json'))).version;
}

exports.commands = [
    'info'
];

exports.info = {
    desc: 'Information about the bot.',
    async main(bot, ctx) {
        let roleColour = ctx.guildBot.roles.sort((a, b) => ctx.guild.roles.get(b).position - ctx.guild.roles.get(a).position)[0];
        roleColour = roleColour ? ctx.guild.roles.get(roleColour).color : 0;

        await ctx.createMessage({embed: {
            title: `${bot.user.username}'s Info`,
            description: `[${bot.localeManager.t('info-source')}](https://github.com/ClarityMoe/Clara) | [${bot.localeManager.t('info-supportServer')}](https://discord.gg/rmMTZue)`,
            thumbnail: {url: bot.user.avatarURL},
            footer: {text: 'info-footer'},
            color: roleColour,
            fields: [
                {
                    name: 'info-guilds',
                    value: bot.guilds.size,
                    inline: true
                },
                {
                    name: 'info-users',
                    value: bot.users.size,
                    inline: true
                },
                {
                    name: 'info-uptime',
                    value: utils.msToTime(bot.uptime),
                    inline: true
                },
                {
                    name: 'info-shards',
                    value: bot.shards.size,
                    inline: true
                },
                {
                    name: 'info-mem',
                    value: utils.genBytes(process.memoryUsage().rss),
                    inline: true
                },
                {
                    name: 'info-version',
                    value: version, inline:
                    true
                }
            ]
        }}, null, 'channel', {name: bot.user.username});
    }
};
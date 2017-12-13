/**
 * @file Get information of a user.
 * @author Capuccino
 * @author Ovyerus
 */

const moment = require('moment');

exports.commands = [
    'userinfo'
];

exports.userinfo = {
    desc: "Check a user's info, or your own.",
    longDesc: `check someone's or your own userinfo`,
    usage: '[mention]',
    example: '@b1nzy#1337',
    async main(bot, ctx) {
        if (ctx.suffix) {
            let member = await bot.lookups.memberLookup(ctx, ctx.suffix);

            if (!member) return;

            let roleColour = member.roles.sort((a, b) => ctx.guild.roles.get(b).position - ctx.guild.roles.get(a).position)[0];
            let roles = member.roles.map(r => ctx.guild.roles.get(r).name);
            roleColour = roleColour ? ctx.guild.roles.get(roleColour).color : 0;

            return await ctx.createMessage(infoBlock(member, roles, roleColour));
        }

        let roleColour = ctx.member.roles.sort((a, b) => ctx.guild.roles.get(b).position - ctx.guild.roles.get(a).position)[0];
        let roles = ctx.member.roles.map(r => ctx.guild.roles.get(r).name);
        roleColour = roleColour ? ctx.guild.roles.get(roleColour).color : 0;

        await ctx.createMessage(infoBlock(ctx.member, roles, roleColour));
    }
};

function infoBlock(member, roles, color) {
    return {embed: {
        author: {name: utils.formatUsername(member.user), icon_url: member.bot ? 'https://cdn.discordapp.com/emojis/230105988211015680.png' : ''},
        description: `**[Full Avatar](${member.avatarURL})**`,
        thumbnail: {url: member.avatarURL},
        color: color,
        fields: [
            {name: 'Nickname', value: member.nick || 'None', inline: true},
            {name: 'ID', value: member.id, inline: true},
            {name: 'Status', value: member.status.replace(member.status[0], member.status[0].toUpperCase()), inline: true},
            {name: 'Game', value: !member.game ? 'None' : member.game.type === 0 ? member.game.name : `[${member.game.name}](${member.game.url})`, inline: true},
            {name: 'Joined At', value: `${moment(member.joinedAt).format('dddd Do MMMM Y')}\n${moment(member.joinedAt).format('HH:mm:ss A')}`, inline: true},
            {name: 'Roles', value: roles.join(', ') || 'None', inline: true}
        ],
        footer: {text: `Account Created on ${moment(member.createdAt).format('dddd Do MMMM Y')} at ${moment(member.createdAt).format('HH:mm:ss A')}`}
    }};
}
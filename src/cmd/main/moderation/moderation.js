/**
 * @file Moderation commands for people who are lazy.
 * @author Ovyerus
 */

exports.commands = [
    'kick',
    'ban'
];

exports.kick = {
    desc: 'Kicks a user from the server.',
    usage: '<user> [for <reason>]',
    aliases: ['kick'],
    permissions: {both: 'kickMembers'},
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('kick-noUser');

        let user = await bot.lookups.memberLookup(ctx, ctx.suffix.split(' for')[0], false);

        if (!user && !isNaN(ctx.suffix)) {
            try {
                user = await bot.rest.getRESTUser(ctx.suffix);
            } catch(e) {
                return await ctx.createMessage('userNotFound');
            }
        } else if (!user) return await ctx.createMessage('userNotFound');

        await punishMember(user, ctx, 'kick');
    }
};

exports.ban = {
    desc: 'Cuts through someone and bans them.',
    usage: '<user> [for <reason>]',
    permissions: {both: 'banMembers'},
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('ban-noUser');

        let user = await bot.lookups.memberLookup(ctx, ctx.suffix.split(' for')[0], false);

        if (!user && !isNaN(ctx.suffix)) {
            try {
                user = await bot.rest.getRESTUser(ctx.suffix);
            } catch(e) {
                return await ctx.createMessage('userNotFound');
            }
        } else if (!user) return await ctx.createMessage('userNotFound');

        await punishMember(user, ctx, 'ban');
    }
};

async function punishMember(user, ctx, type) {
    if (user.id === ctx.author.id) return await ctx.createMessage(`${type}-tryAuthor`);
    if (user.id === ctx.client.user.id) return await ctx.createMessage(`${type}-trySelf`);

    let userTopRolePos = ctx.guild.roles.get(ctx.member.roles.sort((a, b) => {
        return ctx.guild.roles.get(b).position - ctx.guild.roles.get(a).position;
    })[0]);
    userTopRolePos = userTopRolePos ? userTopRolePos.position : 0;

    let mentionTopRolePos = ctx.guild.roles.get(user.roles.sort((a, b) => {
        return ctx.guild.roles.get(b).position - ctx.guild.roles.get(a).position;
    })[0]);
    mentionTopRolePos = mentionTopRolePos ? mentionTopRolePos.position : 0;

    if (ctx.author.id === ctx.guild.ownerID || (userTopRolePos > mentionTopRolePos && userTopRolePos !== mentionTopRolePos)) {
        try {
            if (ctx.suffix.split(' for').length === 1 && type === 'ban') {
                await ctx.guild.banMember(user.id, 7, utils.formatUsername(ctx.author));
            } else if (ctx.suffix.split(' for').length === 1 && type === 'kick') {
                await ctx.guild.kickMember(user.id, utils.formatUsername(ctx.author));
            } else if (type === 'ban') {
                await ctx.guild.banMember(user.id, 7, `[${utils.formatUsername(ctx.author)}]: ${ctx.suffix.split(' for').slice(1).join(' for').trim()}`);
            } else if (type === 'kick') {
                await ctx.guild.kickMember(user.id, `[${utils.formatUsername(ctx.author)}]: ${ctx.suffix.split(' for').slice(1).join(' for').trim()}`);
            }
        } catch(err) {
            if (err.resp && err.resp.statusCode === 403) {
                return await ctx.createMessage(`${type}-fail`, null, 'channel', {
                    user: utils.formatUsername(user)
                });
            } else throw err;
        }

        await ctx.createMessage(`${type}-success`, null, 'channel', {
            user: utils.formatUsername(user)
        });
    } else if (userTopRolePos === mentionTopRolePos) await ctx.createMessage(`${type}-sameRole`);
    else await ctx.createMessage(`${type}-higherRole`);
}
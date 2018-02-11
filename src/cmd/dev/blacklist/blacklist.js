/**
 * @file Dynamic blacklist command.
 * @author Ovyerus
 */

exports.loadAsSubcommands = true;
exports.commands = [
    'add',
    'remove'
];

exports.main = {
    desc: 'Add or remove people in the blacklist.',
    usage: '[<add|remove> <user>]',
    owner: true,
    async main(bot, ctx) {
        let blacklist = bot.blacklist.map(id => [bot.users.get(id), id]).map(([u, id]) => (u ? `**${utils.formatUsername(u)}** ` : '**Unknown user**') + ` ($<${id}>)`);
        let embed = {
            title: 'Blacklisted Users',
            description: blacklist.join('\n') || 'No one.'
        };

        await ctx.createMessage({embed});
    }
};

exports.add = {
    desc: 'Add a user to the blacklist.',
    usage: '<user>',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('Please give me a user to blacklist.');

        let user = await bot.lookups.memberLookup(ctx, ctx.suffix);

        if (!user) return;
        if (bot.checkBotPerms(user.id)) return await ctx.createMessage('You cannot blacklist a bot admin.');

        await bot.addBlacklist(user.id);
        await ctx.createMessage(`Added user **${utils.formatUsername(user)}** to the blacklist.`);
    }
};

exports.remove = {
    desc: 'Remove a user from the blacklist.',
    usage: '<user>',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('Please give me a user to remove from the blacklist.');

        let user = await bot.lookups.memberLookup(ctx, ctx.suffix);

        if (!user) return;
        if (!bot.blacklist.includes(user.id)) return await ctx.createMessage('That user is not on the blacklist.');

        await bot.removeBlacklist(user.id);
        await ctx.createMessage(`Removed user **${utils.formatUsername(user) || user.id}** from the blacklist.`);
    }
};
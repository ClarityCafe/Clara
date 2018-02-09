/**
 * @file Add and remove admins
 * @author Ovyerus
 */

exports.loadAsSubcommands = true;

exports.commands = [
    'add',
    'remove'
];

exports.main = {
    desc: 'Manage bot admins.',
    usage: '[<add|remove> <user>]',
    owner: true,
    async main(bot, ctx) {
        let admins = bot.admins.concat(bot.config.ownerID).map(id => [bot.users.get(id), id]).map(([u, id]) => (u ? `**${utils.formatUsername(u)}** ` : '**Unknown user**') + ` (<@${id}>)`);
        let embed = {
            title: 'Bot Admins',
            description: admins.join('\n')
        };

        await ctx.createMessage({embed});
    }
};

exports.add = {
    desc: 'Add admins.',
    usage: '<user>',
    async main(bot, ctx) {
        if (ctx.author.id !== bot.config.ownerID) return await ctx.createMessage('This is restricted to the bot owner.');
        if (!ctx.suffix) return await ctx.createMessage('Please give me a user to add as an admin.');

        let user = await bot.lookups.memberLookup(ctx, ctx.suffix);

        if (!user) return;

        await ctx.createMessage(`Are you sure you wish to add **${utils.formatUsername(user)}** (${user.id}) as a bot admin?`);
        let m = await bot.awaitMessage(ctx.channel.id, ctx.author.id);

        if (/^no?$/i.test(m.content)) return await ctx.createMessage('I will not add that user as an admin.');
        else if (!/^y(es)?$/i.test(m.content)) return await ctx.createMessage('Invalid response. I will not add that user an admin.');

        await bot.addAdmin(user.id);
        await ctx.createMessage(`Added admin **${utils.formatUsername(user)}**.`);
    }
};

exports.remove = {
    desc: 'Remove admins.',
    usage: '<user>',
    async main(bot, ctx) {
        if (ctx.author.id !== bot.config.ownerID) return await ctx.createMessage('This is restricted to the bot owner.');
        if (!ctx.suffix) return await ctx.createMessage('Please give me a user to remove as an admin.');

        let user = await bot.lookups.memberLookup(ctx, ctx.suffix);

        if (!user) return;

        await bot.removeAdmin(user.id);
        await ctx.createMessage(`Removed admin **${utils.formatUsername(user)}**.`);
    }
};
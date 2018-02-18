/**
 * @file Add/remove and view alternative prefixes
 * @author Ovyerus
 */

exports.loadAsSubcommands = true;
exports.commands = [
    'add',
    'remove'
];

exports.main = {
    desc: 'View the various prefixes used by the bot and edit them.',
    usage: '[<add|remove> <prefix>]',
    async main(bot, ctx) {
        let prefixes = bot.prefixes.map(prefix => {
            if (RegExp(`^<@!?${bot.user.id}> $`).test(prefix)) return '@mention';
            else return prefix;
        }).reduce((m, v) => !m.includes(v) ? m.concat(v) : m, []); // Remove any duplicate entries.
        let embed = {
            title: `Showing ${prefixes.length} prefixes`,
            description: `\`${prefixes.join('`, `')}\``
        };

        await ctx.createMessage({embed});
    }
};

exports.add = {
    desc: 'Add a prefix.',
    usage: '<prefix>',
    owner: true,
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('Please give me a prefix to add.');

        let prefix = ctx.args.join(' '); // Using ctx.suffix would mean that "" in multi-word arguments would be kept. This stops that.

        if (bot.prefixes.includes(prefix)) return await ctx.createMessage('That prefix already exists.');

        await bot.addPrefix(prefix); // Yay, abstraction.
        await ctx.createMessage(`Added prefix \`${prefix}\``);
    }
};

exports.remove = {
    desc: 'Remove a prefix.',
    usage: '<prefix>',
    owner: true,
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('Please give me a prefix to remove.');

        let prefix = ctx.args.join(' ');
        let isPermanent = RegExp(`^<@!?${bot.user.id}> ?$`).test(prefix) || prefix === bot.config.mainPrefix;

        if (isPermanent) return await ctx.createMessage('That prefix cannot be removed.');
        else if (!bot.prefixes.includes(prefix)) return await ctx.createMessage("That prefix doesn't exist.");

        await bot.removePrefix(prefix);
        await ctx.createMessage(`Removed prefix \`${prefix}\``);
    }
};
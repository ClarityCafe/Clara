/**
 * @file Add/remove and view alternative prefixes
 * @author Ovyerus
 */

const fs = require('fs');

exports.loadAsSubcommands = true;
exports.commands = [
    'add',
    'remove'
];

exports.main = {
    desc: 'View the various prefixes used by the bot and edit them.',
    usage: '[<add|remove> <prefix>]',
    async main(bot, ctx) {
        let embed = {
            title: `Displaying **${bot.prefixes.length - 1}** prefixes`,
            description: [],
            author: {
                name: 'Current Prefixes'
            }
        };

        bot.prefixes.forEach(prefix => {
            if (RegExp(`^<@!?${bot.user.id}> $`).test(prefix) && !~embed.description.indexOf('`@mention`')) {
                embed.description.push('`@mention`');
            } else if (!RegExp(`^<@!?${bot.user.id}> $`).test(prefix)) {
                embed.description.push(`\`${prefix}\``);
            }
        });

        embed.description = embed.description.join(', ');

        await ctx.createMessage({embed});
    }
};

exports.add = {
    desc: 'Add a prefix.',
    usage: '<prefix>',
    owner: true,
    async main(bot, ctx) {
        if (ctx.args.length === 0) return await ctx.createMessage('Please give me a prefix to add.');

        let prefix = ctx.args.join(' ');
        let newPrefixes = bot.prefixes.concat(prefix).filter(p => p !== bot.config.mainPrefix && !RegExp(`^<@!?${bot.user.id}> $`).test(p));

        fs.writeFileSync('./data/prefixes.json', JSON.stringify(newPrefixes));
        bot.prefixes.push(ctx.args.join(' '));
        await ctx.createMessage(`Added prefix \`${prefix}\``);
    }
};

exports.remove = {
    desc: 'Remove a prefix.',
    usage: '<prefix>',
    owner: true,
    async main(bot, ctx) {
        if (ctx.args.length === 0) return await ctx.createMessage('Please give me a prefix to remove.');

        let prefix = ctx.args.join(' ');
        let newPrefixes = bot.prefixes.filter(p => p !== prefix);

        if (RegExp(`^<@!?${bot.user.id}> ?$`).test(prefix) || prefix === bot.config.mainPrefix || newPrefixes.equals(bot.prefixes)) return await ctx.createMessage("That prefix doesn't exist or can't be removed.");

        newPrefixes = newPrefixes.filter(p => p !== bot.config.mainPrefix && !RegExp(`^<@!?${bot.user.id}> $`).test(p));

        fs.writeFileSync('./data/prefixes.json', JSON.stringify(newPrefixes));
        bot.prefixes.splice(bot.prefixes.indexOf(prefix), 1);
        await ctx.createMessage(`Removed prefix \`${prefix}\``);
    }
};

Array.prototype.equals = array => {
    if (!array || this.length !== array.length) return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }

    return true;
};

Object.defineProperty(Array.prototype, 'equals', {enumerable: false});
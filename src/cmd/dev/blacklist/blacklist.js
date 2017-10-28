/**
 * @file Dynamic blacklist command.
 * @author Ovyerus
 */

const fs = require('fs');

exports.loadAsSubcommands = true;
exports.commands = [
    'add',
    'remove'
];

exports.main = {
    desc: 'Add or remove people in the blacklist.',
    usage: '[<add|remove> <mention|id>]',
    owner: true,
    async main(bot, ctx) {
        let embed = {
            title: 'Blacklisted Users',
            description: []
        };

        if (bot.blacklist.length === 0) {
            embed.description = 'No one.';
            return await ctx.createMessage({embed});
        }

        bot.blacklist.forEach(u => {
            if (bot.users.get(u)) {
                embed.description.push(`**${utils.formatUsername(bot.users.get(u))}** (${u})`);
            } else {
                embed.description.push(`**Unknown user** (${u})`);
            }
        });

        embed.description = embed.description.join('\n');

        await ctx.createMessage({embed});
    }
};

exports.add = {
    desc: 'Add a user to the blacklist.',
    usage: '<mention|id>',
    async main(bot, ctx) {
        if (!/^(<@!?\d+>|\d+)$/.test(ctx.args[0])) return await ctx.createMessage('Please mention the user to add, or their id.');
        let id = /^<@!?\d+>$/.test(ctx.args[0]) ? ctx.args[0].replace(/^<@!?/, '').slice(0, -1) : ctx.args[0];

        if (!bot.users.get(id)) return await ctx.createMessage('That user does not exist or I cannot see them.');
    
        let newBlacklist = bot.blacklist.concat(id);
        let data = {admins: bot.blacklist, blacklist: newBlacklist};

        fs.writeFileSync(`./data/data.json`, JSON.stringify(data));
        bot.blacklist.push(id);
        await ctx.createMessage(`Added user **${utils.formatUsername(bot.users.get(id))}** to the blacklist.`);
    }
};

exports.remove = {
    desc: 'Remove a user from the blacklist.',
    usage: '<mention|ID>',
    async main(bot, ctx) {
        if (!/^(<@!?\d+>|\d+)$/.test(ctx.args[0])) return await ctx.createMessage('Please mention the user to add, or their id.');

        let id = /^<@!?\d+>$/.test(ctx.args[0]) ? ctx.args[0].replace(/^<@!?/, '').slice(0, -1) : ctx.args[0];

        if (!bot.blacklist.includes(id)) return await ctx.createMessage('That user is not on the blacklist.');

        let newBlacklist = bot.blacklist.filter(b => b !== id);
        let data = {admins: bot.admins, blacklist: newBlacklist};

        fs.writeFileSync(`./data/data.json`, JSON.stringify(data));
        bot.blacklist.splice(bot.blacklist.indexOf(id), 1);

        if (!bot.users.get(id)) {
            await ctx.createMessage(`Removed user **${id}** from the blacklist.`);
        } else {
            await ctx.createMessage(`Removed user **${utils.formatUsername(bot.users.get(id))}** from the blacklist.`);
        }
    }
};
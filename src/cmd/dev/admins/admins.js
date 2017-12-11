/**
 * @file Add and remove admins
 * @author Ovyerus
 */

const fs = require('fs');

exports.loadAsSubcommands = true;

exports.commands = [
    'add',
    'remove'
];

exports.main = {
    desc: 'Manage bot admins.',
    usage: '[<add|remove> <mention|id>]',
    owner: true,
    async main(bot, ctx) {
        let embed = {
            title: 'Bot Admins',
            description: `**${utils.formatUsername(bot.users.get(bot.config.ownerID))}** (Bot owner)`
        };

        bot.admins.forEach(a => embed.description += `\n**${utils.formatUsername(bot.users.get(a))}**`);

        await ctx.createMessage({embed});
    }
};

exports.add = {
    desc: 'Add admins.',
    usage: '<mention|id>',
    async main(bot, ctx) {
        if (ctx.author.id !== bot.config.ownerID) return await ctx.createMessage('This is restricted to the bot owner.');
        if (!/^<@!?\d+>$/.test(ctx.args[0])) return await ctx.createMessage('Please mention the user to add, or their id.');

        let id = /^(<@!?\d+>|\d+)$/.test(ctx.args[0]) ? ctx.args[0].replace(/^<@!?/, '').slice(0, -1) : ctx.args[0];

        if (!bot.users.get(id)) return await ctx.createMessage('That user does not exist or I cannot see them.');

        let newAdmins = bot.admins.concat(id);
        let data = {admins: newAdmins, blacklist: bot.blacklist};

        fs.writeFileSync(`./data/data.json`, JSON.stringify(data));
        bot.admins.push(id);
        await ctx.createMessage(`Added admin **${utils.formatUsername(bot.users.get(id))}**.`);
    }
};

exports.remove = {
    desc: 'Remove admins.',
    usage: '<mention|ID>',
    async main(bot, ctx) {
        if (ctx.author.id !== bot.config.ownerID) return await ctx.createMessage('This is restricted to the bot owner.');
        if (!/^(<@!?\d+>|\d+)$/.test(ctx.args[0])) return await ctx.createMessage('Please mention the user to add, or their id.');

        let id = /^<@!?\d+>$/.test(ctx.args[0]) ? ctx.args[0].replace(/^<@!?/, '').slice(0, -1) : ctx.args[0];

        if (!bot.admins.includes(id)) return await ctx.createMessage('That user is not an admin.');

        let newAdmins = bot.admins.filter(a => a !== id);
        let data = {admins: newAdmins, blacklist: bot.blacklist};

        fs.writeFileSync(`./data/data.json`, JSON.stringify(data));
        bot.admins.splice(bot.admins.indexOf(id), 1);
        await ctx.createMessage(`Removed admin **${utils.formatUsername(bot.users.get(id))}**.`);
    }
};
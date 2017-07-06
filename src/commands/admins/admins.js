/*
 * admins.js - Add and remove admins
 * 
 * Contributed by Ovyerus
 */

const fs = require('fs');

exports.loadAsSubcommands = true;

exports.commands = [
    'add',
    'remove'
];

exports.main = {
    desc: 'Manage bot admins.',
    longDesc: 'View, add or remove bot admins.',
    usage: '[<add|remove> <mention|id>]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let embed = {
                title: 'Bot Admins',
                description: `**${utils.formatUsername(bot.users.get(bot.config.ownerID))}** (Bot owner)`
            };

            bot.admins.forEach(a => embed.description += `\n**${utils.formatUsername(bot.users.get(a))}**`);

            ctx.createMessage({embed}).then(resolve).catch(reject);
        });
    }
};

exports.add = {
    desc: 'Add admins.',
    usage: '<mention|id>',
    adminOnly: true,
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.author.id !== bot.config.ownerID) {
                ctx.createMessage('This is restricted to the bot owner.').then(resolve).catch(reject);
            } else {
                if (!/^<@!?\d+>$/.test(ctx.args[0])) {
                    ctx.createMessage('Please mention the user to add, or their id.').then(resolve).catch(reject);
                } else {
                    let id = /^(<@!?\d+>|\d+)$/.test(ctx.args[0]) ? ctx.args[0].replace(/^<@!?/, '').slice(0, -1) : ctx.args[0];

                    if (!bot.users.get(id)) {
                        ctx.createMessage('That user does not exist or I cannot see them.').then(resolve).catch(reject);
                    } else {
                        let newAdmins = bot.admins.concat(id);
                        let data = {admins: newAdmins, blacklist: bot.blacklist};

                        fs.writeFile(`${__baseDir}/data/data.json`, JSON.stringify(data), err => {
                            if (err) {
                                reject(err);
                            } else {
                                bot.admins.push(id);
                                ctx.createMessage(`Added admin **${utils.formatUsername(bot.users.get(id))}**.`).then(resolve).catch(reject);
                            }
                        });
                    }
                }
            }
        });
    }
};

exports.remove = {
    desc: 'Remove admins.',
    usage: '<mention|ID>',
    adminOnly: true,
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.author.id !== bot.config.ownerID) {
                ctx.createMessage('This is restricted to the bot owner.').then(resolve).catch(reject);
            } else {
                if (!/^(<@!?\d+>|\d+)$/.test(ctx.args[0])) {
                    ctx.createMessage('Please mention the user to add, or their id.').then(resolve).catch(reject);
                } else {
                    let id = /^<@!?\d+>$/.test(ctx.args[0]) ? ctx.args[0].replace(/^<@!?/, '').slice(0, -1) : ctx.args[0];

                    if (!bot.admins.includes(id)) {
                        ctx.createMessage('That user is not an admin.').then(resolve).catch(reject);
                    } else {
                        let newAdmins = bot.admins.filter(a => a !== id);
                        let data = {admins: newAdmins, blacklist: bot.blacklist};

                        fs.writeFile(`${__baseDir}/data/data.json`, JSON.stringify(data), err => {
                            if (err) {
                                reject(err);
                            } else {
                                bot.admins.splice(bot.admins.indexOf(id), 1);
                                ctx.createMessage(`Removed admin **${utils.formatUsername(bot.users.get(id))}**.`).then(resolve).catch(reject);
                            }
                        });
                    }
                }
            }
        });
    }
};
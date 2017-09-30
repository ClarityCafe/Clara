/*
 * blacklist.js - Dynamic blacklist command.
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
    desc: 'Add or remove people in the blacklist.',
    usage: '[<add|remove> <mention|id>]',
    owner: true,
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let embed = {
                title: 'Blacklisted Users',
                description: []
            };

            if (bot.blacklist.length === 0) {
                embed.description = 'No one.',
                ctx.createMessage({embed}).then(resolve).catch(reject);
            } else {
                bot.blacklist.forEach(u => {
                    if (bot.users.get(u)) {
                        embed.description.push(`**${utils.formatUsername(bot.users.get(u))}** (${u})`);
                    } else {
                        embed.description.push(`**Unknown user** (${u})`);
                    }
                });
                embed.description = embed.description.join('\n');

                ctx.createMessage({embed}).then(resolve).catch(reject);
            }
        });
    }
};

exports.add = {
    desc: 'Add a user to the blacklist.',
    usage: '<mention|id>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!/^(<@!?\d+>|\d+)$/.test(ctx.args[0])) {
                ctx.createMessage('Please mention the user to add, or their id.').then(resolve).catch(reject);
            } else {
                let id = /^<@!?\d+>$/.test(ctx.args[0]) ? ctx.args[0].replace(/^<@!?/, '').slice(0, -1) : ctx.args[0];

                if (!bot.users.get(id)) {
                    ctx.createMessage('That user does not exist or I cannot see them.').then(resolve).catch(reject);
                } else {
                    let newBlacklist = bot.blacklist.concat(id);
                    let data = {admins: bot.blacklist, blacklist: newBlacklist};

                    fs.writeFile(`${__baseDir}/data/data.json`, JSON.stringify(data), err => {
                        if (err) {
                            reject(err);
                        } else {
                            bot.blacklist.push(id);
                            ctx.createMessage(`Added user **${utils.formatUsername(bot.users.get(id))}** to the blacklist.`).then(resolve).catch(reject);
                        }
                    });
                }
            }
        });
    }
};

exports.remove = {
    desc: 'Remove a user from the blacklist.',
    usage: '<mention|ID>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!/^(<@!?\d+>|\d+)$/.test(ctx.args[0])) {
                ctx.createMessage('Please mention the user to add, or their id.').then(resolve).catch(reject);
            } else {
                let id = /^<@!?\d+>$/.test(ctx.args[0]) ? ctx.args[0].replace(/^<@!?/, '').slice(0, -1) : ctx.args[0];
                console.log(id);
                if (!bot.blacklist.includes(id)) {
                    ctx.createMessage('That user is not on the blacklist.').then(resolve).catch(reject);
                } else {
                    let newBlacklist = bot.blacklist.filter(b => b !== id);
                    let data = {admins: bot.admins, blacklist: newBlacklist};

                    fs.writeFile(`${__baseDir}/data/data.json`, JSON.stringify(data), err => {
                        if (err) {
                            reject(err);
                        } else {
                            bot.blacklist.splice(bot.blacklist.indexOf(id), 1);
                            if (!bot.users.get(id)) {
                                ctx.createMessage(`Removed user **${id}** from the blacklist.`).then(resolve).catch(reject);
                            } else {
                                ctx.createMessage(`Removed user **${utils.formatUsername(bot.users.get(id))}** from the blacklist.`).then(resolve).catch(reject);
                            }
                        }
                    });
                }
            }
        });
    }
};
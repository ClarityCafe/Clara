/*
 * prefixes.js - Add/remove and view alternative prefixes
 *
 * Contributed by Ovyerus
 */

/* eslint-env node */

const fs = require('fs');

exports.loadAsSubcommands = true;
exports.commands = [
    'add',
    'remove'
];

exports.main = {
    desc: 'View the various prefixes used by the bot and edit them.',
    fullDesc: 'Prefixes command. If no arguments are supplied or are not the correct ones, it just displays the available prefixes. Adding and removing prefixes are only allowed by the bot owners(s)',
    owner: true,
    usage: '[<add|remove> <prefix>]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
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

            ctx.createMessage({embed}).then(resolve).catch(reject);
        });
    }
};

exports.add = {
    desc: 'Add a prefix.',
    usage: '<prefix>',
    owner: true,
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                ctx.createMessage('Please give me a prefix to add.').then(resolve).catch(reject);
            } else {
                let prefix = ctx.args.join(' ');
                let newPrefixes = bot.prefixes.concat(prefix).filter(p => p !== bot.config.mainPrefix && !RegExp(`^<@!?${bot.user.id}> $`).test(p));

                fs.writeFile(`${__baseDir}/data/prefixes.json`, JSON.stringify(newPrefixes), err => {
                    if (err) {
                        reject(err);
                    } else {
                        bot.prefixes.push(ctx.args.join(' '));
                        ctx.createMessage(`Added prefix \`${prefix}\``).then(resolve).catch(reject);
                    }
                });
            }
        });
    }
};

exports.remove = {
    desc: 'Remove a prefix.',
    usage: '<prefix>',
    owner: true,
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                ctx.createMessage('Please give me a prefix to remove.').then(resolve).catch(reject);
            } else {
                let prefix = ctx.args.join(' ');
                let newPrefixes = bot.prefixes.filter(p => p !== prefix);

                if (RegExp(`^<@!?${bot.user.id}> ?$`).test(prefix) || prefix === bot.config.mainPrefix || newPrefixes.equals(bot.prefixes)) {
                    ctx.createMessage("That prefix doesn't exist or can't be removed.").then(resolve).catch(reject);
                } else {
                    newPrefixes = newPrefixes.filter(p => p !== bot.config.mainPrefix && !RegExp(`^<@!?${bot.user.id}> $`).test(p));

                    fs.writeFile(`${__baseDir}/data/prefixes.json`, JSON.stringify(newPrefixes), err => {
                        if (err) {
                            reject(err);
                        } else {
                            bot.prefixes.splice(bot.prefixes.indexOf(prefix), 1);
                            ctx.createMessage(`Removed prefix \`${prefix}\``).then(resolve).catch(reject);
                        }
                    });
                }
            }
        });
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
/*
 * prefixes.js - Add/remove and view alternative prefixes
 *
 * Contributed by Ovyerus
 */

const Promise = require('bluebird');
const fs = require('fs');
const utils = require(`${_baseDir}/lib/utils.js`);

exports.commands = [
    'prefixes'
];

exports.prefixes = {
    desc: 'View the various prefixes used by the bot and edit them.',
    fullDesc: 'Prefixes command. If no arguments are supplied or are not the correct ones, it just displays the available prefixes. Adding and removing prefixes are only allowed by the bot owners(s)',
    usage: '[<add|remove> <prefix>]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0 || !/^(add|remove)$/.test(ctx.args[0])) {
                var prefixes = JSON.parse(fs.readFileSync(`${_baseDir}/data/prefixes.json`));
                prefixes.unshift('@mention');
                prefixes.unshift(bot.config.mainPrefix);
                var prfxTxt = `**${prefixes.length}** prefixes available\n`;
                prfxTxt += '```js\n';
                prfxTxt += `'${prefixes.join("',\n'")}'\n`;
                prfxTxt += '```';
                ctx.msg.channel.sendMessage(prfxTxt).then(() => resolve()).catch(err => reject([err]));
            } else {
                if (!utils.isOwner(ctx.msg.author.id) || !utils.isAdmin(ctx.msg.author.id)) {
                    ctx.msg.channel.sendMessage('You do not have permission to do that.').then(() => {
                        reject([new Error('User is not owner or bot admin.')]);
                    }).catch(err => reject([err]));
                } else {
                    if (ctx.args[0] === 'add') {
                        var prefixes = JSON.parse(fs.readFileSync(`${_baseDir}/data/prefixes.json`));
                        ctx.args.shift();
                        if ((ctx.args.join(' ') === bot.config.mainPrefix || ctx.args.join(' ') === '@mention') || prefixes.indexOf(ctx.args.join(' ')) !== -1) {
                            ctx.msg.channel.sendMessage('That prefix already exists').then(() => {
                                reject([new Error('Prefix already exists.')]);
                            }).catch(err => reject([err]));
                        } else {
                            prefixes.push(ctx.args.join(' '));
                            fs.writeFile(`${_baseDir}/data/prefixes.json`, JSON.stringify(prefixes), err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    ctx.msg.channel.sendMessage(`Prefix \`${ctx.args.join(' ')}\` successfully added.`).then(() => resolve()).catch(err => reject([err]));
                                }
                            });
                        }
                    } else if (ctx.args[0] === 'remove') {
                         var prefixes = JSON.parse(fs.readFileSync(`${_baseDir}/data/prefixes.json`));
                        ctx.args.shift();
                        if (ctx.args.join(' ') === bot.config.mainPrefix || ctx.args.join(' ') === '@mention') {
                            ctx.msg.channel.sendMessage('You cannot remove an internal prefix.').then(() => {
                                reject([new Error('User tried to remove internal prefix.')]);
                            }).catch(err => reject([err]));
                        } else if (prefixes.indexOf(ctx.args.join(' ')) === -1) {
                            ctx.msg.channel.sendMessage('That prefix does not exist').then(() => {
                                reject([new Error('Prefix does not exist')]);
                            }).catch(err => reject([err]));
                        } else {
                            prefixes.splice(prefixes.indexOf(ctx.args.join(' ')), 1);
                            fs.writeFile(`${_baseDir}/data/prefixes.json`, JSON.stringify(prefixes), err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    ctx.msg.channel.sendMessage(`Prefix \`${ctx.args.join(' ')}\` successfully removed.`).then(() => resolve()).catch(err => reject([err]));''
                                }
                            });
                        }
                    }
                }
            }
        });
    }
}
/*
 * prefixes.js - Add/remove and view alternative prefixes
 *
 * Contributed by Ovyerus
 */


const fs = require('fs');
const utils = require(`${__baseDir}/lib/utils.js`);

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
                let prefixes = JSON.parse(fs.readFileSync(`${__baseDir}/data/prefixes.json`));
                prefixes.unshift('@mention');
                prefixes.unshift(bot.config.mainPrefix);
                var prfxTxt = `**${prefixes.length}** prefixes available\n`;
                prfxTxt += '```js\n';
                prfxTxt += `'${prefixes.join("',\n'")}'\n`;
                prfxTxt += '```';
                ctx.msg.channel.createMessage(prfxTxt).then(resolve).catch(reject);
            } else {
                if (!utils.isOwner(ctx.msg.author.id) || !utils.isAdmin(ctx.msg.author.id)) {
                    ctx.msg.channel.createMessage('You do not have permission to do that.').then(resolve).catch(reject);
                } else {
                    if (ctx.args[0] === 'add') {
                        let prefixes = JSON.parse(fs.readFileSync(`${__baseDir}/data/prefixes.json`));
                        ctx.args.shift();
                        if ((ctx.args.join(' ') === bot.config.mainPrefix || ctx.args.join(' ') === '@mention') || prefixes.indexOf(ctx.args.join(' ')) !== -1) {
                            ctx.msg.channel.createMessage('That prefix already exists').then(resolve).catch(reject);
                        } else {
                            prefixes.push(ctx.args.join(' '));
                            fs.writeFile(`${__baseDir}/data/prefixes.json`, JSON.stringify(prefixes), err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    ctx.msg.channel.createMessage(`Prefix \`${ctx.args.join(' ')}\` successfully added.`).then(resolve).catch(reject);
                                }
                            });
                        }
                    } else if (ctx.args[0] === 'remove') {
                        let prefixes = JSON.parse(fs.readFileSync(`${__baseDir}/data/prefixes.json`));
                        ctx.args.shift();
                        if (ctx.args.join(' ') === bot.config.mainPrefix || ctx.args.join(' ') === '@mention') {
                            ctx.msg.channel.createMessage('You cannot remove an internal prefix.').then(resolve).catch(reject);
                        } else if (prefixes.indexOf(ctx.args.join(' ')) === -1) {
                            ctx.msg.channel.createMessage('That prefix does not exist').then(resolve).catch(reject);
                        } else {
                            prefixes.splice(prefixes.indexOf(ctx.args.join(' ')), 1);
                            fs.writeFile(`${__baseDir}/data/prefixes.json`, JSON.stringify(prefixes), err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    ctx.msg.channel.createMessage(`Prefix \`${ctx.args.join(' ')}\` successfully removed.`).then(resolve).catch(reject);
                                }
                            });
                        }
                    }
                }
            }
        });
    }
};
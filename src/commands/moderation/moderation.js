/*
 * moderation.js - Moderation commands for people who are lazy.
 * 
 * Contributed by Capuccino and Ovyerus
 */


const utils = require(`${__baseDir}/lib/utils.js`);
const safe = require('safe-regex');

exports.commands = [
    'kick',
    'ban',
    'purge'
];

function deleteDelay(msg) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            msg.delete().then(() => resolve()).catch(reject);
        }, 2000);
    });
}

exports.kick = {
    desc: 'Kicks the mentioned people from the guild.',
    fullDesc: "Kicks the mentioned people from the guild the command is executed in. Can kick multiple people at once. Requires the 'Kick Members' permission.",
    usage: '<user mention(s)>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.msg.member.permission.has('kickMembers')) {
                ctx.msg.channel.createMessage(localeManager.t('user-noPerm', 'en-UK', {perm: 'Kick Members'})).then(resolve).catch(reject);
            } else {
                if (!ctx.guildBot.permission.has('kickMembers')) {
                    ctx.msg.channel.createMessage(localeManager.t('bot-noPerm', 'en-UK', {perm: 'Kick Members'})).then(resolve).catch(reject);
                } else {
                    if (ctx.msg.mentions.length === 0) {
                        ctx.msg.channel.createMessage(localeManager.t('kick-noMention', 'en-UK')).then(resolve).catch(reject);
                    } else {
                        var promises = [];
                        for (let u of ctx.msg.mentions) {
                            if (u.id !== bot.user.id) {
                                if (u.id !== ctx.msg.author.id) {
                                    promises.push(bot.kickGuildMember(ctx.msg.channel.guild.id, u.id).catch(err => {
                                        if (err.resp.statusCode === 403) {
                                            ctx.msg.channel.createMessage(localeManager.t('kick-insufficientPerm', 'en-UK', {e: utils.formatUsername(u)}));
                                        } else {
                                            var oops = localeManager.t('kick-error', 'en-UK', {user: utils.formatUsername(u)});
                                            oops += '```js\n';
                                            oops += err + '\n';
                                            oops += '```';
                                            ctx.msg.channel.createMessage(oops);
                                        }
                                    }));
                                } else {
                                    ctx.msg.channel.createMessage(localeManager.t('mod-authorSkip', 'en-UK'));
                                }
                            } else {
                                ctx.msg.channel.createMessage(localeManager.t('mod-selfSkip', 'en-UK'));
                            }
                        }
                        Promise.all(promises).then(kicked => ctx.msg.channel.createMessage(localeManager.t('kick-finish', 'en-UK', {amt: kicked.length})).then(resolve).catch(reject));
                    }
                }
            }
        });
    }
};

exports.ban = {
    desc: 'Bans the mentioned people from the guild.',
    fullDesc: "Bans the mentioned people from the guild the command is executed in. Can ban multiple people at once. Requires the 'Ban Members' permission.",
    usage: '<user mention(s)>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.msg.member.permission.has('banMembers')) {
                ctx.msg.channel.createMessage(localeManager.t('user-noPerms', 'en-UK', {perm: 'Ban Members'})).then(resolve).catch(reject);
            } else {
                if (!ctx.guildBot.permission.has('banMembers')) {
                    ctx.msg.channel.createMessage(localeManager.t('bot-noPerms', 'en-UK', {perm: 'Ban Members'})).then(resolve).catch(reject);
                } else {
                    if (ctx.msg.mentions.length === 0) {
                        ctx.msg.channel.createMessage(localeManager.t('ban-noMention', 'en-UK')).then(resolve).catch(reject);
                    } else {
                        var promises = [];
                        ctx.msg.mentions.forEach(u => {
                            if (u.id !== bot.user.id) {
                                if (u.id !== ctx.msg.author.id) {
                                    promises.push(bot.banGuildMember(ctx.msg.channel.guild.id, u.id, 7).catch(err => {
                                        if (err.resp.statusCode === 403) {
                                            ctx.msg.channel.createMessage(localeManager.t('ban-insufficientPerm', 'en-UK', {user: utils.formatUsername(u)}));
                                        } else {
                                            var oops = localeManager.t('ban-error', 'en-UK', {user: utils.formatUser(u)});
                                            oops += '```js\n';
                                            oops += err + '\n';
                                            oops += '```';
                                            ctx.msg.channel.createMessage(oops);
                                        }
                                    }));
                                } else {
                                    ctx.msg.channel.createMessage(localeManager.t('mod-authorSkip', 'en-UK'));
                                }
                            } else {
                                ctx.msg.channel.createMessage(localeManager.t('mod-selfSkip', 'en-UK'));
                            }
                        });
                        Promise.all(promises).then(banned => ctx.msg.channel.createMessage(localeManager.t('ban-finish', 'en-UK', {amt: banned.length})).then(resolve).catch(reject));
                    }
                }
            }
        });
    }
};

exports.purge = {
    desc: 'Clean the messages from the bot or from a user or another bot',
    longDesc: 'Cleans Messages from a channel.',
    usage: '<type> [amount]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.msg.member.permission.has('manageMessages')) {
                ctx.msg.channel.createMessage(localeManager.t('user-noPerms', 'en-UK', {perm: 'Manage Messages'})).then(resolve).catch(reject);
            } else {
                if (!ctx.msg.channel.guild.members.get(bot.user.id).permission.has('manageMessages')) {
                    ctx.msg.channel.createMessage(localeManager.t('bot-noPerms', 'en-UK', {perm: 'Manage Messages'})).then(resolve).catch(reject);
                } else {
                    if (ctx.args.length === 0) {
                        ctx.msg.channel.createMessage({
                            embed: {
                                title: 'Incorrect Usage',
                                description: '**purge all [0-100]**\n**purge author <author> [0-100]**\n**purge bots [0-100]**\n**purge including <word> [0-100]**\n**purge embeds [0-100]**\n**purge attachments [0-100]**\n**purge images [0-100]**\n**purge regex <regex> [0-100]**',
                                color: 0xF21904
                            }
                        }).then(() => resolve()).catch(err => {
                            if (err.resp && err.resp.statusCode === 400) {
                                var m = '**Incorrect Usage**\n';
                                m += '`purge all [0-100]`\n';
                                m += '`purge author <author ID|author mention> [0-100]`\n';
                                m += '`purge bots [0-100]`\n';
                                m += '`purge including <word> [0-100]`\n';
                                m += '`purge embeds [0-100]`\n';
                                m += '`purge attachments [0-100]`\n';
                                m += '`purge images [0-100]`\n';
                                m += '`purge regex <regex> [0-100]`';
                                ctx.msg.channel.createMessage(m).then(() => resolve()).catch(reject);
                            } else {
                                reject(err);
                            }
                        });
                    } else if (ctx.args.length > 0) {
                        if (ctx.args[0] === 'all') {
                            if (!ctx.args[1] || !/^\d+$/.test(ctx.args[1])) {
                                ctx.msg.channel.purge(100).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finish', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                ctx.msg.channel.purge(Number(ctx.args[1])).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finish', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage(localeManager.t('purge-limit', 'en-UK')).then(() => resolve()).catch(reject);
                            }
                        } else if (ctx.args[0] === 'author') {
                            if (!ctx.args[1] || !/^(?:\d+|<@!?\d+>)$/.test(ctx.args[1])) {
                                ctx.msg.channel.createMessage({
                                    embed: {
                                        title: 'Incorrect Usage',
                                        description: '**purge author <author ID|author mention> [0-100]**',
                                        color: 0xF21904
                                    }
                                }).then(() => resolve()).catch(err => {
                                    if (err.resp && err.resp.statusCode === 400) {
                                        var m = '**Incorrect Usage**\n';
                                        m += '`purge author <author ID|author mention> [0-100]`';
                                        ctx.msg.channel.createMessage(m).then(() => resolve()).catch(reject);
                                    } else {
                                        reject(err);
                                    }
                                });
                            } else {
                                let user = ctx.args[1].match(/^(?:\d+|<@!?\d+>)$/)[0];
                                user = /<@!?\d+>/.test(user) ? user.replace(/<@!?/, '').replace('>', '') : user;
                                user = ctx.msg.channel.guild.members.get(user);
                                if (!user) {
                                    ctx.msg.channel.createMessage(localeManager.t('purge-userNotFound', 'en-UK')).then(() => resolve()).catch(reject);
                                } else {
                                    if (!ctx.args[2] || !/^\d+$/.test(ctx.args[2])) {
                                        ctx.msg.channel.purge(100, m => m.author.id === user.id).then(amt => {
                                            return ctx.msg.channel.createMessage(localeManager.t('purge-finishUser', 'en-UK', {amt, user: utils.formatUsername(user)}));
                                        }).then(deleteDelay).then(() => resolve()).catch(reject);
                                    } else if (/^\d+$/.test(ctx.args[2]) && Number(ctx.args[2]) <= 100 && Number(ctx.args[2]) >= 1) {
                                        let i = 0;
                                        ctx.msg.channel.purge(100, m => m.author.id === user.id && ++i <= Number(ctx.args[2])).then(amt => {
                                            return ctx.msg.channel.createMessage(localeManager.t('purge-finishUser', 'en-UK', {amt, user: utils.formatUsername(user)}));
                                        }).then(deleteDelay).then(() => resolve()).catch(reject);
                                    } else {
                                        ctx.msg.channel.createMessage(localeManager.t('purge-limit', 'en-UK')).then(() => resolve()).catch(reject);
                                    }
                                }
                            }
                        } else if (ctx.args[0] === 'bots') {
                            if (!ctx.args[1] || !/^\d+$/.test(ctx.args[1])) {
                                ctx.msg.channel.purge(100, m => m.author.bot).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finishBots', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                let i = 0;
                                ctx.msg.channel.purge(100, m => m.author.bot && ++i <= Number(ctx.args[1])).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finishBots', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage(localeManager.t('purge-limit', 'en-UK')).then(() => resolve()).catch(reject);
                            }
                        } else if (ctx.args[0] === 'including') {
                            if (!ctx.args[1]) {
                                ctx.msg.channel.createMessage({
                                    embed: {
                                        title: 'Incorrect Usage',
                                        description: '**purge including <word> [0-100]**',
                                        color: 0xF21904
                                    }
                                }).then(() => resolve()).catch(err => {
                                    if (err.resp && err.resp.statusCode === 400) {
                                        var m = '**Incorrect Usage**\n';
                                        m += '`purge including <content> [0-100]`';
                                        ctx.msg.channel.createMessage(m).then(() => resolve()).catch(reject);
                                    } else {
                                        reject(err);
                                    }
                                });
                            } else {
                                if (!ctx.args[2] || !/^\d+$/.test(ctx.args[2])) {
                                    ctx.msg.channel.purge(100, m => m.content.includes(ctx.args[1])).then(amt => {
                                        return ctx.msg.channel.createMessage(localeManager.t('purge-finish', 'en-UK', {amt}));
                                    }).then(deleteDelay).then(() => resolve()).catch(reject);
                                } else if (/^\d+$/.test(ctx.args[2]) && Number(ctx.args[2]) <= 100 && Number(ctx.args[2]) >= 1) {
                                    let i = 0;
                                    ctx.msg.channel.purge(100, m => m.content.includes(ctx.args[1]) && ++i <= Number(ctx.args[2])).then(amt => {
                                        return ctx.msg.channel.createMessage(localeManager.t('purge-finish', 'en-UK', {amt}));
                                    }).then(deleteDelay).then(() => resolve()).catch(reject);
                                } else {
                                    ctx.msg.channel.createMessage(localeManager.t('purge-limit', 'en-UK')).then(() => resolve()).catch(reject);
                                }
                            }
                        } else if (ctx.args[0] === 'embeds') {
                            if (!ctx.args[1] || !/^\d+$/.test(ctx.args[1])) {
                                ctx.msg.channel.purge(100, m => m.embeds.length > 0).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finishEmbeds', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                let i = 0;
                                ctx.msg.channel.purge(100, m => m.embeds.length > 0 && ++i <= Number(ctx.args[1])).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finishEmbeds', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage(localeManager.t('purge-limit', 'en-UK')).then(() => resolve()).catch(reject);
                            }
                        } else if (ctx.args[0] === 'attachments') {
                            if (!ctx.args[1] || !/^\d+$/.test(ctx.args[1])) {
                                ctx.msg.channel.purge(100, m => m.attachments.length > 0).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finishAttachments', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                let i = 0;
                                ctx.msg.channel.purge(100, m => m.attachments.length > 0 && ++i <= Number(ctx.args[1])).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finishAttachments', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage(localeManager.t('purge-limit', 'en-UK')).then(() => resolve()).catch(reject);
                            }
                        } else if (ctx.args[0] === 'images') {
                            if (!ctx.args[1] || !/^\d+$/.test(ctx.args[1])) {
                                ctx.msg.channel.purge(100, m => {
                                    if (m.attachments.length > 0) {
                                        return m.attachments.filter(atch => /(?:([^:/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:png|jpe?g|gifv?|webp|bmp|tiff|jfif))(?:\?([^#]*))?(?:#(.*))?/ig.test(atch.url)).length > 0;
                                    } else {
                                        return /(?:([^:/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:png|jpe?g|gifv?|webp|bmp|tiff|jfif))(?:\?([^#]*))?(?:#(.*))?/ig.test(m.content);
                                    }
                                }).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finishImages', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                let i = 0;
                                ctx.msg.channel.purge(100, m => {
                                    if (m.attachments.length > 0) {
                                        return m.attachments.filter(atch => /(?:([^:/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:png|jpe?g|gifv?|webp|bmp|tiff|jfif))(?:\?([^#]*))?(?:#(.*))?/ig.test(atch.url)).length > 0 && ++i <= Number(ctx.args[1]);
                                    } else {
                                        return /(?:([^:/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:png|jpe?g|gifv?|webp|bmp|tiff|jfif))(?:\?([^#]*))?(?:#(.*))?/ig.test(m.content) && ++i <= Number(ctx.args[1]);
                                    }
                                }).then(amt => {
                                    return ctx.msg.channel.createMessage(localeManager.t('purge-finishImages', 'en-UK', {amt}));
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage(localeManager.t('purge-limit', 'en-UK')).then(() => resolve()).catch(reject);
                            }
                        } else if (ctx.args[0] === 'regex') {
                            if (!ctx.args[1]) {
                                ctx.msg.channel.createMessage({
                                    embed: {
                                        title: 'Incorrect Usage',
                                        description: '**purge regex <regex> [0-100]**',
                                        color: 0xF21904
                                    }
                                }).then(() => resolve()).catch(err => {
                                    if (err.resp && err.resp.statusCode === 400) {
                                        var m = '**Incorrect Usage**\n';
                                        m += '`purge regex <regex> [0-100]`';
                                        ctx.msg.channel.createMessage(m).then(() => resolve()).catch(reject);
                                    } else {
                                        reject(err);
                                    }
                                });
                            } else {
                                var purgeRegex;

                                if (safe(ctx.args[1])) {
                                    purgeRegex = new RegExp(ctx.args[1]);
                                } else {
                                    ctx.msg.channel.createMessage(localeManager.t('purge-badRegex', 'en-UK')).then(() => resolve()).catch(reject);
                                }

                                if (purgeRegex) {
                                    if (!ctx.args[2] || !/^\d+$/.test(ctx.args[2])) {
                                        ctx.msg.channel.purge(100, m => purgeRegex.test(m.content)).then(amt => {
                                            return ctx.msg.channel.createMessage(localeManager.t('purge-finish', 'en-UK', {amt}));
                                        }).then(deleteDelay).then(() => resolve()).catch(reject);
                                    } else if (/^\d+$/.test(ctx.args[2]) && Number(ctx.args[2]) <= 100 && Number(ctx.args[2]) >= 1) {
                                        let i = 0;
                                        ctx.msg.channel.purge(100, m => purgeRegex.test(m.content) && ++i <= Number(ctx.args[2])).then(amt => {
                                            ctx.msg.channel.createMessage(localeManager.t('purge-finish', 'en-UK', {amt}));
                                        }).then(deleteDelay).then(() => resolve()).catch(reject);
                                    } else {
                                        ctx.msg.channel.createMessage(localeManager.t('purge-limit', 'en-UK')).then(() => resolve()).catch(reject);
                                    }
                                }
                            }
                        } else {
                            ctx.msg.channel.createMessage({
                                embed: {
                                    title: 'Incorrect Usage',
                                    description: '**purge all [0-100]**\n**purge author <author> [0-100]**\n**purge bots [0-100]**\n**purge including <word> [0-100]**\n**purge embeds [0-100]**\n**purge attachments [0-100]**\n**purge images [0-100]**\n**purge regex <regex> [0-100]**',
                                    color: 0xF21904
                                }
                            }).then(() => resolve()).catch(err => {
                                if (err.resp && err.resp.statusCode === 400) {
                                    var m = '**Incorrect Usage**\n';
                                    m += '`purge all [0-100]`\n';
                                    m += '`purge author <author ID|author mention> [0-100]`\n';
                                    m += '`purge bots [0-100]`\n';
                                    m += '`purge including <word> [0-100]`\n';
                                    m += '`purge embeds [0-100]`\n';
                                    m += '`purge attachments [0-100]`\n';
                                    m += '`purge images [0-100]`\n';
                                    m += '`purge regex <regex> [0-100]`';
                                    ctx.msg.channel.createMessage(m).then(() => resolve()).catch(reject);
                                } else {
                                    reject(err);
                                }
                            });
                        }
                    }
                }
            }
        });
    }
};
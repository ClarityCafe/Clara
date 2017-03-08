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
                ctx.msg.channel.createMessage('You require the **Kick Members** permission to execute this command.').then(resolve).catch(reject);
            } else {
                if (!ctx.guildBot.permission.has('kickMembers')) {
                    ctx.msg.channel.createMessage('I do not have the **Kick Members** permission.').then(resolve).catch(reject);
                } else {
                    if (ctx.msg.mentions.length === 0) {
                        ctx.msg.channel.createMessage('Please mention at least one user to kick.').then(resolve).catch(reject);
                    } else {
                        var promises = [];
                        for (let u of ctx.msg.mentions) {
                            if (u.id !== bot.user.id) {
                                if (u.id !== ctx.msg.author.id) {
                                    promises.push(bot.kickGuildMember(ctx.msg.channel.guild.id, u.id).catch(err => {
                                        if (err.resp.statusCode === 403) {
                                            ctx.msg.channel.createMessage(`Unable to kick **${utils.formatUsername(u)}** due to insufficient permission.`);
                                        } else {
                                            var oops = `Unable to kick **${utils.formatUsername(u)}**\n`;
                                            oops += '```js\n';
                                            oops += err + '\n';
                                            oops += '```';
                                            ctx.msg.channel.createMessage(oops);
                                        }
                                    }));
                                } else {
                                    ctx.msg.channel.createMessage('Skipping over author mention.');
                                }
                            } else {
                                ctx.msg.channel.createMessage('Skipping over self mention.');
                            }
                        }
                        Promise.all(promises).then(kicked => ctx.msg.channel.createMessage(`Kicked ${kicked.length === 0 ? 'no one.' : kicked.length + ` ${kicked.length === 1 ? 'user' : 'users'}.`}`).then(resolve).catch(reject));
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
                ctx.msg.channel.createMessage('You require the **Ban Members** permission to execute this command.').then(resolve).catch(reject);
            } else {
                if (!ctx.guildBot.permission.has('banMembers')) {
                    ctx.msg.channel.createMessage('I do not have the **Ban Members** permission.').then(resolve).catch(reject);
                } else {
                    if (ctx.msg.mentions.length === 0) {
                        ctx.msg.channel.createMessage('Please mention at least one user to ban.').then(resolve).catch(reject);
                    } else {
                        var promises = [];
                        ctx.msg.mentions.forEach(u => {
                            if (u.id !== bot.user.id) {
                                if (u.id !== ctx.msg.author.id) {
                                    promises.push(bot.banGuildMember(ctx.msg.channel.guild.id, u.id, 7).catch(err => {
                                        if (err.resp.statusCode === 403) {
                                            ctx.msg.channel.createMessage(`Unable to ban **${utils.formatUsername(u)}** due to insufficient permission.`);
                                        } else {
                                            var oops = `Unable to ban **${utils.formatUsername(u)}**\n`;
                                            oops += '```js\n';
                                            oops += err + '\n';
                                            oops += '```';
                                            ctx.msg.channel.createMessage(oops);
                                        }
                                    }));
                                } else {
                                    ctx.msg.channel.createMessage('Skipping over author mention.');
                                }
                            } else {
                                ctx.msg.channel.createMessage('Skipping over self mention.');
                            }
                        });
                        Promise.all(promises).then(banned => ctx.msg.channel.createMessage(`Banned ${banned.length === 0 ? 'no one.' : banned.length + ` ${banned.length === 1 ? 'user' : 'users'}.`}`).then(resolve).catch(reject));
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
                ctx.msg.channel.createMessage('You require the **Manage Messages** permission to execute this command.').then(resolve).catch(reject);
            } else {
                if (!ctx.msg.channel.guild.members.get(bot.user.id).permission.has('manageMessages')) {
                    ctx.msg.channel.createMessage('I do not have the **Manage Messages** permission.').then(resolve).catch(reject);
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
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'message' : 'messages'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                ctx.msg.channel.purge(Number(ctx.args[1])).then(amt => {
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'message' : 'messages'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage('Woah there, way too spicy. I only accept numbers between `1` and `100`').then(() => resolve()).catch(reject);
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
                                    ctx.msg.channel.createMessage('That user could not be found.').then(() => resolve()).catch(reject);
                                } else {
                                    if (!ctx.args[2] || !/^\d+$/.test(ctx.args[2])) {
                                        ctx.msg.channel.purge(100, m => m.author.id === user.id).then(amt => {
                                            return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'message' : 'messages'} from **${bot.formatUser(user)}**.`);
                                        }).then(deleteDelay).then(() => resolve()).catch(reject);
                                    } else if (/^\d+$/.test(ctx.args[2]) && Number(ctx.args[2]) <= 100 && Number(ctx.args[2]) >= 1) {
                                        let i = 0;
                                        ctx.msg.channel.purge(100, m => m.author.id === user.id && ++i <= Number(ctx.args[2])).then(amt => {
                                            return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'message' : 'messages'} from **${bot.formatUser(user)}**.`);
                                        }).then(deleteDelay).then(() => resolve()).catch(reject);
                                    } else {
                                        ctx.msg.channel.createMessage('Woah there, way too spicy. I only accept numbers between `1` and `100`').then(() => resolve()).catch(reject);
                                    }
                                }
                            }
                        } else if (ctx.args[0] === 'bots') {
                            if (!ctx.args[1] || !/^\d+$/.test(ctx.args[1])) {
                                ctx.msg.channel.purge(100, m => m.author.bot).then(amt => {
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** bot ${amt === 1 ? 'message' : 'messages'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                let i = 0;
                                ctx.msg.channel.purge(100, m => m.author.bot && ++i <= Number(ctx.args[1])).then(amt => {
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** bot ${amt === 1 ? 'message' : 'messages'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage('Woah there, way too spicy. I only accept numbers between `1` and `100`').then(() => resolve()).catch(reject);
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
                                        return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'message' : 'messages'}.`);
                                    }).then(deleteDelay).then(() => resolve()).catch(reject);
                                } else if (/^\d+$/.test(ctx.args[2]) && Number(ctx.args[2]) <= 100 && Number(ctx.args[2]) >= 1) {
                                    let i = 0;
                                    ctx.msg.channel.purge(100, m => m.content.includes(ctx.args[1]) && ++i <= Number(ctx.args[2])).then(amt => {
                                        return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'message' : 'messages'}.`);
                                    }).then(deleteDelay).then(() => resolve()).catch(reject);
                                } else {
                                    ctx.msg.channel.createMessage('Woah there, way too spicy. I only accept numbers between `1` and `100`').then(() => resolve()).catch(reject);
                                }
                            }
                        } else if (ctx.args[0] === 'embeds') {
                            if (!ctx.args[1] || !/^\d+$/.test(ctx.args[1])) {
                                ctx.msg.channel.purge(100, m => m.embeds.length > 0).then(amt => {
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'embed' : 'embeds'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                let i = 0;
                                ctx.msg.channel.purge(100, m => m.embeds.length > 0 && ++i <= Number(ctx.args[1])).then(amt => {
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'embed' : 'embeds'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage('Woah there, way too spicy. I only accept numbers between `1` and `100`').then(() => resolve()).catch(reject);
                            }
                        } else if (ctx.args[0] === 'attachments') {
                            if (!ctx.args[1] || !/^\d+$/.test(ctx.args[1])) {
                                ctx.msg.channel.purge(100, m => m.attachments.length > 0).then(amt => {
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'attachment' : 'attachments'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else if (/^\d+$/.test(ctx.args[1]) && Number(ctx.args[1]) <= 100 && Number(ctx.args[1]) >= 1) {
                                let i = 0;
                                ctx.msg.channel.purge(100, m => m.attachments.length > 0 && ++i <= Number(ctx.args[1])).then(amt => {
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'attachment' : 'attachments'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage('Woah there, way too spicy. I only accept numbers between `1` and `100`').then(() => resolve()).catch(reject);
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
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'image' : 'images'}.`);
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
                                    return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'image' : 'images'}.`);
                                }).then(deleteDelay).then(() => resolve()).catch(reject);
                            } else {
                                ctx.msg.channel.createMessage('Woah there, way too spicy. I only accept numbers between `1` and `100`').then(() => resolve()).catch(reject);
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
                                try {
                                    if (safe(ctx.args[1])) {
                                        purgeRegex = new RegExp(ctx.args[1]);
                                    } else {
                                        ctx.msg.channel.createMessage('Invalid or unsafe regex.').then(() => resolve()).catch(reject);
                                    }
                                } catch (err) {
                                    var m = 'Invalid Regex\n```js\n';
                                    m += `${err}\n`;
                                    m += '```';
                                    ctx.msg.channel.createMessage(m).then(() => resolve()).catch(reject);
                                }

                                if (purgeRegex) {
                                    if (!ctx.args[2] || !/^\d+$/.test(ctx.args[2])) {
                                        ctx.msg.channel.purge(100, m => purgeRegex.test(m.content)).then(amt => {
                                            return ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'message' : 'messages'}.`);
                                        }).then(deleteDelay).then(() => resolve()).catch(reject);
                                    } else if (/^\d+$/.test(ctx.args[2]) && Number(ctx.args[2]) <= 100 && Number(ctx.args[2]) >= 1) {
                                        let i = 0;
                                        ctx.msg.channel.purge(100, m => purgeRegex.test(m.content) && ++i <= Number(ctx.args[2])).then(amt => {
                                            ctx.msg.channel.createMessage(`Purged **${amt}** ${amt === 1 ? 'message' : 'messages'}.`);
                                        }).then(deleteDelay).then(() => resolve()).catch(reject);
                                    } else {
                                        ctx.msg.channel.createMessage('Woah there, way too spicy. I only accept numbers between `1` and `100`').then(() => resolve()).catch(reject);
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
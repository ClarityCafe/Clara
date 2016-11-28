/*
 * moderation.js - Moderation commands for people who are lazy.
 * 
 * Contributed by Capuccino and Ovyerus
 */

const Promise = require('bluebird');

exports.commands = [
    'kick',
    'ban'
];

exports.kick = {
    desc: 'Kicks the mentioned people from the guild.',
    fullDesc: "Kicks the mentioned people from the guild the command is executed in. Can kick multiple people at once. Requires the 'Kick Members' permission.",
    usage: '<user mention(s)>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.msg.guild) {
                ctx.msg.channel.sendMessage('This command can only be run in a server.').then(() => reject([new Error('User tried to run command in a DM.')])).catch(err => reject([err]));
            } else {
                if (!ctx.msg.member.hasPermission('KICK_MEMBERS')) {
                    ctx.msg.channel.sendMessage('You require the **Kick Members** permission to execute this command.').then(() => {
                        reject([new Error('User does not have sufficient permission.')]);
                    }).catch(err => reject([err]));
                } else {
                    if (!ctx.guildBot.hasPermission('KICK_MEMBERS')) {
                        ctx.msg.channel.sendMessage('I do not have the **Kick Members** permission.').then(() => {
                            reject([new Error('Bot does not have sufficient permission.')]);
                        }).catch(err => reject([err]));
                    } else {
                        if (ctx.msg.mentions.users.size === 0) {
                            ctx.msg.channel.sendMessage('Please mention at least one user to kick.').then(() => {
                                reject([new Error('No users mentioned to kick.')]);
                            }).catch(err => reject([err]));
                        } else {
                            var kicked = 0;
                            ctx.msg.mentions.users.forEach(m => {
                                if (m.id !== bot.user.id) {
                                    if (m.kickable) {
                                        m.kick().then(() => kicked++).catch(err => {
                                            var errMsg = `Unable to kick **${m.username}#${m.discriminator}**\n`;
                                            errMsg += '```js\n';
                                            errMsg += err + '\n';
                                            errMsg += '```';
                                            ctx.msg.channel.sendMessage(errMsg);
                                        });
                                    } else {
                                        ctx.msg.channel.sendMessage(`I do not have sufficient permission to kick **${m.nickname ?  m.nickname : m.username}#${m.discriminator}**`);
                                    }
                                } else {
                                    console.log('owo whats this? trying to kick myself? ayy lmao.');
                                    ctx.msg.channel.sendMessage("lol no im not gonna kick myself.");
                                }
                            });
                            if (kicked > 0) {
                                ctx.msg.channel.sendMessage(`Kicked **${kicked}** members.`).then(() => resolve()).catch(err => reject([err]));
                            } else {
                                resolve();
                            }
                        }
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
            if (!ctx.msg.guild) {
                ctx.msg.channel.sendMessage('This command can only be run in a server.').then(() => reject([new Error('User tried to run command in a DM.')])).catch(err => reject([err]));
            } else {
                if (!ctx.msg.member.hasPermission('BAN_MEMBERS')) {
                    ctx.msg.channel.sendMessage('You require the **Ban Members** permission to execute this command.').then(() => {
                        reject([new Error('User does not have sufficient permission.')]);
                    }).catch(err => reject([err]));
                } else {
                    if (!ctx.guildBot.hasPermission('BAN_MEMBERS')) {
                        ctx.msg.channel.sendMessage('I do not have the **Ban Members** permission.').then(() => {
                            reject([new Error('Bot does not have sufficient permission.')]);
                        }).catch(err => reject([err]));
                    } else {
                        if (ctx.msg.mentions.users.size === 0) {
                            ctx.msg.channel.sendMessage('Please mention at least one user to ban.').then(() => {
                                reject([new Error('No users mentioned to ban.')]);
                            }).catch(err => reject([err]));
                        } else {
                            var banned = 0;
                            ctx.msg.mentions.users.forEach(m => {
                                if (m.id !== bot.user.id) {
                                    if (m.bannable) {
                                        m.ban().then(() => banned++).catch(err => {
                                            var errMsg = `Unable to ban **${m.username}#${m.discriminator}**\n`;
                                            errMsg += '```js\n';
                                            errMsg += err + '\n';
                                            errMsg += '```';
                                            ctx.msg.channel.sendMessage(errMsg);
                                        });
                                    } else {
                                        ctx.msg.channel.sendMessage(`I do not have sufficient permission to ban **${m.nickname ? m.nickname : m.username}#${m.discriminator}**`);
                                    }
                                } else {
                                    console.log('owo whats this? trying to ban myself? ayy lmao.');
                                    ctx.msg.channel.sendMessage("lol no im not gonna ban myself.");
                                }
                            });
                            if (banned > 0) {
                                ctx.msg.channel.sendMessage(`Banned **${banned}** members.`).then(() => resolve()).catch(err => reject([err]));
                            } else {
                                resolve();
                            }
                        }
                    }
                }
            }
        });
    }
}
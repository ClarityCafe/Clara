/*
 * moderation.js - Moderation commands for people who are lazy.
 * 
 * Contributed by Capuccino and Ovyerus
 */


const utils = require(`${__baseDir}/lib/utils.js`);

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
            if (!ctx.msg.member.permission.has('kickMembers')) {
                ctx.msg.channel.createMessage('You require the **Kick Members** permission to execute this command.').then(() => {
                    reject([new Error('User does not have sufficient permission.')]);
                }).catch(err => reject([err]));
            } else {
                if (!ctx.guildBot.permission.has('kickMembers')) {
                    ctx.msg.channel.createMessage('I do not have the **Kick Members** permission.').then(() => {
                        reject([new Error('Bot does not have sufficient permission.')]);  
                    }).catch(err => reject([err]));
                } else {
                    if (ctx.msg.mentions.length === 0) {
                        ctx.msg.channel.createMessage('Please mention at least one user to kick.').then(() => {
                            reject([new Error('No users mentioned to kick.')]);
                        }).catch(err => reject([err]));
                    } else {
                        var promises = [];
                        for (u of ctx.msg.mentions) {
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
                        Promise.all(promises).then(kicked => ctx.msg.channel.createMessage(`Kicked ${kicked.length === 0 ? 'no one.' : kicked.length + ` ${kicked.length === 1 ? 'user' : 'users'}.`}`).then(() => resolve()).catch(err => reject([err])));
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
                ctx.msg.channel.createMessage('You require the **Ban Members** permission to execute this command.').then(() => {
                    reject([new Error('User does not have sufficient permission.')]);
                }).catch(err => reject([err]));
            } else {
                if (!ctx.guildBot.permission.has('banMembers')) {
                    ctx.msg.channel.createMessage('I do not have the **Ban Members** permission.').then(() => {
                        reject([new Error('Bot does not have sufficient permission.')]);  
                    }).catch(err => reject([err]));
                } else {
                    if (ctx.msg.mentions.length === 0) {
                        ctx.msg.channel.createMessage('Please mention at least one user to ban.').then(() => {
                            reject([new Error('No users mentioned to ban.')]);
                        }).catch(err => reject([err]));
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
                        Promise.all(promises).then(banned => ctx.msg.channel.createMessage(`Banned ${banned.length === 0 ? 'no one.' : banned.length + ` ${banned.length === 1 ? 'user' : 'users'}.`}`).then(() => resolve()).catch(err => reject([err])));
                    }
                }
            }
        });
    }
}
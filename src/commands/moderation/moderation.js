/*
 * Moderation commands
 * Contributed by Capuccino and Ovyerus
 * Core Command Module for owo-whats-this 
 */
exports.commands = [
    "kick",
    "ban",
    "mute"
];

exports.kick = {
        name: "kick",
        desc: `Kick a person in your server (staff only). Needs 'Manage Users' role.`,
        usage: "<User Mention>",
        main: (bot, ctx) => {
            if (ctx.msg.guild) {
                if (ctx.msg.mentions.users.length === 0) {
                    if (ctx.msg.member.hasPermission('KICK_MEMBERS')) {
                        ctx.msg.guild.member(ctx.msg.mentions.users.first()).kick().then(u => {
                            ctx.msg.channel.sendMessage(`Kicked ${u.username}#${u.discriminator}`);
                        }).catch(err => {
                            //handle error
                        });
                    } else {
                        ctx.msg.channel.sendMessage('You requie the **Kick Members** permission to execute this command.');
                    }
                }
            }
        },
        exports.ban = {
            name: "ban",
            desc: `Bans a user from the server. Requires the bot to have the "Administrator" or the "Manage Users" Permission`,
            usage: "<User Mention>",
            main: (bot, ctx) => {
                if (ctx.msg.guild) {
                    if (ctx.msg.mentions.users.length === 0) {
                        if (ctx.msg.member.hasPermission('BAN_MEMBERS')) {
                            ctx.msg.guild.member(ctx.msg.mentions.users.first()).ban().then(u => {
                                ctx.msg.channel.sendMessage(`Banned ${u.username}#${u.discriminator}`);
                            }).catch(err => {
                                //handle error
                            });
                        } else {
                            ctx.msg.channel.sendMessage('You requie the **Ban Members** permission to execute this command.');
                        }
                    }
                }
            }
        }

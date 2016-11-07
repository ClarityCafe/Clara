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
        desc: `Kick a person in your server (staff only). Needs 'Manage Users' role.`
        main: (bot, ctx) => {
            if (msg.mentions.length === 1) {
                if (ctx.msg.author.id.hasPermission('KICK_MEMBERS') === true) {
                    ctx.msg.guild.kick(ctx.msg.mentions[0].id, 7).then(u => {
                        ctx.msg.channel.sendMesage("Kicked " + ctx.msg.mentions[0].id + " .")
                    }).catch(err => {
                        // handle error
                    });
                } else if (ctx.msg.author.id.hasPermission('KICK_MEMBERS') === false) {
                    ctx.msg.channel.sendMessage(ctx.msg.author.id, ", this is a Staff-Only Command!");
                }
            }
        }
/* invite.js - Invite commands
 *
 * Contributed by Ovyerus
 */



exports.commands = [
    'invite'
];

exports.invite = {
    desc: 'Invite me to your server.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            var msg = `**Invite me to your server:** https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot\n`;
            msg += '**Invite to my support server:** https://discord.gg/rmMTZue';
            ctx.msg.channel.createMessage(msg).then(resolve).catch(reject);
        });
    }
}
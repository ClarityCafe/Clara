/* invite.js - Invite commands
 *
 * Contributed by Ovyerus
 */

/* eslint-env node */

exports.commands = [
    'invite'
];

exports.invite = {
    desc: 'Invite me to your server.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let msg = localeManager.t('invite-oauth', ctx.settings.locale, {url: `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot`}) + '\n';
            msg += localeManager.t('invite-server', ctx.settings.locale, {url: 'https://discord.gg/rmMTZue'});

            ctx.msg.channel.createMessage(msg).then(resolve).catch(reject);
        });
    }
};
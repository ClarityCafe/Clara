/**
 * @file Invite commands
 * @author Ovyerus
 */

/* eslint-env node */

exports.commands = [
    'invite'
];

exports.invite = {
    desc: 'Invite me to your server.',
    async main(bot, ctx) {
        let msg = bot.localeManager.t('invite-oauth', ctx.settings.locale, {url: `<https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot>`}) + '\n';
        msg += bot.localeManager.t('invite-server', ctx.settings.locale, {url: 'https://discord.gg/rmMTZue'});

        await ctx.createMessage(msg);
    }
};
/** 
 * @file goodbye.js
 * @description Manage goodbye messages for servers
 * @author Capuccino
 */

exports.commands = [
    'goodbye'
];

function goodbyeBlock(settings) {
    return {
        title: 'Goodbye Message Management',
        description: `**${localeManager.t('goodbyes-enabled', settings.locale)}:** ${settings.guild.greeting.enabled ? localeManager.t('yes', settings.locale) : localeManager.t('no', settings.locale)}\n**${localeManager.t('greetings-channel')}:** ${settings.guild.greeting.channelID ? `<#${settings.guild.greeting.channelID}>` : localeManager.t('none', settings.locale)}\n**${localeManager.t('goodbye-message')}:** ${settings.guild.greeting.message || localeManager.t('none', settings.locale)}`,
        fields: [{
            name: 'Example Usage',
            value: '`goodbye enable`\n'
            + localeManager.t('goodbye-example1', settings.locale)
            + '`goodbye channel general`\n'
            + localeManager.t('goodbye-example2', settings.locale)
            + `goodbye text Goodbye, {{user}}\n`
            + localeManager.t('goodbye-example3', settings.locale)
        }]
    };
}

//this is the only way to simplify the command, the greetings command hasn't been simplified yet

exports.loadAsSubcommands = true;


exports.main = {
    desc: 'Show current settings for goodbye messages, and manage them if you have the correct permissions',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.createMessage({embed: goodbyeBlock}).then(resolve).catch(reject);
        });
    }
};

exports.enable = {
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.member.permission.has('manageGuild')) {
                return ctx.createMessage("you have no permissions to edit this server's settings for this command.");
            } else {
                bot.getGuildSettings(ctx.guild.id).then(res => {
                    let settings = res;
                    settings.goodbyes.enabled = true;
                    return bot.setGuildSettings(res.id, settings);
                }).then(() => {
                    return ctx.createMessage('Goodbye messages are now enabled!');
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.disabled = {
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.member.permission.has('manageGuild')) {
                return ctx.createMessage("you have no permissions to edit this server's settings for this command.");
            } else {
                bot.getGuildSettings(ctx.guild.id).then(res => {
                    let settings = res;
                    settings.goodbyes.enabled = false;
                    return bot.setGuildSettings(res.id, settings);
                }).then(() => {
                    return ctx.createMessage('Goodbye messages are now disabled.');
                }).then(resolve).catch(reject);
            }
        });
    }
};
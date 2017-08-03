/**
 * @file Manage goodbye messages for servers
 * @author Capuccino
 */

exports.loadAsSubcommands = true;

exports.commands = [
    'enable',
    'disable',
    'text',
    'channel'
];

exports.main = {
    desc: 'Manage server goodbyes.',
    permissions: {author: 'manageGuild'},
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.createMessage({embed: goodbyeBlock(ctx.settings)}).then(resolve).catch(reject);
        });
    }
};

exports.enable = {
    desc: 'Enable goodbyes.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.settings.guild.goodbye.enabled = true;

            bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                return ctx.createMessage('goodbye-enable');
            }).then(resolve).catch(reject);
        });
    }
};

exports.disable = {
    desc: 'Disable goodbyes.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.settings.guild.goodbye.enabled = false;

            return bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                return ctx.createMessage('goodbye-disable');
            }).then(resolve).catch(reject);
        });
    }
};

exports.channel = {
    desc: 'Set the channel for goodbyes.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage('goodbye-noChanArgs').then(resolve).catch(reject);
            } else {
                if (ctx.channelMentions.length > 0) {
                    ctx.settings.guild.goodbye.channelID = ctx.channelMentions[0];

                    bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                        return ctx.createMessage('goodbye-setChan', null, 'channel', {
                            id: ctx.settings.guild.goodbye.channelID
                        });
                    }).then(resolve).catch(reject);
                } else {
                    let chans = ctx.guild.channels.filter(c => c.name.toLowerCase().includes(ctx.suffix.toLowerCase()));

                    if (chans.length === 0) {
                        ctx.createMessage('goodbye-noChan', null, 'channel', {
                            name: ctx.suffix
                        }).then(resolve).catch(reject);
                    } else {
                        ctx.settings.guild.goodbye.channelID = chans[0].id;

                        bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                            return ctx.createMessage('goodbye-setChan', null, 'channel', {
                                id: ctx.settings.guild.goodbye.channelID
                            });
                        }).then(resolve).catch(reject);
                    }
                }
            }
        });
    }
};

exports.text = {
    desc: 'Set the goodbye text.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage('goodbye-noMsgArgs').then(resolve).catch(reject);
            } else {
                ctx.settings.guild.goodbye.message = ctx.suffix;

                bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                    return ctx.createMessage('goodbye-setMsg');
                }).then(() => {
                    return ctx.createMessage(ctx.suffix.replace(/{{user}}/gi, utils.formatUsername(ctx.author)).replace(/{{name}}/gi, ctx.author.username));
                }).then(resolve).catch(reject);
            }
        });
    }
};

function goodbyeBlock(settings) {
    return {
        title: 'Goodbye Management',
        description: `**${localeManager.t('enabled', settings.locale)}:** ${settings.guild.goodbye.enabled ? localeManager.t('yes', settings.locale) : localeManager.t('no', settings.locale)}\n`
        + `**${localeManager.t('greetings-channel')}:** ${settings.guild.goodbye.channelID ? `<#${settings.guild.goodbye.channelID}>` : localeManager.t('none', settings.locale)}\n`
        + `**${localeManager.t('greetings-message')}:** ${settings.guild.goodbye.message || localeManager.t('none', settings.locale)}`,
        fields: [{
            name: 'Example Usage',
            value: '`goodbye enable`\n'
            + localeManager.t('goodbye-example1', settings.locale)
            + '`goodbye channel general`\n'
            + localeManager.t('goodbye-example2', settings.locale)
            + '`goodbye text something {{user}}`\n'
            + localeManager.t('goodbye-example3', settings.locale)
        }]
    };
}
/**
 * @file Manage greetings for servers
 * @author Ovyerus
 */

/* eslint-env node */

exports.loadAsSubcommands = true;

exports.commands = [
    'enable',
    'disable',
    'channel',
    'text'
];

exports.main = {
    desc: 'Manage server greetings.',
    permissions: {author: 'manageGuild'},
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.createMessage({embed: greetingBlock(ctx.settings)}).then(resolve).catch(reject);
        });
    }
};

exports.enable = {
    desc: 'Enable greetings.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.settings.guild.greeting.enabled = true;

            bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                return ctx.createMessage('greetings-enable');
            }).then(resolve).catch(reject);
        });
    }
};

exports.disable = {
    desc: 'Disable greetings.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.settings.guild.greeting.enabled = false;

            return bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                return ctx.createMessage('greetings-disable');
            }).then(resolve).catch(reject);
        });
    }
};

exports.channel = {
    desc: 'Set the channel for greetings.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage('greetings-noChanArgs').then(resolve).catch(reject);
            } else {
                if (ctx.channelMentions.length > 0) {
                    ctx.settings.guild.greeting.channelID = ctx.channelMentions[0];

                    bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                        return ctx.createMessage('greetings-setChan', null, 'channel', {
                            id: ctx.settings.guild.greeting.channelID
                        });
                    }).then(resolve).catch(reject);
                } else {
                    let chans = ctx.guild.channels.filter(c => c.name.toLowerCase().includes(ctx.suffix.toLowerCase()));

                    if (chans.length === 0) {
                        ctx.createMessage('greetings-noChan', null, 'channel', {
                            name: ctx.suffix
                        }).then(resolve).catch(reject);
                    } else {
                        ctx.settings.guild.greeting.channelID = chans[0].id;

                        bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                            return ctx.createMessage('greetings-setChan', null, 'channel', {
                                id: ctx.settings.guild.greeting.channelID
                            });
                        }).then(resolve).catch(reject);
                    }
                }
            }
        });
    }
};

exports.text = {
    desc: 'Set the greetings text.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage('greetings-noMsgArgs').then(resolve).catch(reject);
            } else {
                ctx.settings.guild.greeting.message = ctx.suffix;

                bot.setGuildSettings(ctx.guild.id, ctx.settings.guild).then(() => {
                    return ctx.createMessage('greetings-setMsg');
                }).then(() => {
                    return ctx.createMessage(ctx.suffix.replace(/{{user}}/gi, ctx.author.mention).replace(/{{name}}/gi, ctx.author.username));
                }).then(resolve).catch(reject);
            }
        });
    }
};

function greetingBlock(settings) {
    return {
        title: 'Greeting Management',
        description: `**${localeManager.t('enabled', settings.locale)}:** ${settings.guild.greeting.enabled ? localeManager.t('yes', settings.locale) : localeManager.t('no', settings.locale)}\n`
        + `**${localeManager.t('greetings-channel')}:** ${settings.guild.greeting.channelID ? `<#${settings.guild.greeting.channelID}>` : localeManager.t('none', settings.locale)}\n`
        + `**${localeManager.t('greetings-message')}:** ${settings.guild.greeting.message || localeManager.t('none', settings.locale)}`,
        fields: [{
            name: 'Example Usage',
            value: '`greetings enable`\n'
            + localeManager.t('greetings-example1', settings.locale)
            + '`greetings channel general`\n'
            + localeManager.t('greetings-example2', settings.locale)
            + '`greetings text Welcome to our server {{user}}`\n'
            + localeManager.t('greetings-example3', settings.locale)
        }]
    };
}
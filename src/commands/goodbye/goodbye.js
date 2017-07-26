/**
 * @file Manage goodbye messages for servers
 * @author Capuccino
 */

const Eris = require('eris');

exports.loadAsSubcommands = true;

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

exports.disable = {
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

exports.channel = {
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            bot.getGuildSettings(ctx.guild.id).then(res => {
                let settings = res;
                if (ctx.channelMentions.length > 0) {
                    settings.goodbyes.channelID = ctx.channelMentions[0];
                    return bot.setGuildSettings(res.id, settings);
                } else {
                    let nya = ctx.suffix.split(' ');
                    nya.shift();
                    let chans = ctx.guild.channels.filter(c => c.name.toLowerCase().includes(nya.join(' ')));
                    
                    if (chans.length === 0) {
                        return ctx.createMessage('This channel cannot be found.');
                    } else {
                        settings.goodbyes.channelID = chans[0].id;
                        return bot.setGuildSettings(res.id, settings);
                    }
                }
            }).then(res => {
                if (res instanceof Eris.Message) {
                    return null;
                } else {
                    return bot.getGuildSettings(ctx.guild.id);
                }
            }).then(res => {
                if (!res) {
                    return null;
                } else {
                    logger.info(res);
                    return ctx.createMessage(`Successfuly set to send all goodbye messages to ${res.goodbye.channelID}`).then(resolve).catch(reject);
                }
            });
        });
    }
};

exports.text = {
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage({embed: goodbyeBlock(ctx.settings)}).then(resolve).catch(reject);
            } else {
                bot.getGuildSettings(ctx.guild.id).then(res => {
                    let settings = res;
                    let message = ctx.suffix.split(' ');
                    message.shift();
                    message = message.join(' ');

                    settings.goodbyes.message = message;
                    return bot.setGuildSettings(res.id, settings);
                }).then(() => {
                    return ctx.createMessage('Successfully set guild message.').then(resolve).catch(reject);
                });
            }
        });
    }
};





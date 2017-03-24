/*
 * greetings.js - Manage greetings for servers
 * 
 * Contributed by Ovyerus
 */

const Eris = require('eris');

exports.commands = [
    'greetings'
];

exports.greetings = {
    desc: 'Manage server greetings.',
    longDesc: 'Show current greeting settings for the server, and manage them if you have the correct permission.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                ctx.msg.channel.createMessage({embed: greetingBlock(ctx.settings)}).then(resolve).catch(reject);
            } else if (ctx.args[0] === 'enable') {
                if (!ctx.msg.member.permission.has('manageGuild')) {
                    ctx.msg.channel.createMessage(localeManager.t('user-noPerm', ctx.settings.locale, {perm: 'Manage Server'})).then(resolve).catch(reject);
                } else {
                    bot.getGuildSettings(ctx.msg.channel.guild.id).then(res => {
                        let settings = res;
                        settings.greeting.enabled = true;
                        return bot.setGuildSettings(res.id, settings);
                    }).then(() => {
                        return ctx.msg.channel.createMessage(localeManager.t('greetings-enable', ctx.settings.locale));
                    }).then(resolve).catch(reject);
                }
            }  else if (ctx.args[0] === 'disable') {
                if (!ctx.msg.member.permission.has('manageGuild')) {
                    ctx.msg.channel.createMessage(localeManager.t('user-noPerm', ctx.settings.locale, {perm: 'Manage Server'})).then(resolve).catch(reject);
                } else {
                    bot.getGuildSettings(ctx.msg.channel.guild.id).then(res => {
                        let settings = res;
                        settings.greeting.enabled = false;
                        return bot.setGuildSettings(res.id, settings);
                    }).then(() => {
                        return ctx.msg.channel.createMessage(localeManager.t('greetings-disable', ctx.settings.locale));
                    }).then(resolve).catch(reject);
                }
            } else if (ctx.args[0] === 'channel' && ctx.args.length >= 2) {
                if (!ctx.msg.member.permission.has('manageGuild')) {
                    ctx.msg.channel.createMessage(localeManager.t('user-noPerm', ctx.settings.locale, {perm: 'Manage Server'})).then(resolve).catch(reject);
                } else {
                    bot.getGuildSettings(ctx.msg.channel.guild.id).then(res => {
                        let settings = res;

                        if (ctx.msg.channelMentions.length > 0) {
                            settings.greeting.channelID = ctx.msg.channelMentions[0];
                            return bot.setGuildSettings(res.id, settings);
                        } else {
                            let meme = ctx.suffix.split(' ');
                            meme.shift();
                            let chans = ctx.msg.channel.guild.channels.filter(c => c.name.toLowerCase().includes(meme.join(' ')));

                            if (chans.length === 0) {
                                return ctx.msg.channel.createMessage(localeManager.t('greetings-noChan', ctx.settings.locale, {name: meme.join(' ')}));
                            } else {
                                settings.greeting.channelID = chans[0].id;
                                return bot.setGuildSettings(res.id, settings);
                            }
                        }
                    }).then(res => {
                        if (res instanceof Eris.Message) {
                            return null;
                        } else {
                            return bot.getGuildSettings(ctx.msg.channel.guild.id);
                        }
                    }).then(res => {
                        if (!res) {
                            return null;
                        } else {
                            console.log(res);
                            return ctx.msg.channel.createMessage(localeManager.t('greetings-setChan', ctx.settings.locale, {id: res.greeting.channelID}));
                        }
                    }).then(resolve).catch(reject);
                }
            } else if (ctx.args[0] === 'text' && ctx.args.length >= 2) {
                bot.getGuildSettings(ctx.msg.channel.guild.id).then(res => {
                    let settings = res;
                    let message = ctx.suffix.split(' ');
                    message.shift();
                    message = message.join(' ');

                    settings.greeting.message = message;

                    return bot.setGuildSettings(res.id, settings);
                }).then(() => {
                    return ctx.msg.channel.createMessage(localeManager.t('greetings-setMsg', ctx.settings.locale));
                }).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.createMessage({embed: greetingBlock(ctx.settings)}).then(resolve).catch(reject);
            }
        });
    }
};

function greetingBlock(settings) {
    return {
        title: 'Greeting Management',
        description: `**${localeManager.t('greetings-enabled', settings.locale)}:** ${settings.guild.greeting.enabled ? localeManager.t('yes', settings.locale) : localeManager.t('no', settings.locale)}\n**${localeManager.t('greetings-channel')}:** ${settings.guild.greeting.channelID ? `<#${settings.guild.greeting.channelID}>` : localeManager.t('none', settings.locale)}\n**${localeManager.t('greetings-message')}:** ${settings.guild.greeting.message || localeManager.t('none', settings.locale)}`,
        fields: [{
            name: 'Example Usage',
            value: '`greetings enable`\n'
            + localeManager.t('greetings-example1', settings.locale)
            + '`greetings channel general`\n'
            + localeManager.t('greeting-example2', settings.locale)
            + '`greetings text Welcome to our server {{user}}`\n'
            + localeManager.t('greetings-example3', settings.locale)
        }]
    };
}
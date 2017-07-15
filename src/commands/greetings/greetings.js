/**
 * @file Manage greetings for servers
 * @author Ovyerus
 */

/* eslint-env node */

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
                ctx.createMessage({embed: greetingBlock(ctx.settings)}).then(resolve).catch(reject);
            } else if (ctx.args[0] === 'enable') {
                if (!ctx.member.permission.has('manageGuild')) {
                    ctx.createMessage('user-noPerm', null, 'channel', {perm: 'Manage Server'}).then(resolve).catch(reject);
                } else {
                    bot.getGuildSettings(ctx.guild.id).then(res => {
                        let settings = res;
                        settings.greeting.enabled = true;
                        return bot.setGuildSettings(res.id, settings);
                    }).then(() => {
                        return ctx.createMessage('greetings-enable');
                    }).then(resolve).catch(reject);
                }
            }  else if (ctx.args[0] === 'disable') {
                if (!ctx.member.permission.has('manageGuild')) {
                    ctx.createMessage('user-noPerm', null, 'channel', {perm: 'Manage Server'}).then(resolve).catch(reject);
                } else {
                    bot.getGuildSettings(ctx.guild.id).then(res => {
                        let settings = res;
                        settings.greeting.enabled = false;
                        return bot.setGuildSettings(res.id, settings);
                    }).then(() => {
                        return ctx.createMessage('greetings-disable');
                    }).then(resolve).catch(reject);
                }
            } else if (ctx.args[0] === 'channel' && ctx.args.length >= 2) {
                if (!ctx.member.permission.has('manageGuild')) {
                    ctx.createMessage('user-noPerm', null, 'channel', {perm: 'Manage Server'}).then(resolve).catch(reject);
                } else {
                    bot.getGuildSettings(ctx.guild.id).then(res => {
                        let settings = res;

                        if (ctx.channelMentions.length > 0) {
                            settings.greeting.channelID = ctx.channelMentions[0];
                            return bot.setGuildSettings(res.id, settings);
                        } else {
                            let meme = ctx.suffix.split(' ');
                            meme.shift();
                            let chans = ctx.guild.channels.filter(c => c.name.toLowerCase().includes(meme.join(' ')));

                            if (chans.length === 0) {
                                return ctx.createMessage('greetings-noChan', null, 'channel', {name: meme.join(' ')});
                            } else {
                                settings.greeting.channelID = chans[0].id;
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
                            console.log(res);
                            return ctx.createMessage('greetings-setChan', null, 'channel', {id: res.greeting.channelID});
                        }
                    }).then(resolve).catch(reject);
                }
            } else if (ctx.args[0] === 'text' && ctx.args.length >= 2) {
                bot.getGuildSettings(ctx.guild.id).then(res => {
                    let settings = res;
                    let message = ctx.suffix.split(' ');
                    message.shift();
                    message = message.join(' ');

                    settings.greeting.message = message;

                    return bot.setGuildSettings(res.id, settings);
                }).then(() => {
                    return ctx.createMessage('greetings-setMsg');
                }).then(resolve).catch(reject);
            } else {
                ctx.createMessage({embed: greetingBlock(ctx.settings)}).then(resolve).catch(reject);
            }
        });
    }
};

function greetingBlock(settings) {
    return {
        title: 'Greeting Management',
        description: `**${localeManager.t('greetings-enabled', settings.locale)}:** ${settings.guild.greeting.enabled ? localeManager.t('yes', settings.locale) : localeManager.t('no', settings.locale)}\n`
        + `**${localeManager.t('greetings-channel')}:** ${settings.guild.greeting.channelID ? `<#${settings.guild.greeting.channelID}>` : localeManager.t('none', settings.locale)}\n`
        + `**${localeManager.t('greetings-message')}:** ${settings.guild.greeting.message || localeManager.t('none', settings.locale)}`,
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
/**
 * @file Manage goodbye messages for servers
 * @author Capuccino
 * @author Ovyerus
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
        return ctx.createMessage({embed: {
            title: 'Goodbye Management',
            description: `**${bot.localeManager.t('enabled', ctx.settings.locale)}:** ${ctx.settings.guild.goodbye.enabled ? bot.localeManager.t('yes', ctx.settings.locale) : bot.localeManager.t('no', ctx.settings.locale)}\n`
            + `**${bot.localeManager.t('greetings-channel')}:** ${ctx.settings.guild.goodbye.channelID ? `<#${ctx.settings.guild.goodbye.channelID}>` : bot.localeManager.t('none', ctx.settings.locale)}\n`
            + `**${bot.localeManager.t('greetings-message')}:** ${ctx.settings.guild.goodbye.message || bot.localeManager.t('none', ctx.settings.locale)}`,
            fields: [{
                name: 'Example Usage',
                value: '`goodbye enable`\n'
                + bot.localeManager.t('goodbye-example1', ctx.settings.locale)
                + '`goodbye channel general`\n'
                + bot.localeManager.t('goodbye-example2', ctx.settings.locale)
                + '`goodbye text something {{user}}`\n'
                + bot.localeManager.t('goodbye-example3', ctx.settings.locale)
            }]
        }});
    }
};

exports.enable = {
    desc: 'Enable goodbyes.',
    async main(bot, ctx) {
        await bot.db[ctx.guild.id].goodbye.enabled.set(true);
        await ctx.createMessage('goodbye-enable');
    }
};

exports.disable = {
    desc: 'Disable goodbyes.',
    async main(bot, ctx) {
        await bot.db[ctx.guild.id].goodbye.enabled.set(false);
        await ctx.createMessage('goodbye-disable');
    }
};

exports.channel = {
    desc: 'Set the channel for goodbyes.',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('greetings-noChan');

        if (ctx.channelMentions.length > 0) {
            await bot.db[ctx.guild.id].goodbye.channelID.set(ctx.channelMentions[0]);
            return await ctx.createMessage('goodbye-setChan', null, 'channel', {
                id: ctx.settings.guild.goodbye.channelID
            });
        }

        let chans = ctx.guild.channels.filter(c => c.name.toLowerCase().includes(ctx.suffix.toLowerCase()));

        if (chans.length === 0) {
            return await ctx.createMessage('greetings-noChan', null, 'channel', {
                name: ctx.suffix
            });
        }

        await bot.db[ctx.guild.id].goodbye.channelID.set(chans[0].id);
        return await ctx.createMessage('goodbye-setChan', null, 'channel', {
            id: ctx.settings.guild.goodbye.channelID
        });
    }
};

exports.text = {
    desc: 'Set the goodbye text.',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('goodbye-noMsgArgs');

        await bot.db[ctx.guild.id].goodbye.message.set(ctx.suffix);
        await ctx.createMessage('goodbye-setMsg');
        await ctx.createMessage(ctx.suffix.replace(/{{user}}/gi, utils.formatUsername(ctx.author)).replace(/{{name}}/gi, ctx.author.username));
    }
};
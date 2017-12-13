/**
 * @file Manage greetings for servers
 * @author Ovyerus
 */

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
        return ctx.createMessage({embed: {
            title: 'Greeting Management',
            description: `**${bot.localeManager.t('enabled', ctx.settings.locale)}:** ${ctx.settings.guild.greeting.enabled ? bot.localeManager.t('yes', ctx.settings.locale) : bot.localeManager.t('no', ctx.settings.locale)}\n`
            + `**${bot.localeManager.t('greetings-channel')}:** ${ctx.settings.guild.greeting.channelID ? `<#${ctx.settings.guild.greeting.channelID}>` : bot.localeManager.t('none', ctx.settings.locale)}\n`
            + `**${bot.localeManager.t('greetings-message')}:** ${ctx.settings.guild.greeting.message || bot.localeManager.t('none', ctx.settings.locale)}`,
            fields: [{
                name: 'Example Usage',
                value: '`greetings enable`\n'
                + bot.localeManager.t('greetings-example1', ctx.settings.locale)
                + '`greetings channel general`\n'
                + bot.localeManager.t('greetings-example2', ctx.settings.locale)
                + '`greetings text Welcome to our server {{user}}`\n'
                + bot.localeManager.t('greetings-example3', ctx.settings.locale)
            }]
        }});
    }
};

exports.enable = {
    desc: 'Enable greetings.',
    async main(bot, ctx) {
        await bot.db[ctx.guild.id].greeting.enabled.set(true);
        await ctx.createMessage('greetings-enable');
    }
};

exports.disable = {
    desc: 'Disable greetings.',
    async main(bot, ctx) {
        await bot.db[ctx.guild.id].greeting.enabled.set(false);
        return ctx.createMessage('greetings-disable');
    }
};

exports.channel = {
    desc: 'Set the channel for greetings.',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('greetings-noChanArgs');

        if (ctx.channelMentions.length > 0) {
            await bot.db[ctx.guild.id].greeting.channelID.set(ctx.channelMentions[0]);
            return await ctx.createMessage('greetings-setChan', null, 'channel', {
                id: ctx.settings.guild.greeting.channelID
            });
        }

        let chan = await bot.lookups.textChannelLookup(ctx, ctx.suffix, false);

        if (!chan) {
            return await ctx.createMessage('greetings-noChan', null, 'channel', {
                name: ctx.suffix
            });
        }

        await bot.db[ctx.guild.id].greeting.channelID.set(chan.id);
        await ctx.createMessage('greetings-setChan', null, 'channel', {
            id: chan.id
        });
    }
};

exports.text = {
    desc: 'Set the greetings text.',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('greetings-noMsgArgs');

        await bot.db[ctx.guild.id].greeting.message.set(ctx.suffix);
        await ctx.createMessage('greetings-setMsg');
        await ctx.createMessage(ctx.suffix.replace(/{{user}}/gi, ctx.author.mention).replace(/{{name}}/gi, ctx.author.username));
    }
};
/**
 * @file Marry your imaginary waifu or someone
 * @author Capuccino
 * @author Ovyerus
 * 
 * @todo Persistent marriages
 */

exports.commands = [
    'marry',
    'divorce'
];

exports.marry = {
    desc: 'Marry someone.',
    usage: '<mention>',
    async main(bot, ctx) {
        if (ctx.args.length === 0 || ctx.mentionStrings.length === 0) return await ctx.createMessage('marry-noPartner');
        if (ctx.mentionStrings[0] === ctx.author.id) return await ctx.createMessage('marry-noSelfcest');
        if (ctx.mentionStrings.length > 1) return await ctx.createMessage('marry-tooManyMentions');
        if (ctx.mentionStrings[0] === bot.user.id) return await ctx.createMessage('marry-botMentioned');

        await ctx.createMessage('marry-partnerPrompt', null, 'channel', {
            author: ctx.author.mention,
            mentioned: `<@${ctx.mentionStrings[0]}>`
        });

        let msg;

        try {
            msg = await bot.awaitMessage(ctx.channel.id, ctx.mentionStrings[0], () => true, 30000);
        } catch(err) {
            return await ctx.createMessage('marry-timeout', null, 'channel', {
                author: ctx.author.mention
            });
        }
            
        if (/^y(es)?$/i.test(msg.content)) {
            await ctx.createMessage('marry-marriageSuccess', null, 'channel', {
                author: ctx.author.mention,
                mentioned: `<@${ctx.mentionStrings[0]}>`
            });
        } else if (/^no?$/i.test(msg.content)) {
            await ctx.createMessage('marry-marriageFail', null, 'channel', {
                author: ctx.author.mention
            });
        } else {
            await ctx.createMessage('marry-invalidAnswer', null, 'channel', {
                mentioned: `<@${ctx.mentionStrings[0]}>`
            });
        }
    }
};

exports.divorce = {
    desc: 'Divorce your partner.',
    usage: '<mention>',
    async main(bot, ctx) {
        if (ctx.args.length === 0 || ctx.mentionStrings.length === 0) return await ctx.createMessage('marry-noPartner');
        if (ctx.mentionStrings[0] === ctx.author.id) return await ctx.createMessage('divorce-noSelfcest');

        await ctx.createMessage('divorce-partnerPrompt', null, 'channel', {
            author: ctx.author.mention,
            mentioned: `<@${ctx.mentionStrings[0]}>`
        });

        let msg;

        try {
            msg = await bot.awaitMessage(ctx.channel.id, ctx.mentionStrings[0], () => true, 30000);
        } catch(err) {
            return await ctx.createMessage('marry-timeout', null, 'channel', {
                author: ctx.author.mention
            });
        }

        if (/^y(es)?$/i.test(msg.content)) {
            await ctx.createMessage('divorce-divorceSuccess', null, 'channel', {
                author: ctx.author.mention,
                mentioned: `<@${ctx.mentionStrings[0]}>`
            });
        } else if (/^no?$/i.test(msg.content)) {
            await ctx.createMessage('divorce-divorceFail', null, 'channel', {
                author: ctx.author.mention
            });
        } else {
            await ctx.createMessage('marry-invalidAnswer', null, 'channel', {
                mentioned: `<@${ctx.mentionStrings[0]}>`
            });
        }
    }
};
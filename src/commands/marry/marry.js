/*
 * marry.js - Marry your imaginary waifu or someone
 * 
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

exports.commands = [
    'marry',
    'divorce'
];

exports.marry = {
    desc: 'Marry someone.',
    usage: '<mention>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0 || ctx.mentionStrings.length === 0) {
                ctx.createMessage(localeManager.t('marry-noPartner', ctx.settings.locale)).then(resolve).catch(reject);
            } else if (ctx.mentionStrings[0] === ctx.author.id) {
                ctx.createMessage(localeManager.t('marry-noSelfCest', ctx.settings.locale)).then(resolve).catch(reject);
            } else if (ctx.mentionStrings.length > 1) {
                ctx.createMessage(localeManager.t('marry-tooManyMentions', ctx.settings.locale));
            } else if (ctx.mentionStrings[0] === bot.user.id) {
                ctx.createMessage(localeManager.t('marry-botMentioned', ctx.settings.locale));
            } else {
                ctx.createMessage(localeManager.t('marry-PartnerPrompt', ctx.settings.locale, {author: ctx.author.mention, mentioned: `<@${ctx.mentionStrings[0]}>`})).then(() => {
                    return bot.awaitMessage(ctx.channel.id, ctx.mentionStrings[0], () => true, 30000);
                }).then(m => {
                    if (/y(es)?/i.test(m.content)) {
                        return ctx.createMessage(localeManager.t('marry-successfulMarriage', ctx.settings.locale, {author: ctx.author.mention, mentioned: `<@${ctx.mentionStrings[0]}>`}));
                    } else if (/no?/i.test(m.content)) {
                        return ctx.createMessage(localeManager.t('marry-marriageDeclined', ctx.settings.locale, {author: ctx.author.mention}));
                    } else {
                        return ctx.createMessage(localeManager.t('marry-invalidAnswer', ctx.settings.locale, {mentioned: `<@${ctx.mentionStrings[0]}>`}));
                    }
                }).then(resolve).catch(err => {
                    if (err.message && err.message === 'Message await expired.') {
                        return ctx.createMessage(localeManager.t('marry-timeout', ctx.settings.locale, {author: ctx.author.mention}));
                    } else {
                        reject(err);
                    }
                }).then(resolve);
            }
        });
    }
};

exports.divorce = {
    desc: 'Divorce your partner.',
    usage: '<mention>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0 || ctx.mentionStrings.length === 0) {
                ctx.createMessage('Please mention your partner.').then(resolve).catch(reject);
            } else if (ctx.mentionStrings[0] === ctx.author.id) {
                ctx.createMessage("Hey! You can't divorce yourself.").then(resolve).catch(reject);
            } else {
                ctx.createMessage(`<@${ctx.mentionStrings[0]}>, will you let go of ${ctx.author.mention}?\nRespond with yes or no. (30 seconds)`).then(() => {
                    return bot.awaitMessage(ctx.channel.id, ctx.mentionStrings[0], () => true, 30000);
                }).then(m => {
                    if (/y(es)?/i.test(m.content)) {
                        return ctx.createMessage(`${ctx.author.mention} you're no longer married to <@${ctx.mentionStrings[0]}>.`);
                    } else if (/no?/i.test(m.content)) {
                        return ctx.createMessage(`${ctx.author.mention}, your partner won't let go.`);
                    } else {
                        return ctx.createMessage(`<@${ctx.mentionStrings[0]}> that is not a valid answer.`);
                    }
                }).then(resolve).catch(err => {
                    if (err.message && err.message === 'Message await expired.') {
                        return ctx.createMessage(`${ctx.author.mention} your partner did not respond in time.`);
                    } else {
                        reject(err);
                    }
                }).then(resolve);
            }
        });
    }
};
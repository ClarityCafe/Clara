/**
 * @file Marry your imaginary waifu or someone
 * @author Capuccino
 * @author Ovyerus
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
                ctx.createMessage('marry-noPartner').then(resolve).catch(reject);
            } else if (ctx.mentionStrings[0] === ctx.author.id) {
                ctx.createMessage('marry-noSelfcest').then(resolve).catch(reject);
            } else if (ctx.mentionStrings.length > 1) {
                ctx.createMessage('marry-tooManyMentions');
            } else if (ctx.mentionStrings[0] === bot.user.id) {
                ctx.createMessage('marry-botMentioned');
            } else {
                ctx.createMessage('marry-partnerPrompt', null, 'channel', {
                    author: ctx.author.mention,
                    mentioned: `<@${ctx.mentionStrings[0]}>`
                }).then(() => {
                    return bot.awaitMessage(ctx.channel.id, ctx.mentionStrings[0], () => true, 30000);
                }).then(m => {
                    if (/^y(es)?$/i.test(m.content)) {
                        return ctx.createMessage('marry-marriageSuccess', null, 'channel', {
                            author: ctx.author.mention,
                            mentioned: `<@${ctx.mentionStrings[0]}>`
                        });
                    } else if (/^no?$/i.test(m.content)) {
                        return ctx.createMessage('marry-marriageFail', null, 'channel', {
                            author: ctx.author.mention
                        });
                    } else {
                        return ctx.createMessage('marry-invalidAnswer', null, 'channel', {
                            mentioned: `<@${ctx.mentionStrings[0]}>`
                        });
                    }
                }).then(resolve).catch(err => {
                    if (err.message && err.message === 'Message await expired.') {
                        return ctx.createMessage('marry-timeout', null, 'channel', {
                            author: ctx.author.mention
                        });
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
                ctx.createMessage('marry-noPartner').then(resolve).catch(reject);
            } else if (ctx.mentionStrings[0] === ctx.author.id) {
                ctx.createMessage('divorce-noSelfcest').then(resolve).catch(reject);
            } else {
                ctx.createMessage('divorce-partnerPrompt', null, 'channel', {
                    author: ctx.author.mention,
                    mentioned: `<@${ctx.mentionStrings[0]}>`
                }).then(() => {
                    return bot.awaitMessage(ctx.channel.id, ctx.mentionStrings[0], () => true, 30000);
                }).then(m => {
                    if (/^y(es)?$/i.test(m.content)) {
                        return ctx.createMessage('divorce-divorceSuccess', null, 'channel', {
                            author: ctx.author.mention,
                            mentioned: `<@${ctx.mentionStrings[0]}>`
                        });
                    } else if (/^no?$/i.test(m.content)) {
                        return ctx.createMessage('divorce-divorceFail', null, 'channel', {
                            author: ctx.author.mention
                        });
                    } else {
                        return ctx.createMessage('marry-invalidAnswer', null, 'channel', {
                            mentioned: `<@${ctx.mentionStrings[0]}>`
                        });
                    }
                }).then(resolve).catch(err => {
                    if (err.message && err.message === 'Message await expired.') {
                        return ctx.createMessage('marry-timeout', null, 'channel', {
                            author: ctx.author.mention
                        });
                    } else {
                        reject(err);
                    }
                }).then(resolve);
            }
        });
    }
};
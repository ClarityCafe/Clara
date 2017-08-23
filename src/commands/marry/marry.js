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
                ctx.createMessage('Please mention your partner.').then(resolve).catch(reject);
            } else if (ctx.mentionStrings[0] === ctx.author.id) {
                ctx.createMessage("Hey! You're not allowed to marry yourself.").then(resolve).catch(reject);
            } else if (ctx.mentionStrings.length > 1) {
                ctx.createMessage('One wife only!');
            } else if (ctx.mentionStrings[0] === bot.user.id) {
                ctx.createMessage("I-It's not like I'll say yes or anything >.<");
            } else {
                ctx.createMessage(`<@${ctx.mentionStrings[0]}> will you marry ${ctx.author.mention}?\nRespond with yes or no. (30 seconds)`).then(() => {
                    return bot.awaitMessage(ctx.channel.id, ctx.mentionStrings[0], () => true, 30000);
                }).then(m => {
                    if (/^y(es)?$/i.test(m.content)) {
                        return ctx.createMessage(`I hereby pronounce <@${ctx.mentionStrings[0]}> and ${ctx.author.mention} as husband and wife. :sparkling_heart:`);
                    } else if (/^no?$/i.test(m.content)) {
                        return ctx.createMessage(`${ctx.author.mention}, unfortunately, your partner declined.`);
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
                    if (/^y(es)?$/i.test(m.content)) {
                        return ctx.createMessage(`${ctx.author.mention} you're no longer married to <@${ctx.mentionStrings[0]}>.`);
                    } else if (/^no?$/i.test(m.content)) {
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
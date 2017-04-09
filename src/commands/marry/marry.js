/*
 * marry.js - Marry your imaginary waifu or someone
 * 
 *  Contributed by Capuccino
 */

/* eslint-env node */

exports.commands = [
    'marry',
    'divorce'
];

exports.marry = {
    desc: 'Marry Someone',
    longDesc: 'Marry your waifu in the guild.',
    usage: '<Mention>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage('Mention or cite your partner\'s name.');
            } else if (ctx.mentions[0].id === ctx.author.id) {
                ctx.createMessage('Hey! You\'re not allowed to marry yourself.');
            } else {
                ctx.createMessage(`${ctx.mentions[0].mention}, Will you marry ${ctx.author.mention}? (yes/no) (You have 30 seconds to respond).`).then(() => {
                    bot.awaitMessage(ctx.channel.id, ctx.mentions[0].id, () => true, 30000).then(m => {
                        if (/y(es)?/i.test(m.content)) {
                            return ctx.createMessage(`I hereby Pronounce ${ctx.mentions[0].mention} and ${ctx.author.mention} as husband and wife! :two_hearts:`);
                        } else if (/no?/i.test(m.content)) {
                            return ctx.createMessage(`I'm sorry ${ctx.author.mention}, but your partner declined.`);
                        }
                    }).catch(() => {
                        ctx.createMessage('Your partner didn\'t respond in time.');
                    });
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.divorce = {
    desc: 'Divorce your waifu',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage('We need to find out the partner you are trying to divorce first. Mention him/her.');
            } else if (ctx.mentions[0].id === ctx.author.id) {
                ctx.createMessage('Wew lad.');
            } else {
                ctx.createMessage(`${ctx.mentions[0].mention}, will you let go of ${ctx.author.mention}?\n You have 30 seconds to respond yes or no.`).then(() => {
                    bot.awaitMessage(ctx.channel.id, ctx.mentions[0].id, () => true, 30000).then(m => {
                        if (/y(es)?/i.test(m.content)) {
                            return ctx.createMessage(`${ctx.msg.author}, you're no longer married to ${ctx.mentions[0].mention}`);
                        } else if (/no?/i.test(m.content)) {
                            return ctx.createMessage('Your partner decided not to let go of you. I can\'t seperate you.');
                        }
                    }).catch(() => {
                        ctx.createMessage('Your partner didn\'t respond in time.')''
                    });
                }).then(resolve).catch(reject);
            }
        });
    }
}
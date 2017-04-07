/*
 * marry.js - Marry your imaginary waifu or someone
 * 
 *  Contributed by Capuccino
 */

/* eslint-env node */

exports.commands = [
    'marry'
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
                ctx.createMessage(`${ctx.mentions[0]}, Will you marry ${ctx.author}? (yes/no) (You have 30 seconds to respond).`).then(() => {
                    bot.awaitMessage(ctx.channel.id, ctx.mentions[0].id, 30000).then(m => {
                        if (/y(es)?/i.test(m.content)) {
                            return m.createMessage(`${ctx.author}, congrats! You are now married to ${ctx.mention[0]}!`);
                        } else if (/no?/i.test(m.content)) {
                            return m.createMessage(`I'm sorry ${ctx.author}, but your partner declined.`);
                        }
                    }).catch(() => {
                        ctx.createMessage('Your partner didn\'t respond in time.');
                    });
                }).then(resolve).catch(reject);
            }
        });
    }
};
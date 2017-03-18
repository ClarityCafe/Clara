/*
 * nadeko.js - Emulates the (old) broken echo command from Nadeko
 * 
 * Contributed by Capuccino.
 */

const emotes = [
    ':joy:',
    ':unamused:'
];

exports.commands = [
    'nadeko'
];

exports.nadeko = {
    desc: 'who did it?',
    longDesc: 'owo whats this?',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage(localeManager.t('nadeko', settings.locale, {user: ctx.msg.author.mention, emote: emotes[Math.floor(Math.random() * emotes.length)]})).then(resolve).catch(reject);
        });
    }
};
/**
 * @file Emulates the (old) broken echo command from Nadeko.
 * @author Capuccino.
 */

/* eslint-env node */

const emotes = [
    ':joy:',
    ':unamused:'
];

exports.commands = [
    'e'
];

exports.e = {
    desc: 'who did it?',
    longDesc: 'owo whats this?',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.createMessage('nadeko', null, 'channel', {
                user: ctx.author.mention,
                emote: emotes[Math.floor(Math.random() * emotes.length)]
            }).then(resolve).catch(reject);
        });
    }
};
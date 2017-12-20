/**
 * @file Emulates the (old) broken echo command from Nadeko.
 * @author Capuccino.
 */

const emotes = [
    ':joy:',
    ':unamused:'
];

exports.commands = [
    'e'
];

exports.e = {
    desc: 'Who did it?',
    main(bot, ctx) {
        return ctx.createMessage('nadeko', null, 'channel', {
            user: ctx.author.mention,
            emote: emotes[Math.floor(Math.random() * emotes.length)]
        });
    }
};
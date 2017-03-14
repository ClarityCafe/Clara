// * A Kinky Nadeko Command to piss off Kwoth
// *
// *
// * Contributed by Capuccino (because ovy is not home)

exports.commands = [
    'nadeko'
];

const emotes = [
    ':joy:',
    ':unamused:'
];

exports.nadeko = {
    desc: 'who did it?',
    longDesc: 'owo whats this?',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {           
            ctx.msg.channel.createMessage(localeManager.t('nadeko', settings.locale, {user: ctx.msg.author.mention, emote: emotes[Math.floor(Math.random() * emotes.length)]})).then(resolve).catch(reject);
        });
    }
};
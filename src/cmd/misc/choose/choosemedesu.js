/**
 * @file Make the bot choose your stupid life decisions.
 * @author Capuccino
 * @author Ovyerus
 */

/* eslint-env node */

exports.commands = [
    'choose'
];

exports.choose = {
    desc: 'Randomly chooses between 2 or more arguments.',
    usage: '<choice 1>/<choice 2>/...',
    example: 'coke zero/coke',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let choices = ctx.suffix.split('/');
            if (choices.length < 2) {
                ctx.createMessage('choose-insufficientArgs').then(resolve).catch(reject);
            } else {
                var choice = choices[Math.floor(Math.random() * choices.length)];
                ctx.createMessage('choose', null, 'channel', {name: ctx.msg.author.username, choice}).then(resolve).catch(reject);
            }
        });
    }
};
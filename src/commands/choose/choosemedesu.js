/*
 * choose.js - Make the bot choose your stupid life decisions.
 *
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

exports.commands = [
    'choose'
];

exports.choose = {
    desc: 'Randomly chooses between 2 or more arguments.',
    usage: '<choice 1>/<choice 2>/...',
    example: 'coke zero/coke',
    main(ctx) {
        return new Promise((resolve, reject) => {
            let choices = ctx.args.split('/');
            if (choices.length < 2) {
                ctx.createMessage('choose-insufficientArgs').then(resolve).catch(reject);
            } else {
                var choice = choices[Math.floor(Math.random() * choices.length)];
                ctx.createMessage(localeManager.t('choose', ctx.settings.locale, {name: ctx.author.username, choice})).then(resolve).catch(reject);
            }
        });
    }
};
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
    desc: "Randomly chooses between 2 or more arguments.",
    fullDesc: 'Uses a randomiser to pick a random value out of two given arguments.',
    usage: '<choice1> <choice2>',
    example: '"coke zero" coke',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.args < 2) {
                ctx.createMessage(localeManager.t('choose-insufficientArgs', ctx.settings.locale));
            } else {
                let choice = ctx.args[Math.floor(Math.random() * ctx.args.length)];
                ctx.createMessage(localeManager.t('choose', ctx.settings.locale, {name: ctx.author.mention, choice})).then(resolve).catch(reject);
            }
        });
    }
};
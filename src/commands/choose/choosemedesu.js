/*
 * choose.js - Make the bot choose your stupid life decisions.
 *
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node*/

exports.commands = [
    'choose'
];

exports.choose = {
    desc: "Randomly chooses between 2 or more arguments seperated with a '/'.",
    fullDesc: 'Uses a randomiser to pick a random value out of two given arguments. Arguments must be seperated by "or" ',
    usage: '<choice1> or <choice2>',
    example: 'coke zero or coke',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.args < 2) {
                ctx.msg.channel.createMessage(localeManager.t('choose-insufficientArgs', ctx.settings.locale));
            } else if (ctx.args > 2) {
                ctx.msg.channel.createMessage(localeManager.t('choose-exceededLimit', ctx.settings.locale));
            } else {
                /*
                * We should only pars String ID 0 and 1, kinda like this
                * [x or y]
                *  ^    ^
                * "or" is only there for naturalization
                */
                let choices = [ctx.args[0], ctx.args[2]];
                let choice = choices[Math.floor(Math.random()* choices.length)];
                ctx.msg.channel.createMessage(localeManager.t('choose', ctx.settings.locale, {name: ctx.msg.author.mention, choice})).then(resolve).catch(reject);
            }
        });
    }
};
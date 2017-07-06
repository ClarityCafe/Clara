/*
 * ball.js - 8ball-like RNG.
 * 
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

const responses = ['yes', 'no'];

exports.commands = [
    'ball'
];

exports.init = () => {
    let filterKeys = Object.keys(localeManager.locales['en-UK']).filter(k => /^ball-response\d+$/.test(k));
    for (let key of filterKeys) responses.push(key);
};

exports.ball = {
    desc: 'Make the bot decide for you or do some things.',
    longDesc: 'Uses a random number generator to select a random response. Not 100% reliable.',
    usage: '<question>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix || !/(?:\?|\uff1f)$/.test(ctx.suffix)) {
                ctx.createMessage(localeManager.t('ball-noQuestion', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                let response = localeManager.t(responses[Math.floor(Math.random() * responses.length)], ctx.settings.locale);
                ctx.createMessage(response).then(resolve).catch(reject);
            }
        });
    }
};
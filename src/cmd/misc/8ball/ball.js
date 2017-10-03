/**
 * @file 8ball-like RNG.
 * @author Capuccino
 * @author Ovyerus
 */

/* eslint-env node */

const responses = ['yes', 'no'];

exports.commands = [
    'ball'
];

exports.init = bot => {
    let filterKeys = Object.keys(bot.localeManager.locales['en-UK']).filter(k => /^ball-response\d+$/.test(k));
    for (let key of filterKeys) responses.push(key);
};

exports.ball = {
    desc: 'Make the bot decide for you or do some things.',
    longDesc: 'Uses a random number generator to select a random response. Not 100% reliable.',
    usage: '<question>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix || !/(?:\?|\uff1f)$/.test(ctx.suffix)) {
                ctx.createMessage('ball-noQuestion').then(resolve).catch(reject);
            } else {
                let response = responses[Math.floor(Math.random() * responses.length)];
                ctx.createMessage(response).then(resolve).catch(reject);
            }
        });
    }
};
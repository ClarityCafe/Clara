/*
 * f.js - Pay respects.
 *
 * Contributed by Capuccino and Ovyerus.
 */

const utils = require(`${__baseDir}/modules/utils.js`);

exports.commands = [
    'f',
    'rip'
];

exports.f = {
    desc: 'Pay respects.',
    fullDesc: 'Pay your respects. You can also optionally pay your respects to a specific thing.',
    usage: '[object for respects]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.cleanSuffix) {
                ctx.msg.channel.createMessage(localeManager.t('respects-args', ctx.settings.locale, {user: utils.formatUsername(ctx.msg.member, true), object: ctx.cleanSuffix})).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.createMessage(localeManager.t('respects', ctx.settings.locale, {user: utils.formatUsername(ctx.msg.member, true)})).then(resolve).catch(reject);
            }
        });
    }
};

exports.rip = {
    desc: 'Rest in pieces.',
    fullDesc: 'Lets something rest in peace.',
    usage: '[thing]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.cleanSuffix) {
                let url = encodeURI(`https://ripme.xyz/#${ctx.cleanSuffix}`);
                ctx.msg.channel.createMessage(localeManager.t('rip-args', ctx.settings.locale, {url})).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.createMessage(localeManager.t('rip', ctx.settings.locale)).then(resolve).catch(reject);
            }
        });
    }
};
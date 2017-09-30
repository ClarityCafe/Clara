/**
 * @file Pay respects.
 * @author Capuccino 
 * @author Ovyerus
 */

/* eslint-env node */

exports.commands = [
    'f',
    'rip'
];

exports.f = {
    desc: 'Pay respects.',
    usage: '[object for respects]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix) {
                ctx.createMessage('respects-args', null, 'channel', {
                    user: utils.formatUsername(ctx.member, true),
                    object: ctx.suffix
                }).then(resolve).catch(reject);
            } else {
                ctx.createMessage('respects', null, 'channel', {
                    user: utils.formatUsername(ctx.member, true)
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.rip = {
    desc: 'Rest in pieces.',
    usage: '[thing]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix) {
                let url = encodeURI(`https://ripme.xyz/#${ctx.suffix}`);
                ctx.createMessage('rip-args', null, 'channel', {url}).then(resolve).catch(reject);
            } else {
                ctx.createMessage('rip').then(resolve).catch(reject);
            }
        });
    }
};
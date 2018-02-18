/**
 * @file Pay respects.
 * @author Capuccino 
 * @author Ovyerus
 */

exports.commands = [
    'f',
    'rip'
];

exports.f = {
    desc: 'Pay respects.',
    usage: '[thing]',
    async main(bot, ctx) {
        if (ctx.suffix) {
            await ctx.createMessage('respects-args', null, 'channel', {
                user: utils.formatUsername(ctx.member, true),
                object: ctx.suffix
            });
        } else {
            await ctx.createMessage('respects', null, 'channel', {
                user: utils.formatUsername(ctx.member, true)
            });
        }
    }
};

exports.rip = {
    desc: 'Rest in pieces.',
    usage: '[thing]',
    async main(bot, ctx) {
        if (ctx.suffix) {
            let url = encodeURI(`https://ripme.xyz/#${ctx.suffix}`);

            await ctx.createMessage('rip-args', null, 'channel', {url});
        } else await ctx.createMessage('rip');
    }
};
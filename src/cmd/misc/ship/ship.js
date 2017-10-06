/**
 * @file Ship people.
 * @author Capuccino
 */

/* eslint-env node */

exports.commands = [
    'ship'
];

exports.ship = {
    desc: 'Ship people.',
    usage: '<2 names or mentions>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.mentions.length > 2 || ctx.args.length > 2) {
                ctx.createMessage('ship-noArgs').then(resolve).catch(reject);
            } else {
                let a = !ctx.mentions[0] ? ctx.args[0] : ctx.mentions[0].username;
                let b = !ctx.mentions[1] ? ctx.args[1] : ctx.mentions[1].username;
                let result = a.substring(0, Math.floor(a.length / 2)) + b.substring(Math.floor(b.length / 2));

                ctx.createMessage('ship', null, 'channel', {result}).then(resolve).catch(reject);
            }
        });
    }
};
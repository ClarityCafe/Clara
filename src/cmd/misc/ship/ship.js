/**
 * @file Ship people.
 * @author Capuccino
 * @author Ovyerus
 */

exports.commands = [
    'ship'
];

exports.ship = {
    desc: 'Ship people.',
    usage: '<2 names or mentions>',
    async main(bot, ctx) {
        if (ctx.mentions.length > 2 || ctx.args.length > 2) return await ctx.createMessage('ship-noArgs');

        let a = !ctx.mentions[0] ? ctx.args[0] : ctx.mentions[0].username;
        let b = !ctx.mentions[1] ? ctx.args[1] : ctx.mentions[1].username;
        let result = a.substring(0, Math.floor(a.length / 2)) + b.substring(Math.floor(b.length / 2));

        return ctx.createMessage('ship', null, 'channel', {result});
    }
};
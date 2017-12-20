/**
 * @file Calulate stuff in Discord.
 * @author Ovyerus
 */

const math = require('mathjs');

exports.commands = [
    'calc'
];

exports.calc = {
    desc: 'Calculate math stuff.',
    usage: '<maths equation>',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('Please give me something to calculate.');

        await ctx.createMessage(math.eval(ctx.suffix));
    }
};
/**
 * @file leetspeak generator nya
 * @author Capuccino
 */

const leet = require('l33tsp34k');

exports.commands = [
    'leet'
];

exports.leet = {
    desc: 'L33tify your message',
    usage: '<message>',
    async main(bot, ctx) {
        if (!ctx.suffix) await ctx.createMessage('Provide me a message to l33tify');
        else await ctx.createMessage(leet(ctx.suffix));
    }
};
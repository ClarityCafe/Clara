/**
 * @file Make the bot choose your stupid life decisions.
 * @author Capuccino
 * @author Ovyerus
 */

exports.commands = [
    'choose'
];

exports.choose = {
    desc: 'Randomly chooses between 2 or more arguments.',
    usage: '<choice 1>/<choice 2>/[choice .../choice N]',
    example: 'coke zero/coke',
    async main(bot, ctx) {
        let choices = ctx.suffix.split(' or ');

        if (choices.length < 2) return await ctx.createMessage('choose-insufficientArgs');

        let choice = choices[Math.floor(Math.random() * choices.length)];

        await ctx.createMessage('choose', null, 'channel', {name: ctx.author.username, choice});
    }
};
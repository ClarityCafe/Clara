/**
 * @file a fucking useless command to rate your stupid and worthless decisions
 * @author Monika
 */
exports.commands = ['rate'];

exports.rate = {
    desc: 'Let the bot rate something',
    async main(bot, ctx) {
        if (!ctx.suffix) {
            await ctx.createMessage('Give me something I can rate. Not your face.');
        }
        else {
            let rater = Math.random() * 10;
            await ctx.createMessage(`I rate ${ctx.suffix} a ${rater.toFixed(1)}/10.`);
        }
    }
};
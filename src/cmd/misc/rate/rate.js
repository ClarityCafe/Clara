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
        } else {
            let seed = [].map.call(ctx.suffix, x => x.charCodeAt()).concat(Number(ctx.author.id)).reduce((m, v) => m + v);
            let seeded = utils.LCG(seed);
            let rating = seeded() * 10;

            await ctx.createMessage(`I rate ${ctx.suffix} a ${rating.toFixed(1)}/10.`);
        }
    }
};
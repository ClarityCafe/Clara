/**
 * @file 8ball-like RNG.
 * @author Capuccino
 * @author Ovyerus
 */

const RESPONSES = ['yes', 'no'];
const QUESTION_REGEX = /^(?:is|are|does|do|will|was|has|what|which|whose|who|where|how|when|why)|(?:\?|\uff1f)$/i;

exports.commands = ['ball'];

exports.init = bot => {
    let filterKeys = Object.keys(bot.localeManager.locales['en-UK']).filter(k => /^ball-response\d+$/.test(k));
    for (let key of filterKeys) RESPONSES.push(key);
};

exports.ball = {
    desc: 'Make the bot decide for you or do some things.',
    usage: '<question>?',
    async main(bot, ctx) {
        if (!ctx.suffix || !QUESTION_REGEX.test(ctx.suffix)) return await ctx.createMessage('ball-noQuestion');

        await ctx.createMessage(RESPONSES[Math.floor(Math.random() * RESPONSES.length)]);
    }
};
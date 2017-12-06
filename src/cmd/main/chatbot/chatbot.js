/**
 * @file Markov chain chatbot.
 * 
 * @author Ovyerus
 */

const Markov = require('markov-strings');
const fs = require('fs');

exports.commands = ['chat'];

try {
    require.resolve(`${__dirname}/lines.txt`);
} catch(err) {
    logger.info('Markov file not found. Generating pre-seeded one.');
    fs.writeFileSync(`${__dirname}/lines.txt`, fs.readFileSync(`${__dirname}/sample.txt`.toString()));
}

exports.chat = {
    desc: 'Talk to the bot. Can be really dumb.',
    usage: '<message>',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('chatbot-noArgs');
        if (/^how (dumb|smart) are you/i.test(ctx.suffix)) {
            let lines = await readLines();
            return await ctx.createMessage('chatbot-knowledge', null, 'channel', {
                amt: lines.length
            });
        }

        await ctx.channel.sendTyping();

        let lines = await readLines();
        let chat = new Markov(lines, {stateSize: 3});

        await chat.buildCorpus();
        await appendLine(ctx.cleanSuffix);

        let res = await chat.generateSentence();

        await ctx.createMessage(res.string);
    }
};

function readLines() {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/lines.txt`, (err, data) => err ? reject(err) : resolve(data.toString().split('\n')));
    });
}

function appendLine(msg) {
    return new Promise((resolve, reject) => {
        fs.appendFile(`${__dirname}/lines.txt`, msg.replace('\n+', ' ').trim() + '\n', err => err ? reject(err) : resolve());
    });
}
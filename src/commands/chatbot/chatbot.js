/*
 * chatbot.js - Chatbot made using markov chains.
 * 
 * Contributed by Ovyerus
 */

const Markov = require('markov-strings');
const fs = require('fs');

try {
    require.resolve(`${__dirname}/lines.txt`);
} catch(err) {
    logger.custom('blue', 'commands/chatbot', 'Markov line file not found. Generating pre-seeded one.');
    fs.writeFileSync(`${__dirname}/lines.txt`, fs.readFileSync(`${__dirname}/sample.txt`).toString());
}

function readLines() {
    return new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/lines.txt`, 'utf8', (err, lines) => {
            if (err) {
                reject(err);
            } else {
                resolve(lines.split('\n'));
            }
        });
    });
}

function appendLines(msg) {
    return new Promise((resolve, reject) => {
        fs.appendFile(`${__dirname}/lines.txt`, msg.replace(/\n+/g, ' ').trim() + '\n', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

exports.commands = [
    'chat'
];

exports.chat = {
    desc: 'Chat with the bot.',
    longDesc: 'Uses an algorithm to simulate chatting with a human. May be extremely dumb and offtopic at times.',
    usage: '<message>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.msg.channel.createMessage(localeManager.t('chatbot-noArgs', ctx.settings.locale)).then(resolve).catch(reject);
            } else if (/how (dumb|smart) are you\??/i.test(ctx.suffix.toLowerCase())) {
                readLines().then(lines => {
                    return ctx.msg.channel.createMessage(`I currently know **${lines.length}** things.`);
                }).then(resolve).catch(reject);
            } else {
                let chat;
                readLines().then(lines => {
                    chat = new Markov(lines, {stateSize: 3});
                    return chat.buildCorpus();
                }).then(() => {
                    return appendLines(ctx.suffix);
                }).then(() => {
                    return chat.generateSentence({maxLength: 420});
                }).then(sent => {
                    return ctx.msg.channel.createMessage(sent.string);
                }).then(resolve).catch(reject);
            }
        });
    }
};
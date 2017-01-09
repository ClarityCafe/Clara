/*
 * chat.js - Talk with the bot using the CleverBot API.
 * Based from chalda/DiscordBot.
 * 
 * Contributed by Capuccino, Ovyerus.
 */


exports.commands = [
    'talk'
];

const Cleverbot = require('cleverbot-node');
const Promise = require('bluebird');

var talkbot = new Cleverbot();

Cleverbot.prepare(() => { });

exports.talk = {
    desc: 'Talk to the bot as if it were a human (sorta).',
    fullDesc: 'Uses the Cleverbot API to simulate a conversation with another human.',
    usage: '<message>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Hm?').then(() => reject([new Error('No message given.')])).catch(reject);
            } else {
                talkbot.write(ctx.suffix, (response) => {
                    ctx.msg.channel.createMessage(response.message).then(() => resolve()).catch(reject);
                });
            }
        });
    }
};
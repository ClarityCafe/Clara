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
Cleverbot.prepare(() => {});

exports.talk = {
    desc : 'talk to the bot as if it were human (sort of)',
    longDesc: 'Converse with the bot (uses Cleverbot)',
    usage: '<message>',
    main: (bot, ctx) => {
        return new Promise((resolve,reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Oyasumi!').then(() => reject([new Error('no message provided')])).catch(err => ([err]));
            } else {
                talkbot.write(ctx.suffix, res => {
                    ctx.msg.channel.createMessage(res.message).then(()=> resolve()).catch(err => ([err]));
                });
            }
        });
    }
}

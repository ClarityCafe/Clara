/*
 * chat.js - Talk with the bot using the CleverBot API.
 * Based from chalda/DiscordBot.
 * 
 * Contributed by Capuccino, Ovyerus.
 */

exports.commands = [
    'talk'
];

const Cleverbot = require('cleverbot.io');
const config = require(`${__baseDir}/config.json`);
const ayano = new Cleverbot('t77jVhrskGDT6Dm1', 'XKmJ3XW1dQwVJVXpWfODAUQ5qKucD6tc');

ayano.setNick(`kotori-io-${config.ownerID}`);

ayano.create((err, session) => {});

exports.talk = {
    desc: 'chat with the bot',
    longDesc: 'Converse with the bot using Cleverbot',
    usage: '<message>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.msg.channel.createMessage('I-Its not like I want to talk with you or anything.... b-baka! >//>').then(resolve).catch(reject);
            } else {
                ayano.ask(ctx.suffix, (err, response) => {
                    ctx.msg.channel.createMessage(response).then(resolve).catch(reject);
                });
            }
        });
    }
};
//* Upcoming Chatbot Wrapper
//* 
//* DO NOT DISABLE ADMIN RESTRCTION!
//*
//* Contributed by Capuccino

exports.commands = [
    'next'
];

// *
// * docs for this lib is at https://doclets.io/dustinblackman/node-cleverbot/master
// *
const fs = require('fs');
const Cleverbot = require('cleverbot.io');
const config = require(`${__baseDir}/config.json`);
const ayano = new Cleverbot('t77jVhrskGDT6Dm1', 'XKmJ3XW1dQwVJVXpWfODAUQ5qKucD6tc');

ayano.setNick(`kotori-io-${config.ownerID}`);

ayano.create((err, session) => {
    // * left empty for now
    // *
});

exports.next = {
    desc: 'a Upcoming Chat module',
    longDesc: 'its coming soon',
    adminOnly: true,
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix === 0) {
                ctx.msg.channel.createMessage('Oyasumi!').then(() => reject([new Error('no message provided')])).catch(err => ([err]));
            } else {
                ayano.ask(ctx.suffix, (err, response) => {
                    ctx.msg.channel.createMessage(response).then(() => resolve()).catch(err => ([err]));
                });
            }
        });
    }
};
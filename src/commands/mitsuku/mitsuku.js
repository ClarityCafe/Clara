//* Mitsuku Chatbot wrapper
//* 
//* DO NOT DISABLE ADMIN RESTRCTION!
//* Steve will killl us if we spam the API too much
//*
//* Contributed by Capuccino

exports.command = [
    'talk.next'
];

const ayano = require('mitsuku-api');

exports.talk.next = {
    desc: 'a upcoming Chatbot module',
    longDesc: 'chat with the bot using the Mitsuku API!',
    usage: '<message>',
    adminOnly : true,
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix === 0) {
                ctx.msg.channel.createMessage('hm?').then(() => reject([new Error('no message specified!')])).catch(err => ([err]));
            } else {
                ayano.send(ctx.suffix).then((response) => {
                    ctx.msg.channel.createMessage(response).then(() => resolve()).catch(err => ([err]));
                });
            }
        });
    }
};
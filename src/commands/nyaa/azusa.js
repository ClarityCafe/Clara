/*
 * azusa.js - random.cat command.
 *
 * Contributed by Capuccino
 */

const got = require('got');

exports.commands = [
    'nyaa'
];

exports.nyaa = {
    desc: 'Nyaaa!',
    fullDesc: 'Gets an image from random.cat',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            got('http://random.cat/meow').then(res => {
                let nyaa = JSON.parse(res.body).file;
                ctx.msg.channel.createMessage(nyaa).then(resolve).catch(reject);
            }).catch(reject(new Error('Unexpected Error happened.')));
        });
    }
};
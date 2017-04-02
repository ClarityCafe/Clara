/* 
 *  awwnime - Generates a random anime picture.
 * 
 *  Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

const got = require('got');

exports.commands = [
    'awwnime'
];

exports.awwnime = {
    desc: 'Gets you a random anime picture outside of yorium.moe',
    usage: '[query]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.msg.channel.sendTyping();
                got('https://raw-api.now.sh/').then(res => {
                    let images = JSON.parse(res.body);
                    let image = images[Math.floor(Math.random() * images.length)];

                    if (!image) return ctx.msg.channel.createMessage('No results found.');
                    return ctx.msg.channel.createMessage(image.full);
                }).then(resolve).catch(reject);
            } else {
                let query = encodeURIComponent(ctx.suffix).replace(/%20/g, '+');
                ctx.msg.channel.sendTyping();
                got(`https://raw-api.now.sh/?q=${query}`).then(res => {
                    let images = JSON.parse(res.body);
                    let image = images[Math.floor(Math.random() * images.length)];

                    if (!image) return ctx.msg.channel.createMessage('No results found.');
                    return ctx.msg.channel.createMessage(image.full);
                }).then(resolve).catch(reject);
            }
        });
    }
};
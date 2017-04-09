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
                ctx.sendTyping();
                got('https://raw-api.now.sh/').then(res => {
                    let images = JSON.parse(res.body);
                    let image = images[Math.floor(Math.random() * images.length)];

                    if (!image) return ctx.createMessage('No results found.');
                    return ctx.createMessage(image.full);
                }).then(resolve).catch(reject);
            } else {
                let query = encodeURIComponent(ctx.suffix).replace(/%20/g, '+');
                ctx.sendTyping();
                got(`https://raw-api.now.sh/?q=${query}`).then(res => {
                    let images = JSON.parse(res.body);
                    let image = images[Math.floor(Math.random() * images.length)];

                    if (!image) return ctx.createMessage('No results found.');
                    return ctx.createMessage(image.full);
                }).then(resolve).catch(reject);
            }
        });
    }
};
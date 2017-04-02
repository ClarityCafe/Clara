/*
 * nya.js - Send randomised ASCII cats.
 * 
 * Contributed by Capuccino.
 */

/* eslint-env node */

const cats  = require('cat-ascii-faces');

exports.commands = [
    'cat'
];

exports.cat = {
    desc: 'Prints out a random cat.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            var cat = cats();
            ctx.msg.channel.createMessage(cat).then(resolve).catch(reject);
        });
    }
};
/**
 * @file Send randomised ASCII cats.
 * @author Capuccino
 */

/* eslint-env node */

const cats  = require('cat-ascii-faces');

exports.commands = [
    'nyaa'
];

exports.nyaa = {
    desc: 'Nyaa~!',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.createMessage(cats()).then(resolve).catch(reject);
        });
    }
};
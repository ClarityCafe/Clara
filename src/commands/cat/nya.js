/**
 * @file Send randomised ASCII cats.
 * @author Capuccino
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
            ctx.createMessage(cats()).then(resolve).catch(reject);
        });
    }
};
/**
 * @file leetspeak generator nya
 * @author Capuccino
 */

const leet = require('l33tsp34k');

exports.commands = [
    'leet'
];

exports.leet = {
    desc: 'L33tify your message',
    usage: '<message>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                return ctx.createMessage('Provide me a message to l33tify').then(resolve).catch(reject);
            } else {
                return ctx.createMessage(leet(ctx.suffix));
            }
        });
    }
};
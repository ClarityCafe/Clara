/*
* CurrencyChecker
*
* uses the fixer.io API
*
* Contributed by Capuccino
*
 */

exports.commands = [
    'convert'
];

const fx = require('./money.min.js');
var awauRegex = str => /^\d+(?:\.\d+)? (?:[A-Z]{3}\s?){2}$/.test(str);

exports.convert = {
    desc: 'converts money, that it',
    usage: '<[number] [Currency Code]> <resulting Currency code>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix | ctx.args) {
                ctx.msg.channel.createMessage('Give me a number then two currencies first.').then(resolve).catch(reject);
            } else if (ctx.args > 4) {
                ctx.msg.channel.createMessage('Insufficient information. I need a number and at least two currencies').then(reject).catch(reject);
            } else if (!ctx.args.test(awauRegex)) {
                ctx.msg.channel.createMessage('Nope, wrong format!').then(resolve).then(reject);
            } else {
                fx(ctx.args[1]).from(ctx.args[2]).to(ctx.args[3]);
            }
        });
    }
};

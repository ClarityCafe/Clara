/*
 * eval.js - Evaluate JavaScript code in Discord.
 * 
 * Contributed by Ovyerus.
 */

const Promise = require('bluebird');
const Discord = require('discord.js');
const util = require('util');

exports.commands = [
    'eval'
];

exports.eval = {
    desc: 'Evaluate code in Discord.',
    fullDesc: 'Used to evaluate JavaScript code in Discord. Mostly for debug purposes.',
    adminOnly: true,
    usage: '<code>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Please give arguments to evaluate.').then(() => {
                    reject([new Error('No arguments given.')]);
                }).catch(err => reject([err]));
            } else {
                var evalArgs = ctx.suffix;

                try {
                    var returned = eval(evalArgs);
                    var str = util.inspect(returned, { depth: 1 });
                    str = str.replace(new RegExp(bot.token, 'gi'), '(token)');

                    if (str.length > 1900) {
                        str = str.substr(0, 1897);
                        str = str + '...';
                    }

                    var sentMessage = '```js\n';
                    sentMessage += `Input: ${evalArgs}\n\n`;
                    sentMessage += `Output: ${str}\n`;
                    sentMessage += '```';

                    ctx.msg.channel.createMessage(sentMessage).then(() => resolve()).catch(err => reject([err]));
                } catch (err) {
                    var errMessage = '```js\n';
                    errMessage += `Input: ${evalArgs}\n\n`;
                    errMessage += `${err}\n`;
                    errMessage += '```';

                    ctx.msg.channel.createMessage(errMessage).then(() => reject([err])).catch(e => reject([e]));
                }
            }
        });
    }
}
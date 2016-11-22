/*
 * f.js - Pay respects.
 * 
 * Contributed by Capuccino and Ovyerus.
 */

const Promise = require('bluebird');
const utils = require(`${_baseDir}/lib/utils.js`);

exports.commands = [
    'f'
];

exports.f = {
    desc: 'Pay respects.',
    fullDesc: 'Pay your respects. You can also optionally pay your respects to a specific thing.',
    usage: '[object for respects]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.cleanSuffix) {
                ctx.msg.channel.sendMessage(`**${utils.formatUsername(ctx.msg.member)}** has paid their respects for \`${ctx.cleanSuffix}\``).then(() => resolve()).catch(err => reject([err]));
            } else {
                ctx.msg.channel.sendMessage(`**${utils.formatUsername(ctx.msg.member)}** has paid their respects.`).then(() => resolve()).catch(err => reject([err]));
            }
        });
    }
}
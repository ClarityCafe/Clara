/*
 * f.js - Pay respects.
 * 
 * Contributed by Capuccino and Ovyerus.
 */

const Promise = require('bluebird');
const utils = require(`${__baseDir}/lib/utils.js`);

exports.commands = [
    'f',
    'rip'
];

exports.f = {
    desc: 'Pay respects.',
    fullDesc: 'Pay your respects. You can also optionally pay your respects to a specific thing.',
    usage: '[object for respects]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.cleanSuffix) {
                ctx.msg.channel.createMessage(`**${utils.formatUsername(ctx.msg.member, true)}** has paid their respects for **${ctx.cleanSuffix}**`).then(() => resolve()).catch(err => reject([err]));
            } else {
                ctx.msg.channel.createMessage(`**${utils.formatUsername(ctx.msg.member, true)}** has paid their respects.`).then(() => resolve()).catch(err => reject([err]));
            }
        });
    }
}

exports.rip = {
    desc: 'Rest in pieces.',
    fullDesc: 'Lets something rest in peace.',
    usage: '[thing]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.cleanSuffix) {
                var owo = encodeURI(`https://ripme.xyz/#${ctx.cleanSuffix}`);
                ctx.msg.channel.createMessage(`<${owo}> Forever rest in peace.`).then(() => resolve()).catch(err => reject([err]));
            } else {
                ctx.msg.channel.createMessage('Forever rest in peace.').then(() => resolve()).catch(err => reject([err]));
            }
        });
    }
}
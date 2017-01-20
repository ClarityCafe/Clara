// * datchatbot Scratchpad Command
// * Experimental, Do not release with Nodetori
// *
// *
// * by Capuccino

exports.commands = [
    'scratch'
];

const chatbot = require('datchatbot');
const ayana = new chatbot.Client('', 'kotori');
const Promise = require('bluebird');

exports.scratch = {
    desc: 'Experimental Module. Bot Creators only',
    longDesc: 'This is an experimental module. Bot Creators only',
    usage: '<message>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            // we're reusing the CB.io coding if ctx length is 0
            if (ctx.msg.suffix.length === 0) {
                ctx.msg.channel.createMessage('Hi!').then(() => {
                    reject([new Error('No Message provided!')]);
                }).catch(err => ([err]));
            } else {
                ayana.ask(ctx.suffix).then(() => {
                    ctx.msg.channel.createMessage( /* left empty because there's no function to do responses */ ).then(() => resolve()).catch(err => ([err]));
                }).catch(err => ([err]));
            }
        });
    }
};
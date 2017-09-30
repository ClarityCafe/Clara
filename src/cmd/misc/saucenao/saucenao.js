/**
 * @file saucenao.js
 * @description a command to get your waifu's source
 * @author Capuccino
 */

/* eslint-env node */

//this handles the SauceNao handling
const SauceNAO = require('./sauceQueryHandler');
let sourcer;

exports.init = bot => {
    sourcer = new SauceNAO(bot.config.sauceKey);
};

exports.commands = [
    'saucenao'
];

exports.saucenao = {
    desc: 'Gets the image from the recent attachment or via a image link and looks for saucenao to check for the source of the image.',
    main(bot, ctx) { 
        return new Promise((resolve, reject) => {
            if (!ctx.attachments[0] && !ctx.suffix) {
                ctx.createMessage('saucenao-noImage').then(resolve).catch(reject);
            } else if (ctx.attachments[0]) {
                ctx.createMessage('Finding source, this may take some time...').then(() => {
                    return ctx.channel.sendTyping();
                }).then(() => {
                    return sourcer.getSauce(ctx.attachments[0].url);
                }).then(res => {
                    return ctx.createMessage('saucenao-found', null, 'channel', {
                        similarity: res.similarity,
                        url: res.url
                    });
                }).then(resolve).catch(reject);
            } else if (ctx.suffix) {
                ctx.createMessage('Finding source, this may take some time...').then(() => {
                    return ctx.channel.sendTyping();
                }).then(() => {
                    return sourcer.getSauce(ctx.suffix);
                }).then(res => {
                    return ctx.createMessage('saucenao-found', null, 'channel', {
                        similarity: res.similarity,
                        url: res.url
                    });
                }).then(resolve).catch(reject);
            }
        });
    }
};
/*
 * chatbot.js - make Chatbot io great again 
 * 
 * Contributed by Capuccino
 */

//we'll use wolke's version of the lib
const chatbot = require('better-cleverbot-io');

// I don't care if everyone rips this out, we have unlimited API calls here anyways
const ayaneru = new chatbot({user: config.cbUser, key: config.cbKey});

exports.commands = [
    'chat'
];

exports.chat = {
    desc: 'Chat with the bot.',
    longDesc: 'Uses an Cloud API to simulate chatting with a human. May be extremely dumb and offtopic at times.',
    usage: '<message>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage(localeManager.t('chatbot-noArgs', ctx.settings.locale));
            } else {
                ayaneru.ask(ctx.suffix).then(res => {
                    ctx.createMessage(res);
                }).catch(reject);
            }
        });
    }
};
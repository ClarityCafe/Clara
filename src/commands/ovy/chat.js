/*
 * chat.js - Talk with the bot using the CleverBot API.
 * Based from chalda/DiscordBot.
 * 
 * Contributed by Capuccino, Ovyerus.
 */


exports.commands = [
    'talk'
];

const config = require(`${__baseDir}/config.json`);
const CleverBot = require('cleverbot.io');
//init code for CleverbotIO, get a configuration key from our fam at http://cleverbot.io
const ayano = new CleverBot(config.cleverAPIUser, config.cleverAPIKey);
const Promise = require('bluebird');

//works like bot.on, only more cleaner and non-shitty
ayano.create((session, err ) => {
    //Set Nick to preserve session
    ayano.setNick(`kotori_user_${config.ownerID}`);
});

exports.talk = {
    desc : 'talk to the bot as if it were human (sort of)',
    longDesc:'Converse with the bot (uses Cleverbot)',
    usage:'<Message>',
    main: (bot,ctx) => {
        return new Promise((resolve,reject) => {
            if(ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Oyasumi!').then(() => reject([new Error('no message provided')])).catch(err => ([err]));
            } else {
                bot.ask(ctx.suffix, (err, response) => {
                    ctx.msg.channel.createMessage(response).then(()=> resolve()).catch(err => ([err]));
                });
            }
        });
    }
};

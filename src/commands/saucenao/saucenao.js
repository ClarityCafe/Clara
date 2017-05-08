/*
 * saucenao.js - grab a image's source using saucenao. Grabs the last message attachment/URL, provided along with the command
 * or providing an attachment using the command as the caption.
 * 
 *  Contributed by Capuccino
 */

/* eslint-env node */

//this handles the SauceNao handling
const ayaneru = new (require('./sauceQueryHandler'))();
//this regex is gay

const urlRegex = str => /(http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(str);

exports.commands = [
    'saucenao'
];

exports.saucenao = {
    desc: 'Gets the image from the recent attachment or via a image link and looks for saucenao to check for the source of the image.',
    main(bot, ctx) { 
        return new Promise((resolve, reject) => {
            if (!ctx.attachments[0]) {
                return ctx.createMessage('Aw, no image here.');
            } else if (!ctx.suffix === urlRegex) {
                return ctx.createMessage('Oi, your URL is invalid!');
            } else if (ctx.attachments[0]) {
                ayaneru.getSauce(ctx.attachments[0].url).then(res => {
                    for (res.url of res) {
                        var fields = [];
                        fields.push(`${{name: 'Item', value: res.url, inline: true}}`);
                    }
                    ctx.createMessage({embed: {
                        title: 'Saucenao query results',
                        description: 'This is the closest I can find. Sorry if it is not accurate.',
                        fields
                    }});
                }).then(resolve).catch(reject);
            }
        });
    }
};
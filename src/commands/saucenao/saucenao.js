/*
 * saucenao.js - grab a image's source using saucenao. Grabs the last message attachment/URL, provided along with the command
 * or providing an attachment using the command as the caption.
 * 
 *  Contributed by Capuccino
 */

/* eslint-env node */

//this handles the SauceNao handling
const saucenao = require('./sauceQueryHandler');
let ayaneru;

exports.init = bot => {
    ayaneru = new saucenao({key: bot.config.sauceKey});
};

exports.commands = [
    'saucenao'
];

exports.saucenao = {
    desc: 'Gets the image from the recent attachment or via a image link and looks for saucenao to check for the source of the image.',
    main(bot, ctx) { 
        return new Promise((resolve, reject) => {
            if (!ctx.attachments[0]) {
                return ctx.createMessage(localeManager.t('saucenao-noImage', ctx.settings.locale));
            } else if (ctx.attachments[0]) {
                ayaneru.getSauce(ctx.attachments[0].url).then(res => {
                    let fields =[];
                    let ovy = JSON.parse(res).results;
                    for (res.results in res) {
                        fields.push(`${{name: ovy.name, value: `(Link)[${ovy.url}]`}}`, 0);
                    }
                    ctx.createMessage({embed: {
                        title: localeManager.t('sauce-embedTitle', ctx.settings.locale),
                        description: localeManager.t('sauce-embedDescription', ctx.settings.locale),
                        fields
                    }});
                }).catch(reject);
            } else if (ctx.suffix) {
                ayaneru.getSauce(ctx.suffix).then(res => {
                    let ovy = JSON.parse(res.results);
                    for (ovy.data of ovy) {
                        const fields = [];
                        fields.push(`${{name: ovy.title, value: `(Link)[${ovy.url}]`, inline: true}}`, 0);
                        ctx.createMessage({embed: {
                            title: localeManager.t('sauce-embedTitle', ctx.settings.locale),
                            description: localeManager.t('sauce-embedDescription', ctx.settings.locale),
                            fields
                        }});
                    }
                }).catch(reject);
            }
        });
    }
};
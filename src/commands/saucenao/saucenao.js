/*
 * saucenao.js - grab a image's source using saucenao. Grabs the last message attachment/URL, provided along with the command
 * or providing an attachment using the command as the caption.
 * 
 *  Contributed by Capuccino
 */

/* eslint-env node */

const Sagiri = require('sagiri');

const urlRegex = /^(?:(?:https?:)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
let sourcer;

exports.init = bot => {
    sourcer = new Sagiri(bot.config.sauceKey);
};

exports.commands = [
    'saucenao'
];

exports.saucenao = {
    desc: 'Tries to find the source for an image.',
    usage: '<url or attachment>',
    main(bot, ctx) { 
        return new Promise((resolve, reject) => {
            let url;
            
            new Promise(_resolve => {
                if (!ctx.attachments[0] && (!ctx.suffix || !urlRegex.test(ctx.suffix))) {
                    _resolve(ctx.channel.getMessages(100));
                } else {
                    _resolve(null);
                }
            }).then(res => {
                if (!res) {
                    url = ctx.attachments[0] ? ctx.attachments[0].url : ctx.suffix;
                    return;
                }

                let msgs = res.filter(m => m.embeds.filter(e => e.type === 'image')[0] || m.attachments.filter(a => a.width || a.height)[0]);

                if (!msgs[0]) return;

                url = msgs[0].embeds[0] ? msgs[0].embeds[0].url : msgs[0].attachments[0].url;
            }).then(() => {
                if (!url) {
                    resolve(ctx.createMessage('Please provide an image.'));
                    throw new Error('gotta break the loop somehow');
                }

                return ctx.channel.sendTyping();
            }).then(() => sourcer.getSource(url)).then(res => {
                return ctx.createMessage({embed: {
                    title: 'Source Found',
                    description: `[**Source URL**](${res[0].url})`,
                    thumbnail: {url: res[0].thumbnail},
                    fields: [
                        {
                            name: 'Site',
                            value: res[0].site,
                            inline: true
                        },
                        {
                            name: 'Similarity',
                            value: res[0].similarity.toString(),
                            inline: true
                        },
                        {
                            name: 'Other Matches',
                            value: res.slice(1).map(v => `**${v.similarity}** - [${v.site}](${v.url})`).join('\n')
                        }
                    ]
                }});
            }).then(resolve).catch(reject);
        });
    }
};
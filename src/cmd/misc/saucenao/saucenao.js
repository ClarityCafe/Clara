/**
 * @file Image sourcer command via SauceNAO
 * @author Capuccino
 * @author Ovyerus
 */
/* eslint-env node */

const Sagiri = require('sagiri');

const urlRegex = /^(?:(?:https?:)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
let sourcer;

exports.init = bot => {
    sourcer = new Sagiri(bot.config.sauceKey);
};

exports.commands = [
    'source'
];

exports.source = {
    desc: 'Tries to find the source for an image.',
    usage: '<url or attachment>',
    main(bot, ctx) { 
        return new Promise((resolve, reject) => {
            if (!ctx.attachments[0] || ctx.attachments[1] && (!ctx.suffix || !urlRegex.test(ctx.suffix))) {
                ctx.createMessage('Please provide an image.').then(resolve).catch(reject);
            } else {
                let url = ctx.attachments[0] ? ctx.attachments[0].url : ctx.suffix;

                ctx.channel.sendTyping().then(() => sourcer.getSource(url)).then(res => {
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
            }
        });
    }
};
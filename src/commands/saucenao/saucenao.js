/*
 * saucenao.js - grab a image's source using saucenao. Grabs the last message attachment/URL, provided along with the command
 * or providing an attachment using the command as the caption.
 * 
 *  Contributed by Capuccino
 */

/* eslint-env node */

exports.commands = [
    'saucenao'
];

const imgRegex = str => /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(str);

exports.saucenao = {
    desc: 'Grab an image\'s source using saucenao API.',
    longDesc: 'Gets the image source from sacuenao.',
    usage: '[image url]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                //grab the last message with an attachment
                if (!ctx.channel.attachments) {
                    ctx.createMessage('Aw, no Image here.');
                } else {
                    let imgUrl = ctx.channel.attachments[0].url;
                    got(`https://saucenao.com`, {
                        method: 'POST',
                        'Content-Type': 'application/json',
                        body: JSON.stringify({url: imgUrl})
                    }).then(res => {
                        //add entries
                        const fields = [];
                        for (res of res.url) {
                            /**
                             * @todo Limit results to 5. Assuming saucenao emits more than we need.
                             */
                            fields.push({name: '', value: res[0].url, inline: true});
                        }
                        //finally send the message in embed
                        ctx.createMessage({
                            embed: {
                                title: 'saucenao Query',
                                desccription: 'This is the closest I can find.',
                                fields
                            }
                        });
                    }).then(resolve).catch(reject);
                }
            } else {
                if (!imgRegex) {
                    ctx.createMessage('Your URL is invalid!, Please make sure it\'s a valid image URL.');
                } else {
                    //query saucenao but this time, we use the suffix value
                    got('https://saucenao.com', {
                        method: 'POST',
                        'Content-Type': 'application/json',
                        body: JSON.stringify({url: ctx.suffix})
                    }).then(res => {
                        const fields = [];
                        fields.push({name: '', value: res.url});
                        ctx.createMessage({
                            embed: {
                                title: 'saucenao query',
                                desccription: 'this is the closest I can find',
                                fields
                            }
                        });
                    }).then(resolve).catch(reject);
                }
            }
        });
    }
};
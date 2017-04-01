/*
 * saucenao.js - grab a image's source using saucenao. Grabs the last message attachment/URL, provided along with the command
 * or providing an attachment using the command as the caption.
 * 
 *  Contributed by Capuccino
 */
exports.commands = [
    'saucenao'
];

exports.saucenao = {
    desc: 'Grab an image\'s source using saucenao API.',
    longDesc: 'Gets the image source from sacuenao.',
    usage: '(Image URL [If not provided, it would grab the last message with image attachment\'s URL and sends it to the API])',
    main(bot, ctx) {
        if (!ctx.suffix) {
            //grab the last message with an attachment
            if (!ctx.msg.channel.attachments) {
                ctx.msg.channel.createMessage('Aw, no Image here.');
            } else {
                let imgUrl = ctx.msg.channel.attachments[0].url;
                got(`https://saucenao.com`, {
                    method: 'POST',
                    'Content-Type': 'application/json',
                    body: JSON.stringify({url: imgUrl})
                }).then(res => {
                    //only return the top result
                    const fields = [];
                    //TODO : should push a embed field.
                    fields.push({name: '', value: res[0].url, inline: true});
                    //finally send the message in embed
                    ctx.msg.channel.createMessage({embed: {
                        title: 'saucenao Query',
                        desccription: 'This is the closest I can find.',
                        fields
                    }}).then(resolve).catch(reject);
                }).catch(reject);
            }
        }
    }
};
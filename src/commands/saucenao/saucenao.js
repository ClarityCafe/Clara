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
        }
    }
};
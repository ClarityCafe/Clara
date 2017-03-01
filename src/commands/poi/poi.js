/*
 * poi.js - ¯\_(ツ)_/¯
 * 
 * Contributed by Capuccino and Ovyerus
 */

exports.commands = [
    'poi'
];

const responses = [
    'P-Poi?',
    'Poi...',
    'POI!!!!!?',
    'P-Poi..',
    'Poi uwu',
    '\u200b(\u200b╯\u200b°\u200b□\u200b°\u200b）\u200b╯\u200b︵\u200b \u200b┻\u200b━\u200b┻\u200b'
];

exports.poi = {
    desc: 'Poi? POI!? POOOOOOOOOOIIIIIIII!!!!',
    main: (bot,ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage(responses[Math.floor(Math.random() * responses.length)]).then(resolve).catch(reject);
        });
    }
};
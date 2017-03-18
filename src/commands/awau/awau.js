/*
 * awau.js - Awau
 * 
 * Contributed by Capuccino and Ovyerus
 */

const fs = require('fs');

exports.commands = [
    'awau'
];

exports.awau = {
    desc: 'Awaus at you.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.sendTyping();
            let file = fs.readFileSync(`${__baseDir}/res/awau/awau.png`);
            ctx.msg.channel.createMessage('', {file, name: 'awau.png'}).then(resolve).catch(reject);
        });
    } 
};
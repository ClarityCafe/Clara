/*
 * awau.js - Awau
 * 
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

const fs = require('fs');

exports.commands = [
    'awau'
];

exports.awau = {
    desc: 'Awaus at you.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.sendTyping();
            let files = fs.readdirSync(`${__baseDir}/res/awau`);
            let file = fs.readFileSync(`${__baseDir}/res/awau/${files[Math.floor(Math.random() * files.length)]}`);
            ctx.msg.channel.createMessage('', {file, name: 'awau.png'}).then(resolve).catch(reject);
        });
    } 
};
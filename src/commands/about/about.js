/* 
 * about.js - A more indepth and specific information about the bot.
 * 
 * Contributed by Capuccino
 */

const fs = require('fs');

exports.commands = [
    'about'
];

exports.about = {
    desc: 'All you need to know where the bot came from.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            let version = JSON.parse(fs.readFileSync(`${__baseDir}/package.json`)).version;
            ctx.msg.channel.createMessage({embed: {
                title: 'About Clara',
                description: localeManager.t('about-nya', ctx.settings.locale, {github: 'https://github.com/awau/Clara', patreon: 'https://patreon.com/capuccino'}),
                image: {url: 'https://github.com/awau/Clara/raw/master/nodebot_logo.png'},
                footer: {text: `${bot.user.username} uses Clara ${version}`}
            }}).then(resolve).catch(reject);
        });
    }
};
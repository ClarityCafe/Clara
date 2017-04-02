/* 
 * about.js - A more indepth and specific information about the bot.
 * 
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node*/

const fs = require('fs');
const path = require('path');

let version;
try {
    version = JSON.parse(fs.readFileSync(path.normalize(`${__baseDir}/../package.json`))).version;
} catch(_) {
    version = JSON.parse(fs.readFileSync(`${__baseDir}/package.json`)).version;
}

exports.commands = [
    'about'
];

exports.about = {
    desc: 'All you need to know where the bot came from.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage({embed: {
                title: 'About Clara',
                description: localeManager.t('about-nya', ctx.settings.locale, {github: 'https://github.com/awau/Clara', patreon: 'https://patreon.com/capuccino'}),
                image: {url: 'https://github.com/awau/Clara/raw/master/nodebot_logo.png'},
                footer: {text: `${bot.user.username} uses Clara ${version}`}
            }}).then(resolve).catch(reject);
        });
    }
};
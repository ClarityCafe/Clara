/* A brief info about the bot
 * 
 * It's like info, but we tackle more about the copyright and such
 * 
 *  Contributed by Capuccino
 */

exports.commands = [
    'about'
];

const fs = require('fs');

exports.about = {
    desc: 'All you need to know where the bot came from',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            let version = JSON.parse(fs.readFileSync(`${__baseDir}/package.json`)).version;
            ctx.msg.channel.createMessage({embed: {
                title: 'About Clara',
                description: localeManager.t('about-nya', ctx.settings.locale),
                image: {url: 'https://github.com/awau/Clara/raw/master/nodebot_logo.png'},
                footer: {text: `${bot.user.username} uses Clara ${version}`}

            }}).then(resolve).catch(reject);
        });
    }
};
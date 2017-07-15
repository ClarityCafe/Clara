/**
 * @file Show NASA's Astronomy Picture of the Day
 * @author Capuccino
 * @author Ovyerus
 */

/* eslint-env node */

const got = require('got');

exports.commands = [
    'apod'
];

exports.apod = {
    desc: "Shows NASA's [Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html) (APOD)",
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!bot.config.nasaKey) {
                ctx.createMessage('nasa-noKey').then(resolve).catch(reject);
            } else {
                ctx.channel.sendTyping();
                got(`https://api.nasa.gov/planetary/apod?api_key=${bot.config.nasaKey}`).then(res => {
                    let data = JSON.parse(res.body);

                    return ctx.createMessage({embed: {
                        title: data.title,
                        description: data.copyright ? 'nasa-copyright' : '',
                        thumbnail: {url: 'https://api.nasa.gov/images/logo.png'},
                        image: {url: data.url},
                        footer: {text: 'nasa-date'}
                    }}, null, 'channel', {
                        copyright: data.copyright,
                        date: data.date
                    });
                }).then(resolve).catch(reject);
            }
        });
    }
};
/*
 * nasa.js - Show NASA's Astronomy Picture of the Day
 * 
 * Contributed by Capuccino and Ovyerus
 */

const request = require('request');

exports.commands = [
    'apod'
];

exports.apod = {
    desc: "Shows NASA's [Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html) (APOD)",
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!bot.config.nasaKey) {
                ctx.msg.channel.createMessage(localeManager.t('nasa-noKey', settings.locale)).then(resolve).catch(reject);
            } else {
                request(`https://api.nasa.gov/planetary/apod?api_key=${bot.config.nasaKey}`, (err, resp, body) => {
                    if (err) {
                        reject(err);
                    } else if (resp.statusCode !== 200) {
                        reject(new Error(`Invalid status code: ${resp.statusCode}`));
                    } else {
                        let data = JSON.parse(body);
                        ctx.msg.channel.createMessage({embed: {
                            title: data.title,
                            description: data.copyright ? localeManager.t('nasa-copyright', settings.locale, {copyright: data.copyright}) : '',
                            thumbnail: {url: 'https://api.nasa.gov/images/logo.png'},
                            color: 0xFD7BB5,
                            image: {url: data.url},
                            footer: {text: localeManager.t('nasa-date', settings.locale, {date: data.date})}
                        }}).then(resolve).catch(reject);
                    }
                });
            }
        });
    }
};
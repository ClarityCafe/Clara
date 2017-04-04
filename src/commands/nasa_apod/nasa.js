/*
 * nasa.js - Show NASA's Astronomy Picture of the Day
 * 
 * Contributed by Capuccino and Ovyerus
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
                ctx.createMessage(localeManager.t('nasa-noKey', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                got(`https://api.nasa.gov/planetary/apod?api_key=${bot.config.nasaKey}`).then(res => {
                    let data = JSON.parse(res.body);
                    return ctx.createMessage({embed: {
                        title: data.title,
                        description: data.copyright ? localeManager.t('nasa-copyright', ctx.settings.locale, {copyright: data.copyright}) : '',
                        thumbnail: {url: 'https://api.nasa.gov/images/logo.png'},
                        color: 0xFD7BB5,
                        image: {url: data.url},
                        footer: {text: localeManager.t('nasa-date', ctx.settings.locale, {date: data.date})}
                    }});
                }).then(resolve).catch(reject);
            }
        });
    }
};
/**
 * @file Show NASA's Astronomy Picture of the Day
 * @author Capuccino
 * @author Ovyerus
 * @todo implement some form of caching so that the daily limit doesnt get hit
 */

const got = require('got');

exports.commands = [
    'apod'
];

exports.apod = {
    desc: "Shows NASA's [Astronomy Picture of the Day](http://apod.nasa.gov/apod/astropix.html) (APOD)",
    async main(bot, ctx) {
        if (!bot.config.nasaKey) return await ctx.createMessage('nasa-noKey');

        await ctx.channel.sendTyping();

        let data = JSON.parse((await got(`https://api.nasa.gov/planetary/apod?api_key=${bot.config.nasaKey}`)).body);

        await ctx.createMessage({embed: {
            title: data.title,
            description: data.copyright ? 'nasa-copyright' : '',
            thumbnail: {url: 'https://api.nasa.gov/images/logo.png'},
            image: {url: data.url},
            footer: {text: 'nasa-date'}
        }}, null, 'channel', {
            copyright: data.copyright,
            date: data.date
        });
    }
};
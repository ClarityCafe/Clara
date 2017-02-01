// * a Weather Command
// * ANOTHER DEDICATED COMMAND!? FLEENSTONES?!
// * 
// * Capuccino has no sanity left so she coded this

exports.commands = [
    'weather',
];
const Promise = require('bluebird');
const weather = require('weather-js'); // npm package is https://www.npmjs.com/package/weather-js

function weatherBlock(location, current, forecast) {
    return {
        embed: {
            title: `Weather Information for ${location.name}.`,
            description: current.skytext,
            color: 0xFD7BB5,
            thumbnail: location.imagerelativeurl,
            fields: [
                {name: 'Humidity', value: current.humidity, inline: true},
                {name: 'Temprature', value: current.temperature, inline: true},
                {name: 'Wind Speed', value: current.winddisplay, inline: true},
                {name: 'Observed From', value: current.observationpoint, inline: true}

            ],
            footer: {text: `Queried from MSN Weather. Last Updated by ${forecast.date} , ${forecast.day}`}
        }
    };
}
exports.weather = {
    desc: 'Check for weather on a city',
    usage: '<City, ie. Melbourne, Australia>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix === 0) {
                ctx.msg.channel.createMessage('No City Specified!').then(() => reject([new Error('no City Specified')])).catch(err => ([err]));
            } else {
                weather.find({search : ctx.suffix, degreeType: 'C'}, (err, result) => {
                    let loli = JSON.parse(result);
                    ctx.msg.channel.createMessage({embed : {
                        title: `Weather information for ${loli.location.name}`
                    }}).then(() => resolve()).catch(err => ([err]));
                });
            }
        });
    }
};
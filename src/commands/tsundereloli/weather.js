// * a Weather Command
// * ANOTHER DEDICATED COMMAND!? FLEENSTONES?!
// * 
// * Capuccino has no sanity left so she coded this

exports.commands = [
    'weather',
];

const weather = require('weather-js'); // npm package is https://www.npmjs.com/package/weather-js

exports.weather = {
    desc: 'Check for weather on a city',
    usage: '<City, ie. Melbourne, Australia>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix === 0) {
                ctx.msg.channel.createMessage('No City Specified!').then(() => reject([new Error('no City Specified')])).catch(err => ([err]));
            } else {
                weather.find({search : ctx.suffix, degreeType: 'C'}, (err, result) => {
                    const loli = JSON.parse(result);
                    ctx.msg.channel.createMessage({embed : {
                        title: `Weather information for ${loli.location.name}`,
                        description : loli.current.skytext,
                        color : 0xFD7BB5,
                        thumbnail: loli.location.imagerelativeurl,
                        fields : [
                            {name: 'Temperature', value : loli.current.temperature, inline : true},
                            {name: 'Humidity' , value: loli.current.humidity, inline: true},
                            {name: 'Wind Speed', value: loli.current.winddisplay, inline:true}
                        ],
                        footer : {text: `Observed from ${loli.current.observationpoint}. Updated as of ${loli.forecast.day}, ${loli.forecast.date}.`}
                    }}).then(() => resolve()).catch(err => ([err]));
                });
            }
        });
    }
};
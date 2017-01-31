// * a Weather Command
// * ANOTHER DEDICATED COMMAND!? FLEENSTONES?!
// * 
// * Capuccino has no sanity left so she coded this

exports.commands = [
    'weather',
];
// mfw you didn't require a weather API yet but you made a weather command
// :clap:

const Promise = require('bluebird');
const weather = require('weather-js'); // npm package is https://www.npmjs.com/package/weather-js

//wao es5 functions kill me pls
function weatherBlock(location, current, forecast) {
    return {embed : {
        title: `Weather Information for ${location.name}.`,
        description: current.skytext,
        color: 0xFD7BB5,
        thumbnail: location.imagerelativeurl,
        fields : [
            {name:'Humidity', value: current.humidity, inline: true},
            {name : 'Temprature', value : current.temperature, inline: true },
            {name : 'Wind Speed', value : current.winddisplay, inline: true },
            {name: 'Observed From', value : current.observationpoint, inline: true}
            
        ],
        footer: {text: `Queried from MSN Weather. Last Updated by ${forecast.date} , ${forecast.day}`}
    }
}
exports.weather = {
    desc : 'check for weather on a particular place',
    longDesc: '',
    main: (bot , ctx) => {
        
    }
}
// * NASA APOD Parser
// * For Spacefags
// *
// * Contributed by Capuccino

exports.commands = [
    'spacenews'
];

const voyager = require('request');

exports.spacenews = {
    desc: 'returns the latest news from NASA',
    main: (bot,ctx) => {
        return new Promise((resolve,reject) => {
            voyager('https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo', (err ,res ,body) => {
                if(err) {
                    reject(err);
                } else if (res.statusCode !== 200) {
                    ctx.msg.channel(`Oh my!, something unexpected happened! Try Again! (Error Code ${res.statusCode})`).then (() => {
                        reject( new Error(`Invalid Response! Expected JSON Response, got code ${res.statusCode} instead.`));
                    }).catch(err => (err));
                } else {
                    ctx.msg.channel.createMessage({embed : {
                        title: JSON.parse(body.title),
                        thumbnail:{url: 'https://api.nasa.gov/images/logo.png', width: 150, height : 150},
                        color: 0xFD7BB5 ,//placeholder,
                        fields : [
                            {name: 'image', value: JSON.parse(body.hdurl)},
                            {name: '', value: JSON.parse((body.explanation))}
                        ],
                        footer : {text: `Retrieved using NASA Open API. Retrieved ${JSON.parse(body.date)}.`}
                    }}).then(() => resolve).catch(err => err);
                }
            })
        })
    }
};
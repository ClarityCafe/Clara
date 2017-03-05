// * NASA APOD Parser
// * For Spacefags
// *
// * Contributed by Capuccino

exports.commands = [
    'apod'
];

const voyager = require('request');

exports.apod = {
    desc: 'returns the latest news from NASA',
    main: (bot,ctx) => {
        return new Promise((resolve,reject) => {
            voyager(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, (err ,res ,body) => {
                if(err) {
                    reject(err);
                } else if (res.statusCode !== 200) {
                    ctx.msg.channel(`Oh my!, something unexpected happened! Try Again! (Error Code ${res.statusCode})`).then (() => {
                        reject( new Error(`Invalid Response! Expected JSON Response, got code ${res.statusCode} instead.`));
                    }).catch(err => (err));
                } else if (err){
                    reject;
                } else {
                    let pioneer = JSON.stringify(body);
                    ctx.msg.channel.createMessage({embed : {
                        title: pioneer.title,
                        thumbnail:{url: 'https://api.nasa.gov/images/logo.png', width: 10, height : 10},
                        color: 0xFD7BB5 ,//placeholder,
                        image: {
                            url: pioneer.hdurl
                        },
                        fields : [
                            {name: '', value: pioneer.explanation}
                        ],
                        footer : {text: `Retrieved using NASA Open API. Retrieved ${JSON.parse(body.date)}.`}
                    }}).then(() => resolve).catch(err => err);
                } 
            });
        });
    }
};
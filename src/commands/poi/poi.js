// * Poi
// * Poi?
// * POI!!!!!???
// * [Poi intensifies]
// * -Capuccino

exports.commands = [
    'poi'
];

exports.poi = {
    desc: 'Poi? POI!? POOOOOOOOOOIIIIIIII!!!!',
    main: (bot,ctx) => {
        let responses = [
            'P-Poi?',
            'Poi...',
            'POI!!!!!?',
            'P-Poi..',
            'Poi uwu',
            '(╯°□°）╯︵ ┻━┻'
            ];
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage(responses[Math.floor(Math.random()* responses.length)]);
                .then(resolve)
                .catch(reject);
        });
    }
};
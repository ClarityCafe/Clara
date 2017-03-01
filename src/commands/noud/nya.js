// * noud's special Module
// * Anime faces bois uwu
// *
// * contributed by Capuccino

const cats  = require('cat-ascii-faces');

exports.commands = [
    'cat'
];

exports.cat = {
    desc: 'prints out a random cat',
    longDesc: 'prints out a fucked up ASCII cat for your nya-ing pleasure',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            var cat = cats();
            ctx.msg.channel.createMessage(cat).then(resolve).catch(reject);
        });
    }
};
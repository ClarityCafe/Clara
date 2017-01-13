// * noud's special Module
// * Anime faces bois uwu
// *
// * contributed by Capuccino

exports.commands = [
    'cat'
];
const cats  = require('cat-ascii-faces');


exports.cat = {
    desc: 'prints out a random cat',
    longDesc: 'prints out a fucked up ASCII cat for your nya-ing pleasure',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.sendMessage(cats()).then(() => resolve()).catch(err => ([err]));
        });
    }
};
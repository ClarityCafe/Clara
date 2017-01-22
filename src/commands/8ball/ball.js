// * A kinky 8 ball command
// *
// * Contributed by Capuccino
exports.commands = [
    'ball'
];

const Promise = require('bluebird');

//a variable of all memes
var responses = [
    'Albeit Not So Good',
    'I Doubt it',
    'You may rely on it',
    'No Doubt!',
    'Yes',
    'No',
    `I didn't quite get that, ask again.`,
    `I can't answer that right now....`
];

const response = responses[Math.floor(Math.random() * responses.length)];

exports.ball = {
    desc: 'Make the bot decide for you or do some things',
    longDesc: `'tis an 8ball command. Nothing new`,
    usage: '<Question?>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Ask somethng first.').then(() => {
                    reject([new Error('No Question Given!')]);
                }).catch(err => ([err]));
            } else if (ctx.suffix) {
                ctx.msg.channel.createMessage(response).then(() => resolve ()).catch(err => ([err]));
            }
        });
    }
};
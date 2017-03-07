/*
 * clean.js - Clean only the bots messages.
 * 
 * Contributed by Ovyerus
 */

exports.commands = [
    'clean'
];

exports.clean = {
    desc: 'clean messages created by the bot itself',
    main: (bot, ctx) => {
        return new Promise((resolve,reject) => {
            ctx.msg.channel.getMessages(100).then(msgs => {
                let delet = [];
                msgs.forEach(m => delet.push(m.delete()));
                return Promise.all(delet);
            });
        });
    }
};


/*
 * ping.js - Simple command used to check ping time.
 * 
 * Contributed by Capuccino, Ovyerus.
 */



exports.commands = [
    'ping'
];

exports.ping = {
    desc: 'Ping!',
    fullDesc: "Ping the bot and check it's latency.",
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage('Pong!').then(m => {
                m.edit(`Pong! \`${m.timestamp - ctx.msg.timestamp}ms\``).then(() => resolve()).catch(err => reject([err]));
            }).catch(err => reject([err]));
        });
    }
};

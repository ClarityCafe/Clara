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
            ctx.msg.channel.createMessage(localeManager.translate('pong', 'en-UK')).then(m => {
                return m.edit(localeManager.translate('pongEdit', 'en-UK', {time: m.timestamp - ctx.msg.timestamp}));
            }).then(resolve).catch(reject);
        });
    }
};
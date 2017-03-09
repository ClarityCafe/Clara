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
                return m.edit(localeManager.translate('pong', 'en-UK') + ` \`${m.timestamp - ctx.msg.timestamp}ms\``);
            }).then(resolve).catch(reject);
        });
    }
};
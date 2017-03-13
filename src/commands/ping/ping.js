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
            ctx.msg.channel.createMessage(localeManager.t('pong', settings.locale)).then(m => {
                return m.edit(localeManager.t('pong', settings.locale) + ` \`${m.timestamp - ctx.msg.timestamp}ms\``);
            }).then(resolve).catch(reject);
        });
    }
};
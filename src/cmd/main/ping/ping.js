/**
 * @file Simple command used to check ping time.
 * @author Ovyerus
 * @author Capuccino
 */

/* eslint-env node */

exports.commands = [
    'ping'
];

exports.ping = {
    desc: "Ping the bot and check it's latency.",
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.createMessage('pong').then(m => {
                return m.edit(`${m.content} \`${m.timestamp - ctx.timestamp}ms\``);
            }).then(resolve).catch(reject);
        });
    }
};
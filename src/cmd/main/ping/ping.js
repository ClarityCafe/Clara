/**
 * @file Simple command used to check ping time.
 * @author Ovyerus
 * @author Capuccino
 */

exports.commands = [
    'ping'
];

exports.ping = {
    desc: 'Ping the bot and check its latency.',
    main(bot, ctx) {
        return ctx.createMessage('pong').then(m => {
            return m.edit(`${m.content} \`${m.timestamp - ctx.timestamp}ms\``);
        });
    }
};
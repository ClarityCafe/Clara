/*
 * clean.js - Clean only the bots messages.
 * 
 * Contributed by Ovyerus
 */

exports.commands = [
    'clean'
];

exports.clean = {
    desc: "Clean up the bot's messages.",
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.purge(100, m => m.author.id === bot.user.id).then(amt => {
                return ctx.msg.channel.createMessage(`Cleaned \`${amt}\``);
            }).then(resolve).catch(reject);
        });
    }
};
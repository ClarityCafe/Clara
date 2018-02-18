/**
 * @file Clean only the bots messages.
 * @author Ovyerus
 */

exports.commands = [
    'clean'
];

function deleteDelay(msg) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            msg.delete().then(resolve).catch(reject);
        }, 2000);
    });
}

exports.clean = {
    desc: 'Clean messages created by the bot.',
    async main(bot, ctx) {
        let msgs = await ctx.channel.getMessages(100);
        let amt = await Promise.all(msgs.filter(m => m.author.id === bot.user.id).map(m => m.delete()));
        let m = await ctx.createMessage('clean', null, 'channel', {amt: amt.length});

        await deleteDelay(m);
    }
};
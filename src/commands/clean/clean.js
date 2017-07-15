/**
 * @file Clean only the bots messages.
 * @author Ovyerus
 */

/* eslint-env node */

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
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.channel.getMessages(100).then(msgs => {
                let delet = [];
                msgs = msgs.filter(m => m.author.id === bot.user.id);
                msgs.forEach(m => delet.push(m.delete()));
                return Promise.all(delet);
            }).then(amt => ctx.createMessage('clean', null, 'channel', {amt: amt.length})).then(deleteDelay).then(resolve).catch(reject);
        });
    }
};
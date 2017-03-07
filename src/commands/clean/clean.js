/*
 * clean.js - Clean only the bots messages.
 * 
 * Contributed by Ovyerus
 */

exports.commands = [
    'clean'
];

function deleteDelay(msg) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            msg.delete().then(() => resolve()).catch(reject);
        }, 1000);
    });
}

exports.clean = {
    desc: 'clean messages created by the bot itself',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.getMessages(100).then(msgs => {
                let delet = [];
                msgs = msgs.filter(m => m.author.id === bot.user.id);
                msgs.forEach(m => delet.push(m.delete()));
                return Promise.all(delet);
            }).then(amt => ctx.msg.channel.createMessage(`cleaned ${amt.length} ${amt.length === 1 ? 'message' : 'messages'}`)).then(deleteDelay).then(() => resolve).catch(reject);
        });
    }
};

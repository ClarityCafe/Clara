/*
 * Ship Command
 * 
 * Blame Kawaiibot
 * 
 * Contributed by Capuccino
 */

exports.commands = [
    'ship'
];

exports.ship = {
    desc: 'Happy Shipping!',
    usage: '<2 Names (Mention or Regular Msg)>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.msg.mentions.length > 2 || ctx.args.length > 2) {
                ctx.msg.channel.createMessage('Give me at least two names').then(() => reject(new Error('Now you fucked up.'))).catch(reject);
            } else {
                let a = ctx.msg.mentions[0] === undefined ? ctx.args[0] : ctx.msg.mentions[0].username;
                let b = ctx.msg.mentions[1] === undefined ? ctx.args[1] : ctx.msg.mentions[1].username; 
                let result = a.substring(0, Math.floor(a.length / 2)) + b.substring(Math.floor(b.length / 2));

                ctx.msg.channel.createMessage(`Happy Shipping!\n Your ship name is : **${result}**!`).then(() => resolve).catch(reject);
            }
        });
    }
};
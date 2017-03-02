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
    desc: 'basically a ship command.',
    longDesc: 'Happy Shipping!',
    usage: '<user Mention (Maximum 2)>',
    main: (bot, ctx) => {
        return new Promise((resolve,reject) => {
            if(ctx.msg.mentions.length < 2) {
                ctx.msg.channel.createMessage('Specify at least two users').then(() => reject(new Error('No User Specified'))).catch(reject);
            } else {
                //placeholder lets for now 
                let waifu1 = ctx.msg.mentions[0];
                let waifu2 = ctx.msg.mentions[1];
                let result = waifu1.username.substring(0, Math.floor(waifu1.username.length / 2)) + waifu2.username.substring(Math.floor(waifu2.username.length / 2));
                ctx.msg.channel.createMessage(`Happy Shipping!\n Your ship name is **${result}**`);
            }
        });
    }
};
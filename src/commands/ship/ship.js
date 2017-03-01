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
                let user1 = ctx.msg.mentions[1];
                let user2 = ctx.msg.mentions[2];
                let result = user1.username.substring(0, Math.floor(user1.username.length / 2)) + user2.username.substring(Math.floor(user2.username.length / 2));
                ctx.msg.channel.createMessage({embed : {
                    title: 'Happy Shipping!',
                    color: 0xFD7BB5,
                    fields : [
                        {name: 'Your Ship name is', value: result, inline: true}
                    ],
                    footer: "We are not solely responsible for anyone's broken heart resulting from your ship."
                }}).then(() => resolve).catch(reject);
            }
        });
    }
};
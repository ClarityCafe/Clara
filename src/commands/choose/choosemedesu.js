/*
 * choose.js - Make the bot choose your stupid life decisions.
 * 
 * Contributed by Capuccino and Ovyerus
 */



exports.commands = [
    'choose'
];

exports.choose = {
    desc: 'Randomly chooses between 2 or more arguments.',
    fullDesc: 'Uses a randomiser to pick a random value out of 2 or more given arguments. Arguments must be seperated by a /',
    usage: '<choices (minimum of two)>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            let choices = ctx.suffix.split('/');
            if (choices.length < 2) {
                ctx.msg.channel.createMessage('Please give me at least `two` (2) choices.').then(resolve).catch(reject);
            } else {
                var choice = choices[Math.floor(Math.random() * choices.length)];
                ctx.msg.channel.createMessage(`**${ctx.msg.author.username}**, I choose **${choice}**!`).then(resolve).catch(reject);
            }
        });
    }
};
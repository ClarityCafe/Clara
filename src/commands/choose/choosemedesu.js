/*
 * choose - make the bot choose your stupid life decisions
 * Contributed by Capuccino
 * Core Command Module for owo-whats-this 
 */

'use strict';
exports.commands = [
    "choose",
];

exports.choose = {
    //I would smack Recchan if this doesn't work uwu.
    description: "Just like decide, only it selects through a set of given parameters.",
    usage: "<option(minimum of 2)>",
    process: function(bot, ctx) {
        if (ctx.args.length >= 2) {
            ctx.msg.channel.sendMessage(`I choose \`${ctx.args[Math.floor(ctx.args.length * Math.random())]}\`!`);
        } else {
            ctx.msg.channel.sendMessage('Please supply at least two things to choose from.');
        }
    }
}
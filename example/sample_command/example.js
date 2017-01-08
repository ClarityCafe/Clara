/*
 * example.js - Example command to show basic structure of commands.
 * 
 * Contributed by Capuccino, Ovyerus.
 */

const Promise = require('bluebird');

exports.commands = [
    // Define the names of your commands here.
    'ping',
    'pong'
];

// Example ping command.
exports.ping = {
    desc: '',
    fullDesc: '',
    adminOnly: true,
    usage: '',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage('Ping!').then(() => resolve()).catch(err => reject([err]));
        });
    }
}

// Example pong command (demonstrating a full command, and multiple commands in a file).
exports.pong = {
    desc: 'Ping!',
    fullDesc: 'Simple response command.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage('Pong!').then(() => resolve()).catch(err => reject([err]));
        });
    }
}
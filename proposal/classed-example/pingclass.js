/* 
* a ping-pong example of a command that runs inside a class.
* Proposal by Capuccino.
* This is open for fixes and review
*/

//this Proposal is an attempt to structurize the command code schema
// and fully use the ES6 class features.
// NOTE: this would cause a breakpoint in Nodev4 due to having no stricts.
exports.commands = [
    'ping'
];
const Promise = require('bluebird');

//the actual method inside a class
class ping {
    //whats a eslint
    constructor(desc, fullDesc, main) {
        this.desc = 'abal is cute w';
        this.fullDesc = 'loret ipsum abalabahahahahahafuckdisshiet';
        this.main = (bot, ctx) => {
            return new Promise((resolve, reject) => {
                ctx.msg.channel.sendMessage('Ping!').then(() => resolve()).catch(err => reject([err]));
            });
        };
    }
}

//we will still use exports.cmdName :>
exports.ping = ping;
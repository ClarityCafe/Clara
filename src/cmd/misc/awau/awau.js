/**
 * @file Awau
 * @author Capuccino
 * @author Ovyerus
 */

const fs = require('fs');

exports.commands = [
    'awau'
];

exports.awau = {
    desc: 'Awaus at you.',
    async main(bot, ctx) {
        let files = fs.readdirSync('./assets/awau');
        let file = fs.readFileSync(`./assets/awau/${files[Math.floor(Math.random() * files.length)]}`);
        
        await ctx.channel.sendTyping();
        await ctx.createMessage('', {file, name: 'awau.png'});
    } 
};
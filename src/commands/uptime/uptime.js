exports.commands = [
    'uptime'
];

const Promise = require('bluebird');
const util = require(`${_baseDir}/lib/util.js`);

exports.uptime = {
    desc: 'Check uptime of the bot.',
    fullDesc: "Used to check the bot's operation length.",
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.sendMessage(`\`${util.msToTime(bot.uptime)}\``).then(() => resolve()).catch(err => reject([err]));
        });
    }
}
exports.commands = [
    "uptime"
];

import {parseMs} from '../../utilities.js';

exports.uptime = {
    desc: "Check uptime of the bot",
    longDesc: "Used to check the bot's operation length",
    main: function(bot, ctx) {
        ctx.msg.channel.sendMessage(parseMs(bot.uptime));
    }
}
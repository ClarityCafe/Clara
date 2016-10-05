/*
Flan ES6 by Capuccino
Original ES5 code by Ovyerus and MokouFujiwara
Licensed under MIT.
Copyright (c) 2016-2016 Capuccino, Ovyerus, MokouFujiwara, et al.
*/ 
//Framework imports
import {Discord} from "discord.js";
import {fs} from "fs";
import {util} from "util";
// constants
const config = require('./botConfig.json');
const bot = new Discord.Client({
    autoRecconect: true
});
//init method
bot.on("ready", function () {
    require('./init_commands.js').init();
    console.log("Auth token :" + config.auth);

});
//don't place anything here. commands has their own JS files
//empty class to call the commands. constructor is left empty.
class Commands { constructor() { } };
//synchronously works with init_commands.js. After init_commands checks for deps and returns a functioning command,
//this exports the following functioning command. Obsolete/broken commands aren't exported for a reason.
// we like to keep it that way.
exports.addCommand = function (commandName, commandObject) {
    try {
        commands[commandName] = commandObject;
    } catch (err) {
        console.log(err);
    }
}
exports.commandCount = function () {
    return Object.keys(commands).length;
};

bot.on("message", function () {
    //giant ass CMD thing CP'ed from flan-chanbot.
    if (msg.content.startsWith(config.prefix)) {
        const noPrefix = msg.content.substring(config.prefix.length, msg.content.length);
        const noPrefixSplit = noPrefix.split(" ");
        const cmd = noPrefixSplit[0];
        const preArgs = msg.content.substring(prefix.length + noPrefixSplit[0], msg.content.length);
        const args = preArgs.split(" ");
        const suffix = msg.content.substring(prefix.length + noPrefixSplit[0], msg.content.length);
        suffix.split();
        args.shift();
        if (commands[cmd] !== undefined) {
            if (commands[cmd].adminOnly) {
                fs.readFile('./adminList.json', (err, listData) => {
                    if (!err) {
                        var adminList = JSON.parse(listData);
                        if (adminList.indexOf(msg.author.id) > -1 || msg.author.id === config.ownerID) {
                            commands[cmd].main(bot, msg, args);
                        } else {
                            bot.sendMessage(msg, util.format('I\'m sorry, but you need to be on the admin list in order to run this command.'));
                        }
                    } else if (err) {
                        bot.sendMessage(msg, `Experienced error while trying to execute command \`${cmd}\`.
\`\`\`
${err}
\`\`\``);
                    }
                });
            } else {
                fs.readFile('./blackList.json', (err, blData) => {
                    if (!err) {
                        var blackList = JSON.parse(blData);
                        if (blackList.indexOf(msg.author.id) === -1) {
                            commands[cmd].main(bot, msg, args);
                        }
                    } else if (err) {
                        bot.sendMessage(msg, `Experienced error while trying to execute command \`${cmd}\`.
\`\`\`
${err}
\`\`\``);
                    }
                });
            }
        }
    }

    if (msg.content.startsWith("<@" + bot.user.id + "> prefix")) {
        bot.reply(msg.channel.id, "***My prefix is *** `" + prefix + "`!");
    }
})
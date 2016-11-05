/*
 * owo-whats this - Core file
 * Contributed by :
 * Capuccino (discord.js , discord.htc)
 * Ovyerus (discord.js)
 * nekonez (discord.htc)
 *
 * Licensed under MIT. Copyright (c) 2016 Capuccino, Ovyerus and the repository contributors.
 */

//Framework imports
const Discord = require("discord.js");
const fs = require("fs");
const util = require("util");
const JsonDB = require("node-json-db");

//Constants
const config = require('./config.json');
const bot = new Discord.Client();
const data = new JsonDB('data', true, true);

//Init
bot.on('ready', () => {
    require('./init_commands.js').init();
    console.log("Readying up! Initializing commands...");
    if (!data.data.admins) data.push('/', { admins: [] }, false);
    if (!data.data.blacklist) data.push('/', { blacklist: [] }, false);
    bot.config = config;
    bot.data = data;
});
//Don't place anything here, commands have their own JS files.
var commands = {};
//somehow Help doesn't work outside the core file. TODO: allow Help to work outside the core file.
commands.help = {
        name: "help",
        desc: "This help command.",
        longDesc: "The help command. Give it an argument to see more information about a command.",
        usage: "[command]",
        main: (bot, ctx) => {
            if (ctx.args.length === 0) {
                var helpStart = util.format("%s - %s\n", config.botName, config.botDesc);
                var helpThing = "";
                var cmd;
                for (cmd in commands) {
                    if (commands[cmd].usage !== undefined) {
                        var command = util.format("**%s %s** - %s\n", commands[cmd].name, commands[cmd].usage, commands[cmd].desc);
                        helpThing += command;
                    } else {
                        var command = util.format("**%s** - %s\n", commands[cmd].name, commands[cmd].desc);
                        helpThing += command;
                    }
                }
                ctx.msg.channel.sendMessage("Help has been sent to your DMs.")
                ctx.msg.channel.sendMessage(msg.author.id, helpStart + helpThing);
            } else if (args.length === 1) {
                var cmd = commands[args[0]];
                if (cmd !== undefined && cmd.usage !== undefined) {
                    ctx.msg.channelsendMessage(util.format("**%s %s** - %s", cmd.name, cmd.usage, cmd.longDesc));
                } else if (cmd !== undefined) {
                    ctx.msg.channel.sendMessage(msg, util.format("**%s** - %s", cmd.name, cmd.longDesc));
                } else if (cmd === undefined) {
                    ctx.msg.reply("I'm sorry, but that command does not seem to exist.");
                }
            }
        }
    }
    // Synchronously works with init_commands.js. After init_commands checks for deps and returns a functioning command,
    // this exports the following functioning command. Obsolete/broken commands aren't exported for a reason.
    // We like to keep it that way.
exports.addCommand = function(commandName, commandObject) {
    try {
        commands[commandName] = commandObject;
    } catch (err) {
        console.log(err);
    }
}
exports.commandCount = function() {
    return Object.keys(commands).length;
};

//TODO : fix errors on command handler

bot.on("message", msg => {
    //giant ass CMD thing CP'ed from flan-chanbot.
    if (msg.content.startsWith(config.prefix)) {
        const args = msg.content.substring(config.prefix.length, msg.content.length).split(' ');
        const cmd = args.shift();
        const suffix = args.join(' ');
        if (commands[cmd] !== undefined) {
            if (data.getData('/blacklist').indexOf(msg.author.id) !== -1) return;
            try {
                if (commands[cmd].adminOnly && data.getData('/admins').indexOf(msg.author.id) !== -1) {
                    commands[cmd].main(bot, { msg: msg, args: args, suffix: suffix });
                } else if (commands[cmd].adminOnly && data.data.getData('/admins').indexOf(msg.author.id) === -1) {
                    msg.channel.sendMessage('That command is restricted to the bot owner/s.');
                } else {
                    commands[cmd].main(bot, { msg: msg, args: args, suffix: suffix });
                }
            } catch (err) {
                console.log(err);
                var errMsg = `Unexpected error while executing commmand \`${cmd}\`\n`;
                errMsg += '```js\n';
                errMsg += err + '\n';
                errMsg += '```';
                msg.channel.sendMessage(errMsg);
            }
        }
    }

    if (msg.content.startsWith("<@" + bot.user.id + "> prefix")) {
        bot.reply(msg.channel.id, "***My prefix is *** `" + config.prefix + "`!");
    }
});
// if bot disconnects, this would pass up
bot.on("disconnected", () => {
    console.log("disconnected!, retrying...");
    try {
        !config.useEmail ? bot.login(config.token) : bot.login(config.email, config.password);
    } catch (err) {
        //let it terminate. PM2 will re-start the bot automatically.
        console.log("I tried. terminating...");
        process.exit(1);
    }
});

bot.on("guildMemberAdd", (member) => {
    //TODO: add a better guild exclusion
    return config.AllowGreets ? ctx.msg.author("Welcome to " + guild.name + "!!!") : null;
});

!config.useEmail ? bot.login(config.token) : bot.login(config.email, config.password);
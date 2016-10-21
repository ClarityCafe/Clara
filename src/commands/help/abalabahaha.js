exports.commands = [
    "help"
];
exports.help = {
    name: "help",
    desc: "This help command.",
    longDesc: "The help command. Give it an argument to see more information about a command.",
    usage: "[command]",
    main: function(bot, ctx) {
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
            ctx.msg.channel.sendMessage(msg, "Help has been sent to your DMs.")
            ctx.msg.author.sendMessage(helpStart + helpThing);
        } else if (ctx.args.length === 1) {
            var cmd = commands[args[0]];
            if (cmd !== undefined && cmd.usage !== undefined) {
                ctx.sendMessage(msg, util.format("**%s %s** - %s", cmd.name, cmd.usage, cmd.longDesc));
            } else if (cmd !== undefined) {
                ctx.sendMessage(msg, util.format("**%s** - %s", cmd.name, cmd.longDesc));
            } else if (cmd === undefined) {
                ctx.msg.reply(msg, "I'm sorry, but that command does not seem to exist.");
            }
        }
    }
}
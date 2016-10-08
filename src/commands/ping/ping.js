exports.commands = [
    "ping"
]
/*
insert useless command here 
*/
exports.ping = {
    desc: "Ping!",
    longDesc: "Ping the bot and check it's latency",
    main: function(bot, ctx) {
        ctx.msg.channel.sendMessage('Pong!').then(m => {
            m.edit(`Pong! \`${m.timestamp - ctx.msg.timestamp}ms\``);
        });
    }
}
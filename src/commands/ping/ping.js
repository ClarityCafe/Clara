exports.commands = [
    "ping"
]
/*
insert useless command here 
*/
exports.ping = {
    name: "ping",
    desc: "ping the bot!",
    longDesc : "ping the bot and check it's latency",
    main : function(bot,msg) {
        	var start = Date.now();
		bot.sendMessage(msg, 'Pong!').then(m => {
			var end = Date.now();
			var diff = end - start;
			bot.updateMessage(m, 'Pong! `' + diff + 'ms`');
		});
    }
}
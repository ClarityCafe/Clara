exports.commands = [
    "nyaa"
];
const azusa = require('random-cat');
exports.nyaa = {
    desc: "Nyaaa!",
    longDesc: "Ny- Nyaaaaaaaaaaaaaaaaaaaaaaaaaa~",
    main: function(bot, ctx) {
        var url = azusa.get();
        ctx.msg.channel.sendMessage(url + ` Nyaaaaaaaaaaaaaaaaaaaaaaaaaa~!`);
    }
}
exports.commands = [
    "nyaa"
];
const azusa = require('random-cat');
exports.nyaa = {
    desc: "Nyaaa!",
    longDesc: "Ny- Nyaaaaaaaaaaaaaaaaaaaaaaaaaa~",
    main: function(bot, ctx) {
        var url = azusa.get({
            // just to make sure Gus never whines
            //about ant-sized images.
            width: 1080,
            height: 1920
        });
        ctx.msg.channel.sendMessage(url);
    }
}
'use strict';
exports.commands = [
    "osu",
    "mania",
    "taiko",
    "ctb"
];
try {
    const Nodesu = require("nodesu");
    const config = require("../../config.json");
    var api = new Nodesu.client(config.osuApiKey);
} catch (err) {}

exports.osu = {
    desc: "your osu!standard stats",
    usage: '<osu! username>',
    main: function(bot, ctx) {
        if (ctx.args) {
            api.user.get(ctx.args[0], Nodesu.Mode.osu).then(data => ctx.msg.channel.sendMessage(data));
        } else {
            ctx.msg.channel.sendMessage('Please enter an argument to use as a name.');
        }
    }
}

exports.ctb = {
    desc: "your osu!ctach stats",
    usage: '<osu! username>',
    main: function(bot, ctx) {
        if (ctx.args) {
            api.user.get(ctx.args[0], Nodesu.Mode.ctb).then(data => ctx.msg.channel.sendMessage(data));
        } else {
            ctx.msg.channel.sendMessage('Please enter an argument to use as a name.');
        }
    }
}

exports.mania = {
    desc: "your osu!mania stats",
    usage: '<osu! username>',
    main: function(bot, ctx) {
        if (ctx.args) {
            api.user.get(ctx.args[0], Nodesu.Mode.osu).then(data => ctx.msg.channel.sendMessage(data));
        } else {
            ctx.msg.channel.sendMessage('Please enter an argument to use as a name.');
        }
    }
}

exports.taiko = {
    desc: "your osu!taiko stats",
    usage: '<osu! username>',
    main: function(bot, ctx) {
        if (ctx.args) {
            api.user.get(ctx.args[0], Nodesu.Mode.osu).then(data => ctx.msg.channel.sendMessage(data));
        } else {
            ctx.msg.channel.sendMessage('Please enter an argument to use as a name.');
        }
    }
}
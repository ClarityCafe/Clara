/*
 * osu - osu!stats checker
 * powered by Nodesu.
 * Contributed by Capuccino.
 * Complementary Community Command Module for owo-whats-this and osu!Discord. 
 */

//TODO: fix this.

'use strict';
exports.commands = [
    "osu",
    "mania",
    "taiko",
    "ctb"
];

//inb4 untested code
//blame Ovy if this doesn't work'
try {
    const Nodesu = require("nodesu");
    const config = require("../../config.json");
    var api = new Nodesu.client(config.osuApiKey);
} catch (err) {
    null;
}

exports.osu = {
    name: "osu",
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
    name: "ctb",
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
    name: "mania",
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
    name: "taiko",
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
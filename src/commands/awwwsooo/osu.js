'use strict';
exports.commands = [
  "osu",
  "mania",
  "taiko",
  "ctb"
];

const Nodesu = require("nodesu");

try {
  //try getting the API key.
var config = require("./botConfig.json")
var api = new Nodesu.client(config.osuApiKey);
}catch(err){
  //throw an error if a error within Nodesu or this script arises. log on console effectively.
  console.log(err.stack);
}

exports.osu = {
  name : "osu",
  desc: "your osu!standard stats",
  main : function (bot,msg, suffix){
    var user = suffix.split(" ");
    api.user.get(user , Nodesu.Mode.osu).then(data => bot.sendMessage(msg.channel, data));
  }
}
exports.ctb = {
  name: "ctb",
  desc: "your osu!ctach stats",
  main: function (bot,msg,suffix){
       var user = suffix.split(" ");
    api.user.get(user , Nodesu.Mode.ctb).then(data => bot.sendMessage(msg.channel, data));
  }
}
exports.mania = {
  name : "mania",
  desc: "your osu!mania stats",
  main : function (bot,msg,suffix){
    var user = suffix.split(" ");
    api.user.get(user, Nodesu.Mode.mania).then(data => bot.sendMessage(msg.channel, data))
  }
}
exports.taiko = {
    name : "taiko",
  desc: "your osu!taiko stats",
  main : function (bot,msg,suffix){
    var user = suffix.split(" ");
    api.user.get(user, Nodesu.Mode.taiko).then(data => bot.sendMessage(msg.channel, data))
  }
}

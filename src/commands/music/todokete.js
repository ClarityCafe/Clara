exports.commands = [
    "play",
    "add",
    "remove",
    "clear",
    "queue"
];
const request = require('request');
const fs = require('fs');
const youtubedl = require('youtube-dl');
const m3u8 = require('mu38');
const stream = require('stream');

var startup
var inviteURL;
var permissions = '0';
var music = {
    summoners: {};
    votes: {};
    songQ: {};
    streams: {};
}
fs.mkdir('songs', 0777, function(err) {
    if (err) {
        if (err.code == "EEXIST") return;
        else throw err;
    }
});
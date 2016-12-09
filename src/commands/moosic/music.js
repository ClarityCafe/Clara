/* Music Command
 *
 * Contributed by Capuccino
 *
 */
exports.commands = [
    "play",
    "skip",
    "disconnect",
];

const Promise = require('bluebird');
const ytdl = require('youtube-dl');
var queue = [];
var nowPlaying = '';
var votes = {};

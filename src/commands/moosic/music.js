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



exports.play = {
    desc: 'nani sore wat the fuck are u doing ovy aaaaaaa',
    usage: '<YT Link/Song Link>',
    main: (bot, ctx) => {
        return new Promise((reject, resolve) => {
            if (ctx.suffix) {
                ytdl('');
            }
        });
    }
};

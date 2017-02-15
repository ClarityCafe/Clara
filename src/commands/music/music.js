/* 
 * music.js - Music commands.
 *
 * Contributed by Capuccino and Ovyerus
 */

const ytdl = require('ytdl-core');
const ytSearch = require('youtube-search');
const utils = require(`${__baseDir}/lib/utils.js`);
const Eris = require('eris');

exports.commands = [
    'play',
    'stop',
    'sources',
    'skip',
    'join',
    'leave',
    'queue'
];

var exposed = {};

exports.play = {
    desc: 'Play music from supported sources.',
    longDesc: 'Plays music from supported sources and joins if needed.',
    usage: '<URL|search term>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            exposed.bot = bot;
            if (!ctx.suffix && !bot.music.queues.get(ctx.msg.channel.guild.id)) {
                ctx.msg.channel.createMessage('Please tell me something to play.').then(resolve).catch(reject);
            } else {
                if (!ctx.msg.member.voiceState.channelID) {
                    ctx.msg.channel.createMessage('You are not in a voice channel.').then(resolve).catch(reject);
                } else {
                    if (ctx.suffix) {
                        if (!ytRegex(ctx.suffix) && !/^https?:\/\//.test(ctx.suffix) && bot.config.ytSearchKey) {
                            search(ctx.msg, ctx.suffix).then(res => {
                                if (!(res instanceof Eris.Message)) {
                                    play(res.msg, res.url).then(resolve).catch(reject);
                                } else {
                                    resolve();
                                }
                            }).catch(reject);
                        } else if (!ytRegex(ctx.suffix) && !/^https?:\/\//.test(ctx.suffix) && !bot.config.ytSearchKey) {
                            ctx.msg.channel.createMessage('API key to search appears to be missing. Please queue songs via a link.').then(resolve).catch(reject);
                        } else if (ytRegex(ctx.suffix)) {
                            play(ctx.msg, ctx.suffix).then(resolve).catch(reject);
                        }
                    } else if (bot.music.queues.get(msg.channel.guild.id)) {
                        let q = bot.music.queues.get(msg.channel.guild.id).q;
                        play(q[0].msg, q[0].url).then(resolve).catch(reject);
                    }
                }
            }
        });
    }
}

function ytRegex(str) {return /https?:\/\/(www\.)?youtube\.com\/watch\?v=.+(&.+)?/.test(str) || /https?:\/\/youtu\.be\/.+/.test(str)}

function search(msg, terms) {
    return new Promise((resolve, reject) => {
        let bot = exposed.bot;
        ytSearch(terms, {maxResults: 10, key: bot.config.ytSearchKey}, (err, res) => {
            if (err) {
                reject(err);
            } else {
                res = res.filter(r => r.kind === 'youtube#video');
                if (res.length > 0) {
                    let embed = {
                        title: 'Search Results',
                        description: 'Please choose one of the following choices below by just typing it s corresponding number.',
                        fields: []
                    }

                    for (let i = 0; i <= 4; i++) {
                        embed.fields.push({name: (i + 1) + ': ' + res[i].channelTitle, value: res[i].title});
                    }
                    msg.channel.createMessage({embed}).then(() => {
                        return bot.awaitMessage(msg.channel.id, msg.author.id);
                    }).then(m => {
                        if (/^[1-5]$/.test(m.content.split(' ')[0])) {
                            let choice = Number(m.content.split(' ')[0]) - 1;
                            choice = res[choice];
                            return {msg: m, url: choice.link}
                        } else {
                            return m.channel.createMessage('Invalid response.');
                        }
                    }).then(resolve).catch(reject);
                } else {
                    msg.channel.createMessage('No results found.').then(resolve).catch(reject);
                }
            }
        })
    });
}

function play(msg, vid) {
    return new Promise((resolve, reject) => {
        let bot = exposed.bot;
        if (!bot.music.connections.get(msg.channel.guild.id)) {
            queue(msg, vid).then(() => {
                return bot.joinVoiceChannel(msg.member.voiceState.channelID);
            }).then(cnc => {
                bot.music.connections.add(cnc);
                let q = bot.music.queues.get(msg.channel.guild.id).q;
                let stream = ytdl(q[0].url);
                cnc.play(stream);

                stream.on('info', info => {
                    msg.channel.createMessage({embed: {
                        title: 'Now Playing',
                        description: `${info.title}\n[Link](${info.video_url})`,
                        image: {url: info.iurlhq},
                        footer: {text: `Requested by ${utils.formatUsername(q[0].msg.member)}`}
                    }});
                });

                cnc.on('end', () => {
                    q.splice(0, 1);
                    if (q.length > 0) play(q[0].msg, q[0].url);
                });
            }).then(resolve).catch(reject);
        } else if (bot.music.connections.get(msg.channel.guild.id) && bot.music.queues.get(msg.channel.guild.id).q.length === 0) {
            queue(msg, vid).then(() => {
                let cnc = bot.music.connections.get(msg.channel.guild.id);
                let q = bot.music.queues.get(msg.channel.guild.id).q;
                let stream = ytdl(q[0].url);
                cnc.play(stream);

                stream.on('info', info => {
                    let q = bot.music.queues.get(msg.channel.guild.id).q;
                    msg.channel.createMessage({embed: {
                        title: 'Now Playing',
                        description: `${info.title}\n[Link](${info.video_url})`,
                        image: {url: info.iurlhq},
                        footer: {text: `Requested by ${utils.formatUsername(q[0].msg.member)}`}
                    }});
                });

                cnc.on('end', () => {
                    q.splice(0, 1);
                    if (q.length > 0) play(q[0].msg, q[0].url);
                });
            }).then(resolve).catch(reject);
        } else if (bot.music.connections.get(msg.channel.guild.id) && bot.music.queues.get(msg.channel.guild.id).q.length > 0 && bot.music.queues.get(msg.channel.guild.id).q[0].url === vid) {
            let cnc = bot.music.connections.get(msg.channel.guild.id);
            let q = bot.music.queues.get(msg.channel.guild.id).q;
            let stream = ytdl(q[0].url);
            cnc.play(stream);

            stream.on('info', info => {
                let q = bot.music.queues.get(msg.channel.guild.id).q;
                msg.channel.createMessage({embed: {
                    title: 'Now Playing',
                    description: `${info.title}\n[Link](${info.video_url})`,
                    image: {url: info.iurlhq},
                    footer: {text: `Requested by ${utils.formatUsername(q[0].msg.member)}`}
                }});
            });

            cnc.on('end', () => {
                q.splice(0, 1);
                if (q.length > 0) play(q[0].msg, q[0].url);
            });
            resolve();
        } else if (bot.music.connections.get(msg.channel.guild.id) && bot.music.queues.get(msg.channel.guild.id).q.length > 0 && bot.music.queues.get(msg.channel.guild.id).q[0].url !== vid) {
            queue(msg, vid).then(resolve).catch(reject);
        }
    });
}

function queue(msg, vid) {
    return new Promise((resolve, reject) => {
        let bot = exposed.bot;
        if (!bot.music.queues.get(msg.channel.guild.id)) {
            bot.music.queues.add({id: msg.channel.guild.id, q: []});
        }
        let q = bot.music.queues.get(msg.channel.guild.id).q;
        q.push({url: vid, requestee: msg.author.id, msg: msg, timestamp: Date.now()});
        getSongInfo(vid).then(info => {
            if (ytRegex(vid)) {
                return msg.channel.createMessage(`Queued **${info.title}** to position **${q.length}**.`);
            }
        }).then(resolve).catch(reject);
    });
}

function getSongInfo(song) {
    return new Promise((resolve, reject) => {
        if (ytRegex(song)) {
            ytdl.getInfo(song, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        }
    });
}
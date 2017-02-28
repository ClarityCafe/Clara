/* 
 * music.js - Music commands.
 *
 * Contributed by Capuccino and Ovyerus
 */

const ytdl = require('ytdl-core');
const ytSearch = require('youtube-search');
const utils = require(`${__baseDir}/lib/utils`);
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
    usage: '[URL|search term]',
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
                                    if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) > -1) bot.music.stopped.splice(bot.music.stopped.indexOf(ctx.msg.channel.guild.id), 1);
                                    play(res.msg, res.url).then(resolve).catch(reject);
                                } else {
                                    resolve();
                                }
                            }).catch(reject);
                        } else if (!ytRegex(ctx.suffix) && !/^https?:\/\//.test(ctx.suffix) && !bot.config.ytSearchKey) {
                            ctx.msg.channel.createMessage('API key to search appears to be missing. Please queue songs via a link.').then(resolve).catch(reject);
                        } else if (ytRegex(ctx.suffix)) {
                            if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) > -1) bot.music.stopped.splice(bot.music.stopped.indexOf(ctx.msg.channel.guild.id), 1);
                            play(ctx.msg, ctx.suffix).then(resolve).catch(reject);
                        }
                    } else if (bot.music.queues.get(ctx.msg.channel.guild.id) && bot.music.queues.get(ctx.msg.channel.guild.id).q.length > 0) {
                        if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) > -1) bot.music.stopped.splice(bot.music.stopped.indexOf(ctx.msg.channel.guild.id), 1);
                        let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                        play(q[0].msg, q[0].url).then(resolve).catch(reject);
                    }
                }
            }
        });
    }
};

exports.queue = {
    desc: 'Queue music and view current queue.',
    longDesc: 'If no arguments provided, shows contents of queue. If arguments are provided queues the song.',
    usage: '[URL|search term]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            exposed.bot = bot;
            if (!ctx.suffix) {
                if (!bot.music.queues.get(ctx.msg.channel.guild.id) || bot.music.queues.get(ctx.msg.channel.guild.id).q.length === 0) {
                    ctx.msg.channel.createMessage({embed: {
                        title: 'Music Queue',
                        description: 'Queue is more empty than my will to live. I mean... :eyes:'
                    }}).then(resolve).catch(reject);
                } else {
                    let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                    let description = `**${q.length} ${q.length === 1 ? 'item' : 'items'} in queue.${q.length > 10 ? 'Showing first 10 items.' : ''}**\n\n`;

                    for (let i in q) {
                        if (!q[i] || Number(q) === 9) break;
                        description += `**${(Number(i) + 1)}:** \`${q[i].info.title}\` (${q[i].info.uploader}) **[${timeFormat(q[i].info.length)}]**\n\n`;
                    }

                    let embed = {
                        title: 'Music Queue',
                        description,
                        footer: {text: q.length - 10 > 0 ? `${q.length - 10} more ${q.length - 10 === 1 ? 'item' : 'items'}.` : ''}
                    };

                    ctx.msg.channel.createMessage({embed}).then(resolve).catch(reject);
                }
            } else {
                exports.play.main(bot, ctx).then(resolve).catch(reject);
            }
        });
    }
};

exports.leave = {
    desc: 'Leaves voice channel and destroys all associated data.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!bot.music.connections.get(ctx.msg.channel.guild.id)) {
                ctx.msg.channel.createMessage('I am not in a voice channel.').then(resolve).catch(reject);
            } else {
                if (ctx.msg.member.voiceState.channelID !== bot.music.connections.get(ctx.msg.channel.guild.id).channelID) {
                    ctx.msg.channel.createMessage('You are not in my voice channel.').then(resolve).catch(reject);
                } else {
                    bot.music.connections.get(ctx.msg.channel.guild.id).disconnect();
                    ctx.msg.channel.createMessage('Left voice channel and destroyed associated data.').then(resolve).catch(reject);
                }
            }
        });
    }
};

exports.stop = {
    desc: 'Stops playing music and (optionally) clears the queue.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!bot.music.connections.get(ctx.msg.channel.guild.id)) {
                ctx.msg.channel.createMessage('I am not in a voice channel.').then(resolve).catch(reject);
            } else {
                if (ctx.msg.member.voiceState.channelID !== bot.music.connections.get(ctx.msg.channel.guild.id).channelID) {
                    ctx.msg.channel.createMessage('You are not in my voice channel.').then(resolve).catch(reject);
                } else {
                    bot.music.connections.get(ctx.msg.channel.guild.id).stopPlaying();
                    ctx.msg.channel.createMessage('Stopped playing audio. Would you like to clear the queue [y/N]?').then(() => {
                        return bot.awaitMessage(ctx.msg.channel.id, ctx.msg.author.id);
                    }).then(m => {
                        if (/y(es)?/i.test(m.content)) {
                            bot.music.queues.get(m.channel.guild.id).q = [];
                            return m.channel.createMessage('Music queue cleared.');
                        } else if (/no?/i.test(m.content)) {
                            if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) === -1) bot.music.stopped.push(ctx.msg.channel.guild.id);
                            return m.channel.createMessage('Keeping music queue.');
                        } else {
                            if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) === -1) bot.music.stopped.push(ctx.msg.channel.guild.id);
                            return m.channel.createMessage('Invalid response. Keeping music queue.');
                        }
                    }).then(resolve).catch(err => {
                        if (!err.resp) {
                            if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) === -1) bot.music.stopped.push(ctx.msg.channel.guild.id);
                            ctx.msg.channel.createMessage('Queue will not be cleared.').then(resolve).catch(reject);
                        } else {
                            reject(err);
                        }
                    });
                }
            }
        });
    }
};

exports.join = {
    desc: 'Join a voice channel without playing anything.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (bot.music.connections.get(ctx.msg.channel.guild.id)) {
                ctx.msg.channel.createMessage('I am already in a voice channel.').then(resolve).catch(reject);
            } else {
                if (!ctx.msg.member.voiceState.channelID) {
                    ctx.msg.channel.createMessage('You are not in a voice channel.').then(resolve).catch(reject);
                } else {
                    bot.joinVoiceChannel(ctx.msg.member.voiceState.channelID).then(cnc => {
                        bot.music.connections.add(cnc);
                        return ctx.msg.channel.createMessage(`Joined your voice channel. Run \`${bot.config.mainPrefix}play <song>\` to play something.`);
                    }).then(resolve).catch(reject);
                }
            }
        });
    }
};

exports.sources = {
    desc: 'View available music sources.',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage({embed: {
                title: 'Music Sources',
                description: '**Current supported music sources.**\n\n**YouTube**: `https://youtube.com/watch?v=id` or `https://youtu.be/id`'
            }}).then(resolve).catch(reject);
        });
    }
};

exports.skip = {
    desc: 'Vote skip current song. Admins can override.',
    longDesc: 'Votes to skip the current song playing. Skip limit is half of unmuted people in current channel. Admins can force skip.',
    usage: '[force (admin only)]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!bot.music.connections.get(ctx.msg.channel.guild.id)) {
                ctx.msg.channel.createMessage('I am not in a voice channel.').then(resolve).catch(reject);
            } else {
                if (ctx.msg.member.voiceState.channelID !== bot.music.connections.get(ctx.msg.channel.guild.id).channelID) {
                    ctx.msg.channel.createMessage('You are not in my voice channel.').then(resolve).catch(reject);
                } else {
                    if (!bot.music.connections.get(ctx.msg.channel.guild.id).playing) {
                        ctx.msg.channel.createMessage('I am not playing anything.').then(resolve).catch(reject);
                    } else {
                        if (!ctx.args[0] || ctx.args[0] !== 'force') {
                            if (!bot.music.skips.get(ctx.msg.channel.guild.id)) bot.music.skips.add({id: ctx.msg.channel.guild.id, count: 0, users: []});
                            let skips = bot.music.skips.get(ctx.msg.channel.guild.id);
                            if (!skips.users[ctx.msg.author.id]) {
                                skips.count++;
                                skips.users.push(ctx.msg.author.id);
                                let chan = bot.music.channels.get(bot.music.connections.get(ctx.msg.channel.guild.id).channelID);
                                if (skips.count >= Math.floor(chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf).length / 2)) {
                                    skips.count = 0;
                                    skips.users = [];
                                    let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                                    let qt = q[0];
                                    if (q[0].url === qt.url) {
                                        q.splice(0, 1);
                                        bot.music.connections.get(ctx.msg.channel.guild.id).stopPlaying();
                                        bot.music.streams.get(ctx.msg.channel.guild.id).stream.destroy();
                                        bot.music.streams.delete(ctx.msg.channel.guild.id);
                                    }
                                    if (q.length > 0) play(q[0].msg, q[0].url);
                                    ctx.msg.channel.createMessage(`Skipped **${qt.info.title}**.`).then(resolve).catch(reject);
                                    
                                } else {
                                    let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                                    ctx.msg.channel.createMessage(`**${utils.formatUsername(ctx.msg.member)}** has voted to skip **${q[0].info.title}**.\n**${skips.count}** skips out of **${Math.floor(chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf).length)}** needed.`).then(resolve).catch(reject);
                                }
                            } else {
                                ctx.msg.channel.createMessage('You have already voted to skip.').then(resolve).catch(reject);
                            }
                        } else if (ctx.args[0] === 'force') {
                            if (!ctx.msg.member.permission.has('administrator') || ctx.msg.author.id !== ctx.msg.channel.guild.ownerID || !utils.isOwner(ctx.msg.author.id) || !utils.isAdmin(ctx.msg.author.id)) {
                                ctx.msg.channel.createMessage('You require the Administrator permission to force skip.').then(resolve).catch(reject);
                            } else {
                                if (!bot.music.skips.get(ctx.msg.channel.guild.id)) bot.music.skips.add({id: ctx.msg.channel.guild.id, count: 0, users: []});
                                let skips = bot.music.skips.get(ctx.msg.channel.guild.id);
                                let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                                let qt = q[0];
                                skips.count = 0;
                                skips.users = [];
                                if (q[0].url === qt.url) {
                                    q.splice(0, 1);
                                    bot.music.connections.get(ctx.msg.channel.guild.id).stopPlaying();
                                    bot.music.streams.get(ctx.msg.channel.guild.id).stream.destroy();
                                    bot.music.streams.delete(ctx.msg.channel.guild.id);
                                }
                                if (q.length > 0) play(q[0].msg, q[0].url);
                                ctx.msg.channel.createMessage(`Skipped **${qt.info.title}**.`).then(resolve).catch(reject);
                            }
                        }
                    }
                }
            }
        });
    }
};

function ytRegex(str) {return /https?:\/\/(www\.)?youtube\.com\/watch\?v=.+(&.+)?/.test(str) || /https?:\/\/youtu\.be\/.+/.test(str);}

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
                        description: 'Please choose one of the following choices below by just typing its corresponding number.',
                        fields: []
                    };

                    for (let i = 0; i <= 4; i++) {
                        if (!res[i]) break;
                        embed.fields.push({name: (i + 1) + ': ' + res[i].channelTitle, value: res[i].title});
                    }

                    let outerMsg;
                    msg.channel.createMessage({embed}).then(m => {
                        outerMsg = m;
                        return bot.awaitMessage(msg.channel.id, msg.author.id);
                    }).then(m => {
                        if (/^[1-5]$/.test(m.content.split(' ')[0])) {
                            let choice = Number(m.content.split(' ')[0]) - 1;
                            choice = res[choice];
                            outerMsg.delete();
                            return {msg: m, url: choice.link};
                        } else {
                            outerMsg.delete();
                            return m.channel.createMessage('Invalid response.');
                        }
                    }).then(resolve).catch(reject);
                } else {
                    msg.channel.createMessage('No results found.').then(resolve).catch(reject);
                }
            }
        });
    });
}

function play(msg, url) {
    return new Promise((resolve, reject) => {
        let bot = exposed.bot;
        if (!bot.music.connections.get(msg.channel.guild.id)) {
            queue(msg, url).then(() => {
                return bot.joinVoiceChannel(msg.member.voiceState.channelID);
            }).then(cnc => {
                if (!bot.music.channels.get(cnc.channelID)) bot.music.channels.add(msg.channel.guild.channels.get(cnc.channelID));
                if (!bot.music.guilds.get(bot.guilds.get(cnc.id))) bot.music.guilds.add(bot.guilds.get(cnc.id));
                bot.music.connections.add(cnc);
                cnc.once('ready', () => {
                    let stream = ytdl(url);
                    bot.music.streams.add({id: msg.channel.guild.id, stream, type: 'YouTubeVideo'});
                    cnc.play(stream, {encoderArgs: ['-af "volume=0.5"']});

                    stream.on('info', function onYtInfo(info) {
                        msg.channel.createMessage({embed: {
                            title: 'Now Playing',
                            description: `${info.title}\n[Link](${info.video_url}) **[${timeFormat(info.length_seconds)}]**`,
                            image: {url: info.iurlhq},
                            footer: {text: `Requested by ${utils.formatUsername(msg.member)}`}
                        }});
                        this.removeListener('info', onYtInfo);
                    });

                    cnc.on('end', function onMusicEnd() {
                        if (cnc.playing || !bot.music.queues.get(msg.channel.guild.id) || bot.music.stopped.indexOf(msg.channel.guild.id) > -1) return;
                        let q = bot.music.queues.get(msg.channel.guild.id).q;
                        if (q[0].url === url) {
                            q.splice(0, 1);
                            bot.music.streams.get(msg.channel.guild.id).stream.destroy();
                            bot.music.streams.delete(msg.channel.guild.id);
                        }
                        if (q.length > 0) play(q[0].msg, q[0].url);
                        this.removeListener('end', onMusicEnd);
                    });
                });
            }).then(resolve).catch(reject);
        } else if (bot.music.connections.get(msg.channel.guild.id) && (!bot.music.queues.get(msg.channel.guild.id) || bot.music.queues.get(msg.channel.guild.id).q.length === 0)) {
            queue(msg, url).then(() => {
                let cnc = bot.music.connections.get(msg.channel.guild.id);
                let stream = ytdl(url);
                bot.music.streams.add({id: msg.channel.guild.id, stream, type: 'YouTubeVideo'});
                cnc.play(stream, {encoderArgs: ['-af "volume=0.5"']});

                stream.on('info', function onYtInfo(info) {
                    msg.channel.createMessage({embed: {
                        title: 'Now Playing',
                        description: `${info.title}\n[Link](${info.video_url}) **[${timeFormat(info.length_seconds)}]**`,
                        image: {url: info.iurlhq},
                        footer: {text: `Requested by ${utils.formatUsername(msg.member)}`}
                    }});
                    this.removeListener('info', onYtInfo);
                });

                cnc.on('end', function onMusicEnd() {
                    if (cnc.playing || !bot.music.queues.get(msg.channel.guild.id) || bot.music.stopped.indexOf(msg.channel.guild.id) > -1) return;
                    let q = bot.music.queues.get(msg.channel.guild.id).q;
                    if (q[0].url === url) {
                        q.splice(0, 1);
                        bot.music.streams.get(msg.channel.guild.id).stream.destroy();
                        bot.music.streams.delete(msg.channel.guild.id);
                    }
                    if (q.length > 0) play(q[0].msg, q[0].url);
                    this.removeListener('end', onMusicEnd);
                });
            }).then(resolve).catch(reject);
        } else if (bot.music.connections.get(msg.channel.guild.id) && bot.music.queues.get(msg.channel.guild.id).q.length > 0 && bot.music.queues.get(msg.channel.guild.id).q[0].url === url) {
            let cnc = bot.music.connections.get(msg.channel.guild.id);
            let stream = ytdl(url);
            bot.music.streams.add({id: msg.channel.guild.id, stream, type: 'YouTubeVideo'});
            cnc.play(stream, {encoderArgs: ['-af "volume=0.5"']});

            stream.on('info', function onYtInfo(info) {
                msg.channel.createMessage({embed: {
                    title: 'Now Playing',
                    description: `${info.title}\n[Link](${info.video_url}) **[${timeFormat(info.length_seconds)}]**`,
                    image: {url: info.iurlhq},
                    footer: {text: `Requested by ${utils.formatUsername(msg.member)}`}
                }});
                this.removeListener('info', onYtInfo);
            });

            cnc.on('end', function onMusicEnd() {
                if (cnc.playing || !bot.music.queues.get(msg.channel.guild.id) || bot.music.stopped.indexOf(msg.channel.guild.id) > -1) return;
                let q = bot.music.queues.get(msg.channel.guild.id).q;                
                if (q[0].url === url) {
                    q.splice(0, 1);
                    bot.music.streams.get(msg.channel.guild.id).stream.destroy();
                    bot.music.streams.delete(msg.channel.guild.id);
                }
                if (q.length > 0) play(q[0].msg, q[0].url);
                this.removeListener('end', onMusicEnd);
            });

            resolve();
        } else if (bot.music.connections.get(msg.channel.guild.id) && bot.music.queues.get(msg.channel.guild.id).q.length > 0 && bot.music.queues.get(msg.channel.guild.id).q[0].url !== url && bot.music.connections.get(msg.channel.guild.id).playing) {
            queue(msg, url).then(resolve).catch(reject);
        }
    });
}

function queue(msg, url) {
    return new Promise((resolve, reject) => {
        let bot = exposed.bot;
        if (!bot.music.queues.get(msg.channel.guild.id)) bot.music.queues.add({id: msg.channel.guild.id, q: []});
        let q = bot.music.queues.get(msg.channel.guild.id).q;

        getSongInfo(url).then(info => {
            if (ytRegex(url)) {
                let i = {title: info.title, uploader: info.author.name, length: info.length_seconds, type: 'YouTubeVideo'};
                q.push({url: url, requestee: msg.author.id, msg: msg, info: i, timestamp: Date.now()});
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

function timeFormat(secs) {
    let seconds = secs % 60;
    let minutes = (secs / 60) % 60;
    let hours = (minutes / 60) % 24;

    seconds = Math.floor(seconds);
    minutes = Math.floor(minutes);
    hours = Math.floor(hours);

    seconds.toString().length === 1 ? seconds = '0' + seconds.toString() : seconds = seconds.toString();
    minutes.toString().length === 1 && hours !== 0 ? minutes = '0' + minutes.toString() : minutes = minutes.toString();

    return `${hours === 0  ? '' : `${hours}:`}${minutes}:${seconds}`;
}
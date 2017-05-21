/*
 * music.js - Music streaming commands
 * 
 * Contributed by Ovyerus
 */

const MusicHandler = require(`${__dirname}/musicHandler`);
const got = require('got');
var handler;

exports.loadAsSubcommands = true;
exports.commands = [
    'play',
    'queue',
    'leave',
    'join',
    'nowplaying',
    'sources'
];

exports.init = bot => {
    if (!bot.config.soundCloudKey) {
        got('https://raw.githubusercontent.com/rg3/youtube-dl/master/youtube_dl/extractor/soundcloud.py').then(r => {
            bot.config.soundCloudKey = r.body.match(/_CLIENT_ID = '([A-Z0-9]+)'/i)[1];
            logger.info('SoundCloud key has been automatically scraped from Youtube-DL. If you do not wish for this to happen, please insert a key into the config.json manually.');
            handler = new MusicHandler(bot);
        }).catch(logger.error);
    } else {
        handler = new MusicHandler(bot);
    }
};

exports.main = {
    desc: 'Music commands'
};

exports.play = {
    desc: 'Play or queue a song.',
    usage: '[url|search terms]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix && !bot.music.queues.get(ctx.guild.id)) {
                ctx.createMessage('Please tell me something to play.').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('You are not in a voice channel.').then(resolve).catch(reject);
            } else {
                if (ctx.suffix) {
                    if (!urlRegex.test(ctx.suffix) && bot.config.ytSearchKey) {
                        handler.search(ctx, ctx.suffix).then(res => {
                            return handler.prePlay(ctx, res);
                        }).then(resolve).catch(err => {
                            if (err.message && err.message === 'Invalid selection (Number too high or not a number).') {
                                return ctx.createMessage(err.message);
                            } else {
                                reject(err);
                            }
                        }).then(resolve);
                    } else if (!urlRegex.test(ctx.suffix) && !bot.config.ytSearchKey) {
                        ctx.createMessage('Search token appears to be missing. Please queue songs via direct links.').then(resolve).catch(reject);
                    } else {
                        handler.prePlay(ctx, ctx.suffix).then(resolve).catch(reject);
                    }
                } else if (bot.music.queues.get(ctx.guild.id).queue.length > 0) {
                    let item = bot.music.queues.get(ctx.guild.id).queue[0];
                    handler.prePlay(item.ctx, item.url).then(resolve).catch(reject);
                } else {
                    ctx.createMessage('Please tell me something to play.').then(resolve).catch(reject);
                }
            }
        });
    }
};

exports.queue = {
    desc: 'View the current queue.',
    usage: '[page number]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let embed = {
                title: 'Music Queue'
            };

            if (!bot.music.queues.get(ctx.guild.id) || bot.music.queues.get(ctx.guild.id).queue.length === 0) {
                embed.description = 'Queue is more empty than my will to live. I mean... :eyes:';
                ctx.createMessage({embed}).then(resolve).catch(reject);
            } else {
                let q = bot.music.queues.get(ctx.guild.id).queue;

                let page = !Number(ctx.suffix) || Number(ctx.suffix) === 0 ? 0 : Number(ctx.suffix) - 1;
                let pageAmt = 10;
                let pages = Math.ceil(q.length / pageAmt);
                let thisPage = [];

                if (page <= pages) {
                    queuePaginate(q, page, pageAmt, thisPage);
                } else {
                    queuePaginate(q, 0, pageAmt, thisPage);
                }

                if (pages > 1) {
                    embed.footer = {text: `Page ${page + 1}/${pages}`};
                    embed.fields = [{
                        name: `${q.length} items in queue`, value: thisPage.join('\n')
                    }];
                } else {
                    embed.description = thisPage.join('\n');
                }

                ctx.createMessage({embed}).then(resolve).catch(reject);
            }
        });
    }
};

exports.nowplaying = {
    desc: 'Show what song is now playing.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if ((bot.music.connections.get(ctx.guild.id) && !bot.music.connections.get(ctx.guild.id).playing) || !bot.music.queues.get(ctx.guild.id) || bot.music.queues.get(ctx.guild.id).queue.length === 0) {
                ctx.createMessage('I am currently not playing anything.').then(resolve).catch(reject);
            } else {
                let {info: item, ctx: c} = bot.music.queues.get(ctx.guild.id).queue[0];
                let embed = {
                    author: {name: 'Now Playing'},
                    title: item.title,
                    description: `Duration: ${typeof item.length === 'string'? item.length : timeFormat(item.length)}, [**Link**](${item.url})`,
                    color: utils.randomColour(),
                    image: {url: item.thumbnail},
                    footer: {
                        text: `Queued by ${utils.formatUsername(c.member)} | ${item.type}`
                    }
                };

                ctx.createMessage({embed}).then(resolve).catch(reject);
            }
        });
    }
};

exports.join = {
    desc: 'Joins a voice channel.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (bot.music.connections.get(ctx.guild.id)) {
                ctx.createMessage('I am already in a voice channel.').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('You are not in a voice channel.').then(resolve).catch(reject);
            } else {
                bot.joinVoiceChannel(ctx.member.voiceState.channelID).then(cnc => {
                    bot.music.inactives.push([bot.guilds.get(cnc.id).channels.get(cnc.channelID), Date.now()]);
                    return ctx.createMessage(`Joined your voice channel. Run \`${bot.config.mainPrefix}music play <song>\` to play something.`);
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.leave = {
    desc: 'Leave the voice channel.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!bot.music.connections.get(ctx.guild.id)) {
                ctx.createMessage('I am not in a voice channel.').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('You are not in a voice channel.').then(resolve).catch(reject);
            } else if (ctx.member.voiceState.channelID !== bot.music.connections.get(ctx.guild.id).channelID) {
                ctx.createMessage('You are not in my voice channel.').then(resolve).catch(reject);
            } else {
                let cnc = bot.music.connections.get(ctx.guild.id);
                cnc.stopPlaying();
                bot.leaveVoiceChannel(cnc.channelID);
                ctx.createMessage('Left the voice channel and destroyed music data.').then(resolve).catch(reject);
            }
        });
    }
};

exports.sources = {
    desc: 'Show all available sources for music.',
    main(bot, ctx) {
        return ctx.createMessage({embed: {
            title: 'Music Sources',
            description: '**YouTube**: `https://youtube.com/watch?v=ID | https://youtu.be/ID`\n'
            + '**SoundCloud**: `https://soundcloud.com/USER/SONG`\n'
            + '**Clyp**: `https://clyp.it/ID`\n'
            + '**Twitch**: `https://twitch.tv/USER`\n'
            + '**YouTube Playlist**: `https://youtube.com/playlist?list=ID`\n'
            + '**SoundCloud Playlist**: `https://soundcloud.com/USER/sets/NAME`\n'
        }});
    }
};

function queuePaginate(q, page, pageAmt, collect) {
    for (let i = page * pageAmt; i < page * pageAmt + pageAmt; i++) {
        if (!q[i]) break;
        collect.push(`**${Number(i) + 1}.** \`${q[i].info.title}\` (${q[i].info.uploader}) **[${timeFormat(q[i].info.length)}]**`);
    }
}

function timeFormat(secs) {
    let all = [secs / 60 / 60, secs / 60 % 60, secs % 60];

    for (let i in all) {
        all[i] = Math.floor(all[i]);
        all[i] = all[i].toString().length === 1 ? `0${all[i]}` : all[i];
    }

    return all[0] === '00' ? all.slice(1).join(':') : all.join(':');
}

const urlRegex = /^(?:(?:https?:)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
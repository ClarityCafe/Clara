/**
 * @file Music streaming commands
 * @author Ovyerus
 * 
 * @todo Locales, again.
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
    'np',
    'sources',
    'skip',
    'clear',
    'dump'
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
                ctx.createMessage('music-playNoArgs').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('music-userNotInChannel').then(resolve).catch(reject);
            } else {
                if (ctx.suffix) {
                    if (!urlRegex.test(ctx.suffix) && bot.config.ytSearchKey) {
                        handler.search(ctx, ctx.suffix).then(res => {
                            return handler.prePlay(ctx, res);
                        }).then(resolve).catch(err => {
                            if (err.message && err.message === 'Invalid selection (Number too high or not a number).') {
                                return ctx.createMessage('music-searchBadSelection');
                            } else if (err.message && err.message === 'No search results.') {
                                return ctx.createMeessage('music-searchNoResults');
                            } else {
                                reject(err);
                            }
                        }).then(resolve);
                    } else if (!urlRegex.test(ctx.suffix) && !bot.config.ytSearchKey) {
                        ctx.createMessage('music-noSearchToken').then(resolve).catch(reject);
                    } else {
                        handler.prePlay(ctx, ctx.suffix).then(resolve).catch(reject);
                    }
                } else if (bot.music.queues.get(ctx.guild.id).queue.length > 0) {
                    let item = bot.music.queues.get(ctx.guild.id).queue[0];
                    handler.prePlay(item.ctx, item.url).then(resolve).catch(reject);
                } else {
                    ctx.createMessage('music-playNoArgs').then(resolve).catch(reject);
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
                title: 'music-queueTitle'
            };

            if (!bot.music.queues.get(ctx.guild.id) || bot.music.queues.get(ctx.guild.id).queue.length === 0) {
                embed.description = 'music-queueEmpty';
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
                    embed.footer = {text: 'music-queueFooter'};
                    embed.fields = [{
                        name: 'music-queueTotalItems', value: thisPage.join('\n')
                    }];
                } else {
                    embed.description = thisPage.join('\n');
                }

                ctx.createMessage({embed}, null, 'channel', {
                    page: page + 1,
                    total: pages,
                    items: q.length
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.np = {
    desc: 'Show what song is now playing.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if ((bot.music.connections.get(ctx.guild.id) && !bot.music.connections.get(ctx.guild.id).playing) || !bot.music.queues.get(ctx.guild.id) || bot.music.queues.get(ctx.guild.id).queue.length === 0) {
                ctx.createMessage('music-notPlaying').then(resolve).catch(reject);
            } else {
                let {info: item, ctx: c} = bot.music.queues.get(ctx.guild.id).queue[0];
                let embed = {
                    author: {name: 'music-nowPlayingTitle'},
                    title: item.title,
                    description: 'music-nowPlayingInfo',
                    color: utils.randomColour(),
                    image: {url: item.thumbnail},
                    footer: {
                        text: 'music-nowPlayingFooter'
                    }
                };

                ctx.createMessage({embed}, null, 'channel', {
                    duration: typeof item.length === 'string' ? item.length : timeFormat(item.length),
                    url: item.url,
                    user: utils.formatUsername(c.member),
                    type: item.type
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.join = {
    desc: 'Joins a voice channel.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (bot.music.connections.get(ctx.guild.id)) {
                ctx.createMessage('music-botInChannel').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('music-userNotInChannel').then(resolve).catch(reject);
            } else {
                bot.joinVoiceChannel(ctx.member.voiceState.channelID).then(cnc => {
                    bot.music.inactives.push([bot.guilds.get(cnc.id).channels.get(cnc.channelID), Date.now()]);
                    bot.music.connections.get(ctx.guild.id).summoner = ctx.member;
                    return ctx.createMessage('music-join', null, 'channel', {
                        prefix: bot.config.mainPrefix
                    });
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.leave = {
    desc: 'Leave the voice channel.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let cnc = bot.music.connections.get(ctx.guild.id);

            if (!cnc) {
                ctx.createMessage('music-botNotInChannel').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('music-userNotInChannel').then(resolve).catch(reject);
            } else if (ctx.member.voiceState.channelID !== cnc.channelID) {
                ctx.createMessage('music-userNotSameChannel').then(resolve).catch(reject);
            } else if (cnc.summoner && cnc.summoner.id !== ctx.author.id && !ctx.hasPermission('manageGuild', 'author')) {
                ctx.createMessage('music-userNotSummoner').then(resolve).catch(reject);
            } else {
                let cnc = bot.music.connections.get(ctx.guild.id);
                cnc.stopPlaying();
                bot.leaveVoiceChannel(cnc.channelID);
                ctx.createMessage('music-leave').then(resolve).catch(reject);
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

exports.skip = {
    desc: 'Skip the current playing song.',
    usage: '[force]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!bot.music.connections.get(ctx.guild.id)) {
                ctx.createMessage('music-botNotInChannel').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('music-userNotInChannel').then(resolve).catch(reject);
            } else if (ctx.member.voiceState.channelID !== bot.music.connections.get(ctx.guild.id).channelID) {
                ctx.createMessage('music-userNotSameChannel').then(resolve).catch(reject);
            } else if (!bot.music.connections.get(ctx.guild.id).playing) {
                ctx.createMessage('music-notPlaying').then(resolve).catch(reject);
            } else if (ctx.args[0] !== 'force') {
                if (!bot.music.skips.get(ctx.guild.id)) bot.music.skips.add({id: ctx.guild.id, users: []});
                let skips = bot.music.skips.get(ctx.guild.id);

                if (!skips.users.includes(ctx.author.id)) {
                    skips.users.push(ctx.author.id);
                    let chan = ctx.guild.channels.get(bot.music.connections.get(ctx.guild.id).channelID);

                    if (skips.users.length >= Math.floor(chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf && !m.voiceState.deaf && m.id !== bot.id).length)) {
                        skips.users = [];
                        let track = bot.music.queues.get(ctx.guild.id).queue[0].info;

                        bot.music.connections.get(ctx.guild.id).stopPlaying();
                        ctx.createMessage('music-skip', null, 'channel', {
                            item: track.title
                        }).then(resolve).catch(reject);
                    } else {
                        let track = bot.music.queues.get(ctx.guild.id).queue[0].info;
                        let chan = ctx.guild.channels.get(bot.music.connections.get(ctx.guild.id).channelID);

                        ctx.createMessage('music-skipVote', null, 'channel', {
                            usage: utils.formatUsername(ctx.member),
                            item: track.title,
                            votes: skips.users.length,
                            total: chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf && !m.voiceState.deaf)
                        }).then(resolve).catch(reject);
                    }
                }
            } else if (ctx.args[0] === 'force' && !(bot.checkBotPerms(ctx.author.id) || ctx.hasPermission('manageGuild', 'author'))) {
                ctx.createMessage('music-skipCantForce').then(resolve).catch(reject);
            } else {
                if (!bot.music.skips.get(ctx.guild.id)) bot.music.skips.add({id: ctx.guild.id, users: []});
                let skips = bot.music.skips.get(ctx.guild.id);
                let track = bot.music.queues.get(ctx.guild.id).queue[0].info;
                skips.users = [];

                bot.music.connections.get(ctx.guild.id).stopPlaying();
                ctx.createMessage('music-skip', null, 'channel', {
                    item: track.title
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.clear = {
    desc: 'Clears the music queue.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let cnc = bot.music.connections.get(ctx.guild.id);
            let q = bot.music.queues.get(ctx.guild.id);

            if (!cnc) {
                ctx.createMessage('music-botNotInChannel').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('music-userNotInChannel').then(resolve).catch(reject);
            } else if (ctx.member.voiceState.channelID !== cnc.channelID) {
                ctx.createMessage('music-userNotSameChannel').then(resolve).catch(reject);
            } else if (cnc.summoner && cnc.summoner.id !== ctx.author.id && !ctx.hasPermission('manageGuild', 'author')) {
                ctx.createMessage('music-userNotSummoner').then(resolve).catch(reject);
            } else if (!q || q.queue.length === 0) {
                ctx.createMessage('music-clearEmptyQueue').then(resolve).catch(reject);
            } else {
                ctx.createMessage('music-clearConfirm').then(() => {
                    return bot.awaitMessage(ctx.channel.id, ctx.author.id);
                }).then(m => {
                    if (/^y(es)?$/i.test(m.content)) {
                        return ctx.createMessage('music-clearConfirmYes');
                    } else if (/^no?$/i.test(m.content)) {
                        return ctx.createMessage('music-clearConfirmNo');
                    } else {
                        return ctx.createMessage('music-clearaConfirmInvalid');
                    }
                }).then(m => {
                    if (m.content === localeManager.t('music-clearConfirmNo')) {
                        q.queue = [q.queue[0]];

                        return ctx.createMessage('music-cleared');
                    } else {
                        bot.music.connections.get(ctx.guild.id).stopPlaying();
                        bot.music.queues.get(ctx.guild.id).queue = [];

                        return ctx.createMessage('music-clearedStoppedPlaying');
                    }
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.dump = {
    desc: 'Dumps the contents of the current playlist to a text file.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let cnc = bot.music.connections.get(ctx.guild.id);
            let q = bot.music.queues.get(ctx.guild.id);

            if (!cnc) {
                ctx.createMessage('music-botNotInChannel').then(resolve).catch(reject);
            } else if (!ctx.member.voiceState.channelID) {
                ctx.createMessage('music-userNotInChannel').then(resolve).catch(reject);
            } else if (ctx.member.voiceState.channelID !== cnc.channelID) {
                ctx.createMessage('music-userNotSameChannel').then(resolve).catch(reject);
            } else if (!q || q.queue.length === 0) {
                ctx.createMessage('music-dumpEmptyQueue').then(resolve).catch(reject);
            } else {
                q = q.queue.map(i => {return {title: i.info.title, url: i.info.url};});

                ctx.createMessage('music-dumpConfirm', null, 'channel', {
                    amount: q.length
                }).then(() => {
                    return bot.awaitMessage(ctx.channel.id, ctx.author.id);
                }).then(m => {
                    if (/^y(es)?$/i.test(m.content)) {
                        return ctx.createMessage('music-dumpConfirmYes');
                    } else if (/^no?$/i.test(m.content)) {
                        return ctx.createMessage('music-dumpConfirmNo');
                    } else {
                        return ctx.createMessage('music-dumpConfirmInvalid');
                    }
                }).then(m => {
                    if (m.content === localeManager.t('music-dumpConfirmYes', ctx.settings.locale)) {
                        return bot.hastePost(q.map(i => `${i.title} - ${i.url}`).join('\n'));
                    } else {
                        return null;
                    }
                }).then(res => {
                    if (!res) return null;

                    return ctx.createMessage('music-dumped', null, 'channel', {
                        url: `https://hastebin.com/${res}.txt`
                    });
                }).then(resolve).catch(reject);
            }
        });
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
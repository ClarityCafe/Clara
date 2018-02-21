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
    if (!bot.config.tokens.soundcloud) {
        got('https://raw.githubusercontent.com/rg3/youtube-dl/master/youtube_dl/extractor/soundcloud.py').then(r => {
            bot.config.tokens.soundcloud = r.body.match(/_CLIENT_ID = '([A-Z0-9]+)'/i)[1];
            logger.info('SoundCloud key has been automatically scraped from Youtube-DL. If you do not wish for this to happen, please insert a key into the config.json manually.');
            handler = new MusicHandler(bot);
        }).catch(logger.error);
    } else handler = new MusicHandler(bot);
};

exports.main = {
    desc: 'Music commands'
};

exports.play = {
    desc: 'Play or queue a song.',
    usage: '[url|search terms]',
    async main(bot, ctx) {
        if (!ctx.suffix && !bot.music.queues.get(ctx.guild.id)) return await ctx.createMessage('music-playNoArgs');
        if (!ctx.member.voiceState.channelID) return await ctx.createMessage('music-userNotInChannel');

        if (ctx.suffix) {
            if (!urlRegex.test(ctx.suffix) && bot.config.ytSearchKey) {
                let res;
                
                try {
                    res = await handler.search(ctx, ctx.suffix);
                } catch(err) {
                    if (err.message && err.message === 'Invalid selection (Number too high or not a number).') return await ctx.createMessage('music-searchBadSelection');
                    else if (err.message && err.message === 'No search results.') return await ctx.createMessage('music-noSearchResults');
                    else throw err;
                }

                return await handler.prePlay(ctx, res);
            } else if (!urlRegex.test(ctx.suffix) && !bot.config.ytSearchKey) return await ctx.createMessage('music-noSearchToken');
            else return await handler.prePlay(ctx, ctx.suffix);
        }

        if (bot.music.queues.get(ctx.guild.id).length > 0) {
            let item = bot.music.queues.get(ctx.guild.id)[0];

            await handler.prePlay(item.ctx, item.url);
        } else await ctx.createMessage('music-playNoArgs');
    }
};

exports.queue = {
    desc: 'View the current queue.',
    usage: '[page number]',
    async main(bot, ctx) {
        let embed = {title: 'music-queueTitle'};
        let q = bot.music.queues.get(ctx.guild.id);

        if (!q || q.length === 0) {
            if (q && q.current) {
                embed.author = {name: 'music-queueTitle'};
                embed.title = 'music-queueNowPlaying';
            }

            embed.description = 'music-queueEmpty';

            return await ctx.createMessage({embed}, null, 'channel', {
                song: q ? q.current.info.title : null,
                duration: q ? timeFormat(q.current.info.length) : null
            });
        }

        // I'm not certain what the first type coercion does, and at this point, I'm too afraid to ask.
        let page = !Number(ctx.suffix) || Number(ctx.suffix) === 0 ? 0 : Number(ctx.suffix) - 1;
        let pageAmt = 10;
        let pages = Math.ceil(q.length / pageAmt);
        let thisPage = [];

        if (page <= pages) queuePaginate(q, page, pageAmt, thisPage);
        else queuePaginate(q, 0, pageAmt, thisPage);

        if (pages > 1) {
            embed.footer = {text: 'music-queueFooter'};
            embed.fields = [{
                name: 'music-queueTotalItems',
                value: thisPage.join('\n')
            }];
        } else embed.description = thisPage.join('\n');

        if (q.current) {
            embed.author = {name: 'music-queueTitle'};
            embed.title = 'music-queueNowPlaying';
        }

        await ctx.createMessage({embed}, null, 'channel', {
            page: page + 1,
            total: pages,
            items: q.length,
            song: q.current.info.title,
            duration: timeFormat(q.current.info.length)
        });
    }
};

exports.np = {
    desc: 'Show what song is now playing.',
    async main(bot, ctx) {
        let conn = bot.music.connections.get(ctx.guild.id);
        let q = bot.music.queues.get(ctx.guild.id);

        if (!conn || (conn && !conn.playing) || !q || !q.current) return await ctx.createMessage('music-notPlaying');

        let {info: item, ctx: c} = q.current;
        let embed = {
            author: {name: 'music-nowPlayingTitle'},
            title: item.title,
            description: 'music-nowPlayingInfo',
            image: {url: item.thumbnail},
            footer: {text: 'music-nowPlayingFooter'}
        };

        await ctx.createMessage({embed}, null, 'channel', {
            duration: isNaN(item.length) ? item.length : timeFormat(item.length),
            url: item.url,
            user: utils.formatUsername(c.member),
            type: item.type
        });
    }
};

exports.join = {
    desc: 'Joins a voice channel.',
    async main(bot, ctx) {
        if (bot.music.connections.get(ctx.guild.id)) return await ctx.createMessage('music-botInChannel');
        if (!ctx.member.voiceState.channelID) return await ctx.createMessage('music-userNotInChannel');

        let conn = await bot.joinVoiceChannel(ctx.member.voiceState.channelID);

        bot.music.inactives.push([bot.guilds.get(conn.id).channels.get(conn.channelID), Date.now()]);
        bot.music.connections.get(ctx.guild.id).summoner = ctx.member;

        await ctx.createMessage('music-join', null, 'channel', {
            prefix: bot.config.mainPrefix
        });
    }
};

exports.leave = {
    desc: 'Leave the voice channel.',
    async main(bot, ctx) {
        let conn = bot.music.connections.get(ctx.guild.id);

        if (!conn) return await ctx.createMessage('music-botNotInChannel');
        if (!ctx.member.voiceState.channelID) return await ctx.createMessage('music-userNotInChannel');
        if (ctx.member.voiceState.channelID !== conn.channelID) return await ctx.createMessage('music-userNotSameChannel');
        if (conn.summoner && conn.summoner.id !== ctx.author.id && !ctx.hasPermission('manageGuild', 'author')) return await ctx.createMessage('music-userNotSummoner');

        conn.stopPlaying();
        bot.leaveVoiceChannel(conn.channelID);
        await ctx.createMessage('music-leave');
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
    async main(bot, ctx) {
        let conn = bot.music.connections.get(ctx.guild.id);

        if (!conn) return await ctx.createMessage('music-botNotInChannel');
        if (!ctx.member.voiceState.channelID) return await ctx.createMessage('music-userNotInChannel');
        if (ctx.member.voiceState.channelID !== conn.channelID) return await ctx.createMessage('music-userNotSameChannel');
        if (!conn.playing) return await ctx.createMessage('music-notPlaying');

        if (ctx.args[0] !== 'force') {
            if (!bot.music.skips.get(ctx.guild.id)) {
                let magic = [];
                magic.id = ctx.guild.id;

                bot.music.skips.add(magic);
            }

            let skips = bot.music.skips.get(ctx.guild.id);
            let chan = ctx.guild.channels.get(conn.channelID);
            let track = bot.music.queues.get(ctx.guild.id).current.info;

            if (!skips.includes(ctx.author.id)) {
                skips.push(ctx.author.id);

                if (skips.length >= chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf && !m.voiceState.deaf && m.id !== bot.user.id).length) {
                    clear(skips);
                    conn.stopPlaying();

                    return await ctx.createMessage('music-skip', null, 'channel', {
                        item: track.title
                    });
                }

                return await ctx.createMessage('music-skipVote', null, 'channel', {
                    user: utils.formatUsername(ctx.member),
                    item: track.title,
                    votes: skips.length,
                    total: chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf && !m.voiceState.deaf && m.id !== bot.user.id).length
                });
            } else {
                return await ctx.createMessage('music-skipVotedAlready', null, 'channel', {
                    mention: ctx.author.mention,
                    item: track.title,
                    votes: skips.length,
                    total: chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf && !m.voiceState.deaf && m.id !== bot.user.id).length
                });
            }
        }

        if (!bot.checkBotPerms(ctx.author.id) || !ctx.hasPermission('manageGuild', 'author')) return await ctx.createMessage('music-skipCantForce');

        if (bot.music.skips.get(ctx.guild.id)) clear(bot.music.skips.get(ctx.guild.id));

        let track = bot.music.queues.get(ctx.guild.id)[0].info;

        conn.stopPlaying();
        await ctx.createMessage('music-skip', null, 'channel', {
            item: track.title
        });
    }
};

exports.clear = {
    desc: 'Clears the music queue.',
    async main(bot, ctx) {
        let conn = bot.music.connections.get(ctx.guild.id);
        let q = bot.music.queues.get(ctx.guild.id);

        if (!conn) return await ctx.createMessage('music-botNotInChannel');
        if (!ctx.member.voiceState.channelID) return await ctx.createMessage('music-userNotInChannel');
        if (ctx.member.voiceState.channelID !== conn.channelID) return await ctx.createMessage('music-userNotSameChannel');
        if (conn.summoner && conn.summoner.id !== ctx.author.id && !ctx.hasPermission('manageGuild', 'author')) return await ctx.createMessage('music-userNotSummoner');
        if (!q || !q.length) return await ctx.createMessage('music-clearEmptyQueue');

        await ctx.createMessage('music-clearConfirm');

        let msg = await bot.awaitMessage(ctx.channel.id, ctx.author.id);

        if (/^y(es)?$/i.test(msg.content)) await ctx.createMessage('music-clearConfirmYes');
        else if (/^no?$/i.test(msg.content)) {
            await ctx.createMessage('music-clearConfirmNo');
            clear(q);
            return await ctx.createMessage('music-cleared');
        } else await ctx.createMessage('music-clearConfirmInvalid');

        clear(q);
        conn.stopPlaying();

        await ctx.createMessage('music-clearStoppedPlaying');
    }
};

exports.dump = {
    desc: 'Dumps the contents of the current playlist to a text file.',
    async main(bot, ctx) {
        let conn = bot.music.connections.get(ctx.guild.id);
        let q = bot.music.queues.get(ctx.guild.id);

        if (!conn) return await ctx.createMessage('music-botNotInChannel');
        if (!q || !q.length) return await ctx.createMessage('music-dumpEmptyQueue');

        let res = await bot.hastePost(q.map(i => `${i.info.title}   [${i.info.url}]`).join('\n'));

        await ctx.createMessage('music-dumped', null, 'channel', {
            url: `https://hastebin.com/${res}.txt`
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

    for (let v of all.entries()) {
        v[1] = Math.floor(v[1]);
        all[v[0]] = v[1].toString().length === 1 ? `0${v[1]}` : v[1];
    }

    return all[0] === '00' ? all.slice(1).join(':') : all.join(':');
}

function clear(arr) {
    while (arr.length) arr.pop();
}

const urlRegex = /^(?:(?:https?:)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
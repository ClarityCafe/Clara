/**
 * @file Main music handler file.
 * @author Ovyerus
 */

const {Context} = require(`${mainDir}/lib/modules/CommandHolder`);
const ytSearch = require('youtube-simple-search');

// Link regexs
const YTRegex = /^(?:https?:\/\/)?(?:(?:www\.|m.)?youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9-_]{11})/;
const YTPlaylistRegex = /^(?:https:\/\/)(?:www.)?youtube\.com\/playlist\?list=(PL[a-zA-Z0-9-_]{32}|PL[A-Z0-9]{16})/;
const SCRegex = /^(?:https:\/\/)soundcloud\.com\/([a-z0-9-]+\/[a-z0-9-]+)/;
const SCPlaylistRegex = /^(?:https:\/\/)?soundcloud\.com\/([a-z0-9-]+\/sets\/[a-z0-9-]+)$/;
const ClypRegex = /^(?:https:\/\/)?clyp\.it\/([a-z0-9]{8})/;
const TwitchRegex = /^(?:https:\/\/)?(?:www\.)?twitch\.tv\/([a-z0-9_]+)/;
const PlaylistTypes = ['YouTubePlaylist', 'SoundCloudPlaylist'];

class MusicHandler {
    constructor(bot) {
        let tmp = require(`${__dirname}/handlers`)(bot);
        this._bot = bot;
        this.handlers = {
            YouTubeVideo: tmp.YouTubeHandler,
            SoundCloudTrack: tmp.SoundCloudHandler,
            ClypAudio: tmp.ClypHandler,
            TwitchStream: tmp.TwitchHandler
        };
        this.playlistHandlers = {
            //YouTubePlaylist: tmp.YouTubePlaylistHandler,
            SoundCloudPlaylist: tmp.SoundCloudPlaylistHandler
        };
    }

    async queue(ctx, url) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
        if (typeof url !== 'string') throw new TypeError('url is not a string.');
        if (!checkURL(url)) throw new Error('Unsupported music source.');

        // Get queue. If it doesn't exist, create it
        if (!this._bot.music.queues.get(ctx.guild.id)) {
            let magic = [];
            magic.id = ctx.guild.id;

            this._bot.music.queues.add(magic);
        }

        let q = this._bot.music.queues.get(ctx.guild.id);
        let [getURL, type] = matchURL(url);

        // Get song info and queue it
        if (!PlaylistTypes.includes(type)) {
            let info = await this.handlers[type].getInfo(getURL);

            q.push({info, ctx, timestamp: Date.now()});
            await ctx.createMessage('music-queueSong', null, 'channel', {
                item: info.title,
                position: q.length + 1
            });
        } else {
            await this.queuePlaylist(ctx, getURL);
        }
    }

    async queuePlaylist(ctx, url) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
        if (typeof url !== 'string') throw new TypeError('url is not a string.');
        if (!checkURL(url)) throw new Error('Unsupported music source.');

        // Get queue. If it doesn't exist, create it
        if (!this._bot.music.queues.get(ctx.guild.id)) {
            let magic = [];
            magic.id = ctx.guild.id;

            this._bot.music.queues.add(magic);
        }

        let q = this._bot.music.queues.get(ctx.guild.id);
        let [getURL, type] = matchURL(url);
        let playlist = await this.playlistHandlers[type].getPlaylist(getURL);

        if (playlist.items.length === 0) throw new Error('Playlist is empty.');

        let queuedAmt = 0;
        let fullDuration = 0;

        for (let item of playlist.items) {
            q.push({info: item, ctx, timestamp: Date.now()});
            fullDuration += item.length;
            queuedAmt++;
        }

        await ctx.createMessage('music-queuePlaylist', null, 'channel', {
            amount: queuedAmt,
            playlist: playlist.title,
            duration: timeFormat(fullDuration)
        });
    }

    async search(ctx, terms) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
        if (typeof terms !== 'string') throw new TypeError('terms is not a string.');

        let msg;
        let res = await searchP(terms, {key: this._bot.config.ytSearchKey, maxResults: 10});
        res = res.filter(r => r.id.kind === 'youtube#video').slice(0, 5);

        if (res.length > 0) {
            let embed = {
                title: 'music-searchTitle',
                description: 'music-searchDescription',
                fields: []
            };

            for (let i = 0; i <= 4; i++) {
                if (!res[i]) break;
                embed.fields.push({name: `${i + 1}. ${res[i].snippet.channelTitle}`, value: res[i].snippet.title});
            }

            msg = await ctx.createMessage({embed});
        } else throw new Error('No search results.');

        let m = await this._bot.awaitMessage(ctx.channel.id, ctx.author.id);
        
        await msg.delete();

        if (/^[1-5]$/.test(m.content.split(' ')[0])) {
            let choice = res[m.content.split(' ')[0] - 1];
            return `https://youtube.com/watch?v=${choice.id.videoId}`;
        } else throw new Error('Invalid selection (Number too high, too low, or not a number).');
    }

    async prePlay(ctx, url) {
        let bot = this._bot;

        await this.queue(ctx, url);

        if (!bot.music.connections.get(ctx.guild.id)) {
            await bot.joinVoiceChannel(ctx.member.voiceState.channelID);
            bot.music.connections.get(ctx.guild.id).summoner = ctx.member;

            await this.play(ctx);
        } else if (!bot.music.connections.get(ctx.guild.id).playing) {
            await this.play(ctx);
        }
    }

    play(ctx) {
        return new Promise((resolve, reject) => {
            let bot = this._bot;
            let cnc = bot.voiceConnections.get(ctx.guild.id);
            let item = bot.music.queues.get(ctx.guild.id).shift();
            bot.music.queues.get(ctx.guild.id).current = item;

            if (!item) {
                bot.music.inactives.push([ctx.guild.channels.get(cnc.channelID), Date.now()]);
                return resolve();
            }

            this.handlers[item.info.type].getStream(item.info.url).then(stream => {
                bot.music.streams.add({
                    id: ctx.guild.id,
                    stream,
                    url: item.info.url
                });

                cnc.play(stream, {encoderArgs: ['-af', 'volume=0.5', '-b:a', '96k', '-bufsize', '96k']});

                return ctx.createMessage({embed: {
                    author: {name: 'music-nowPlayingTitle'},
                    title: item.info.title,
                    description: 'music-nowPlayingInfo',
                    image: {url: item.info.thumbnail},
                    footer: {
                        text: 'music-nowPlayingFooter'
                    }
                }}, null, 'channel', {
                    duration: typeof item.info.length === 'string' ? item.info.length : timeFormat(item.info.length),
                    url: item.info.url,
                    user: utils.formatUsername(ctx.member),
                    type: item.info.type
                });
            }).then(() => {
                if (!cnc.eventNames().includes('error')) {
                    cnc.on('error', async err => {
                        logger.error(`Voice error in guild ${ctx.guild.id}\n${err.stack}`);
                        ctx.createMessage(`Voice connection error: \`${err}\``);
                    });

                    if (!cnc.eventNames().includes('end')) {
                        cnc.on('end', () => {
                            if (bot.music.stopped.includes(ctx.guild.id)) return resolve();

                            resolve(this.play(ctx));
                        });
                    }
                }
            }).catch(reject);
        });
    }
}

// Functions
function checkURL(url) {
    if (typeof url !== 'string') return false;
    return YTRegex.test(url) || YTPlaylistRegex.test(url) || SCRegex.test(url) || SCPlaylistRegex.test(url) || ClypRegex.test(url) || TwitchRegex.test(url);
}

function matchURL(url) {
    if (!checkURL(url)) throw new Error('Unsupported music source.');

    // Sanitize URL so we don't get any wonky errors.
    if (YTRegex.test(url)) return [`https://youtube.com/watch?v=${url.match(YTRegex)[1]}`, 'YouTubeVideo'];
    else if (YTPlaylistRegex.test(url)) return [`https://youtube.com/playlist?list=${url.match(YTPlaylistRegex)[1]}`, 'YouTubePlaylist'];
    else if (SCPlaylistRegex.test(url)) return [`https://soundcloud.com/${url.match(SCPlaylistRegex)[1]}`, 'SoundCloudPlaylist'];
    else if (SCRegex.test(url)) return [`https://soundcloud.com/${url.match(SCRegex)[1]}`, 'SoundCloudTrack'];
    else if (ClypRegex.test(url)) return [`https://clyp.it/${url.match(ClypRegex)[1]}`, 'ClypAudio'];
    else if (TwitchRegex.test(url)) return [`https://twitch.tv/${url.match(TwitchRegex)[1]}`, 'TwitchStream'];
    else {
        // How the fuck did u get here fam?
        throw new Error(`Somehow didn't match URL. URL: ${url}`);
    }
}


function searchP(query, options) {
    return new Promise(resolve => {
        ytSearch(Object.assign({}, options, {query}), resolve);
    });
}

function timeFormat(secs) {
    let all = [secs / 60 / 60, secs / 60 % 60, secs % 60];

    for (let v of all.entries()) {
        v[1] = Math.floor(v[1]);
        all[v[0]] = v[1].toString().length === 1 ? `0${v[1]}` : v[1];
    }

    return all[0] === '00' ? all.slice(1).join(':') : all.join(':');
}

module.exports = MusicHandler;
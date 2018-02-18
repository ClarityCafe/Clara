/**
 * @file Music handler abstraction file.
 * @author Ovyerus
 */

const {Context} = require(`${mainDir}/lib/modules/CommandHolder`);
const ytSearch = require('youtube-simple-search');
const fs = require('fs');
const crypto = require('crypto');
const Stream = require('stream').Stream;

// Link regexs
const YTRegex = /^(?:https?:\/\/)?(?:(?:www\.|m.)?youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9-_]{11})/;
const YTPlaylistRegex = /^(?:https?:\/\/)?(?:www.)?youtube\.com\/playlist\?list=(PL[a-zA-Z0-9-_]{32}|PL[A-Z0-9]{16})/;
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

    /**
     * Queues a given song into the music queue.
     * 
     * @param {Context} ctx Context to use.
     * @param {String} url Item URL to queue. Must be a supported service.
     */
    async queue(ctx, url) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
        if (typeof url !== 'string') throw new TypeError('url is not a string.');
        if (!checkURL(url)) throw new Error('Unsupported music source.');

        // Get queue. If it doesn't exist, create it
        if (!this._bot.music.queues.get(ctx.guild.id)) {
            // JavaScript object magic hax.
            let magic = [];
            magic.id = ctx.guild.id;

            this._bot.music.queues.add(magic);
        }

        let q = this._bot.music.queues.get(ctx.guild.id);
        let [getURL, type] = matchURL(url);

        // Get song info and queue it
        if (!PlaylistTypes.includes(type)) {
            let info = await this.handlers[type].getInfo(getURL);
            let item = {info, ctx, timestamp: Date.now()};

            q.push(item);
            await ctx.createMessage('music-queueSong', null, 'channel', {
                item: info.title,
                position: q.current ? q.length + 1 : q.length
            });

            if (q.indexOf(item) === 0) await this.cacheTrack(item, true);
        } else await this.queuePlaylist(ctx, getURL);
    }

    /**
     * Queues all the tracks of a given playlist into the music queue.
     * 
     * @param {Context} ctx Context to use.
     * @param {String} url Playlist URL to queue items from. Must be a supported service.
     */
    async queuePlaylist(ctx, url) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
        if (typeof url !== 'string') throw new TypeError('url is not a string.');
        if (!checkURL(url)) throw new Error('Unsupported music source.');

        // Get queue. If it doesn't exist, create it.
        if (!this._bot.music.queues.get(ctx.guild.id)) {
            // JavaScript object magic hax.
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

    /**
     * Searches YouTube for tracks matching user input.
     * 
     * @param {Context} ctx Context to use.
     * @param {String} terms Search terms.
     * @returns {String} The URL of the search choice.
     */
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

    /**
     * Pre-handler for playing music. Run this instead of MusicHandler#play.
     * 
     * @param {Context} ctx Context to use.
     * @param {String} url URl of the track to play.
     */
    async prePlay(ctx, url) {
        let bot = this._bot;

        await this.queue(ctx, url);

        if (!bot.music.connections.get(ctx.guild.id)) {
            await bot.joinVoiceChannel(ctx.member.voiceState.channelID);
            bot.music.connections.get(ctx.guild.id).summoner = ctx.member;

            await this.play(ctx);
        } else if (!bot.music.connections.get(ctx.guild.id).playing) await this.play(ctx);
    }

    /**
     * Main handler for playing music. You probably want to use MusicHandler#prePlay instead, unless you really know what you're doing.
     * 
     * @param {Context} ctx Context to use.
     * @returns {Promise} . 
     */
    play(ctx) {
        return new Promise((resolve, reject) => {
            let bot = this._bot;
            let cnc = bot.voiceConnections.get(ctx.guild.id);
            let q = bot.music.queues.get(ctx.guild.id);
            let item = q.shift();
            let last = q.current;
            q.current = item;

            if (last) {
                let lastFile = `${mainDir}/cache/${hashSong(last.info)}`;
                let hasSong = bot.music.queues.filter(q => (q.current && q.current.info.url === last.url) || q.filter(s => s.info.url === last.url).length);

                if (fs.existsSync(lastFile) && !hasSong.length) {
                    fs.unlink(lastFile, err => {
                        if (err) logger.warn(`Unable to delete temporary voice file "${lastFile}"`);
                    });
                }
            }

            if (!item) {
                bot.music.inactives.push([ctx.guild.channels.get(cnc.channelID), Date.now()]);
                return resolve();
            }

            this.cacheTrack(item).then(stream => {
                bot.music.streams.add({
                    id: ctx.guild.id,
                    stream,
                    url: item.info.url
                });

                cnc.play(stream, {encoderArgs: ['-af', 'volume=0.5']});

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
                if (q.length) this.cacheTrack(q[0], true);

                if (!cnc.eventNames().includes('error')) {
                    cnc.on('error', err => {
                        logger.error(`Voice error in guild ${ctx.guild.id}\n${err.stack}`);
                        ctx.createMessage(`Voice connection error: \`${err}\``);
                        cnc.stopPlaying();
                    });
                }

                if (!cnc.eventNames().includes('end')) {
                    cnc.on('end', () => {
                        if (bot.music.stopped.includes(ctx.guild.id)) return resolve();

                        resolve(this.play(ctx));
                    });
                }
            }).catch(reject);
        });
    }

    async cacheTrack(item, noReturn=false) {
        let destFile = `${mainDir}/cache/${hashSong(item.info)}`;
        let destExists = fs.existsSync(destFile);
        let getter = this.handlers[item.info.type].getStream.bind(this.handlers[item.info.type]);

        if (destExists && !noReturn) return fs.createReadStream(destFile);
        else if (destExists) return;

        let stream = await getter(item.info.url);

        if (!destExists && stream instanceof Stream) {
            let p = await new Promise((resolve, reject) => {
                let piper = stream.pipe(fs.createWriteStream(destFile));

                piper.on('error', reject);
                piper.on('finish', () => resolve(fs.createReadStream(destFile)));
            });

            if (!noReturn) return p;
        } else if (!noReturn) return stream;
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

// Creates a unique hash per song when caching. Not intended to be cryptographically secure by any means.
function hashSong(info) {
    return crypto.createHash('md5').update(info.url).digest('hex');
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
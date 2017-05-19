const {Context} = require(`${__baseDir}/modules/CommandHolder`);
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

    queue(ctx, url) {
        return new Promise((resolve, reject) => {
            if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
            if (typeof url !== 'string') throw new TypeError('url is not a string.');
            if (!checkURL(url)) throw new Error('Unsupported music source.');

            // Get queue. If it doesn't exist, create it
            if (!this._bot.music.queues.get(ctx.guild.id)) this._bot.music.queues.add({id: ctx.guild.id, queue: []});
            let q = this._bot.music.queues.get(ctx.guild.id).queue;

            // Get clean url and type
            let [getURL, type] = matchURL(url);

            // Get song info and queue it
            if (!PlaylistTypes.includes(type)) {
                this.handlers[type].getInfo(getURL).then(info => {
                    q.push({info, ctx, timestamp: Date.now()});
                    return ctx.createMessage(`Queued **${info.title}** to position **${q.length}** (including currently playing).`);
                }).then(resolve).catch(reject);
            } else {
                this.queuePlaylist(ctx, getURL).then(resolve).catch(reject);
            }
        });
    }

    queuePlaylist(ctx, url) {
        return new Promise((resolve, reject) => {
            if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
            if (typeof url !== 'string') throw new TypeError('url is not a string.');
            if (!checkURL(url)) throw new Error('Unsupported music source.');

            /// Get queue. If it doesn't exist, create it
            if (!this._bot.music.queues.get(ctx.guild.id)) this._bot.music.queues.add({id: ctx.guild.id, queue: []});
            let q = this._bot.music.queues.get(ctx.guild.id).queue;

            // Get clean url and type
            let [getURL, type] = matchURL(url);

            // Get playlist info
            this.playlistHandlers[type].getPlaylist(getURL).then(playlist => {
                if (playlist.items.length === 0) throw new Error('Playlist is empty.');

                let queuedAmt = 0;
                let fullDuration = 0;

                for (let item of playlist.items) {
                    q.push({info: item, ctx, timestamp: Date.now()});
                    fullDuration += item.length;
                    queuedAmt++;
                }

                return ctx.createMessage(`Queued **${queuedAmt}** items from playlist \`${playlist.title}\`.\n**Duration**: ${timeFormat(fullDuration)}`);
            }).then(resolve).catch(reject);
        });
    }

    search(ctx, terms) {
        return new Promise((resolve, reject) => {
            if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
            if (typeof terms !== 'string') throw new TypeError('terms is not a string.');

            let tmp, outRes;
            searchP(terms, {key: this._bot.config.ytSearchKey, maxResults: 10}).then(res => {
                res = res.filter(r => r.id.kind === 'youtube#video').slice(0, 5);
                if (res.length > 0) {
                    let embed = {
                        title: 'Search Results',
                        description: 'Please choose one of the following choices below by just typing its corresponding number.',
                        fields: []
                    };

                    for (let i = 0; i <= 4; i++) {
                        if (!res[i]) break;
                        embed.fields.push({name: `${i + 1}. ${res[i].snippet.channelTitle}`, value: res[i].snippet.title});
                    }

                    outRes = res;
                    return ctx.createMessage({embed});
                } else {
                    throw new Error('No search results.');
                }
            }).then(m => {
                tmp = m;
                return this._bot.awaitMessage(ctx.channel.id, ctx.author.id);
            }).then(m => {
                tmp.delete();

                if (/^[1-5]$/.test(m.content.split(' ')[0])) {
                    let choice = outRes[Number(m.content.split(' ')[0]) - 1];
                    return `https://youtube.com/watch?v=${choice.id.videoId}`;
                } else {
                    throw new Error('Invalid selection (Number too high or not a number).');
                }
            }).then(resolve).catch(reject);
        });
    }

    getStream(url, type) {
        return new Promise((resolve, reject) => {
            if (!this.handlers[type]) throw new Error(`Unsupported type '${type}'`);

            this.handlers[type].getStream(url).then(resolve).catch(reject);
        });
    }

    prePlay(ctx, url) {
        return new Promise((resolve, reject) => {
            let bot = this._bot;
            if (!bot.music.connections.get(ctx.guild.id)) {
                // If no connection, create it
                this.queue(ctx, url).then(() => {
                    return bot.joinVoiceChannel(ctx.member.voiceState.channelID);
                }).then(() => {
                    let item = bot.music.queues.get(ctx.guild.id).queue[0];
                    return this.getStream(item.info.url, item.info.type);
                }).then(res => {
                    return this.play(ctx, res);
                }).then(resolve).catch(reject);
            } else if (bot.music.connections.get(ctx.guild.id) && !bot.music.connections.get(ctx.guild.id).playing) {
                this.queue(ctx, url).then(() => {
                    let item = bot.music.queues.get(ctx.guild.id).queue[0];
                    return this.getStream(item.info.url, item.info.type);
                }).then(res => {
                    return this.play(ctx, res);
                }).then(resolve).catch(reject);
            } else {
                this.queue(ctx, url).then(resolve).catch(reject);
            }
        });
    }

    play(ctx, res) {
        return new Promise((resolve, reject) => {
            let bot = this._bot;
            let [stream, info] = res;
            let cnc = bot.music.connections.get(ctx.guild.id);
            let streamInfo = {id: ctx.guild.id, stream, url: info.url};

            bot.music.streams.add(streamInfo);
            cnc.play(stream, {encoderArgs: ['-af', 'volume=0.5', '-b:a', '96k', '-bufsize', '96k']});

            if (typeof stream === 'string') {
                ctx.createMessage({embed: {
                    author: {name: 'Now Playing'},
                    title: info.title,
                    description: `Duration: ${typeof info.length === 'string'? info.length : timeFormat(info.length)}, [**Link**](${info.url})`,
                    color: utils.randomColour(),
                    image: {url: info.thumbnail},
                    footer: {
                        text: `Queued by ${utils.formatUsername(ctx.member)} | ${info.type}`
                    }
                }});
            } else {
                stream.once('data', () => {
                    ctx.createMessage({embed: {
                        author: {name: 'Now Playing'},
                        title: info.title,
                        description: `Duration: ${typeof info.length === 'string'? info.length : timeFormat(info.length)}, [**Link**](${info.url})`,
                        color: utils.randomColour(),
                        image: {url: info.thumbnail},
                        footer: {
                            text: `Queued by ${utils.formatUsername(ctx.member)} | ${info.type}`
                        }
                    }});
                });
            }

            cnc.on('error', err => {
                logger.error(`Voice error in guild ${ctx.guild.id}\n${err.stack}`);
                ctx.createMessage(`Voice connection error: \`${err}\``);
            });

            cnc.on('end', () => {
                if (!bot.music.queues.get(ctx.guild.id) || bot.music.stopped.includes(ctx.guild.id)) return;

                let q = bot.music.queues.get(ctx.guild.id).queue;

                if (q[0].info.url === info.url) {
                    q.splice(0, 1);
                    bot.music.streams.delete(ctx.guild.id);
                    cnc.stopPlaying();

                    if (q.length > 0) {
                        this.getStream(q[0].info.url, q[0].info.type).then(bepis => {
                            return this.play(q[0].ctx, bepis);
                        }).then(resolve).catch(reject);
                    }
                    cnc.removeAllListeners('error');
                }
            });
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

    if (YTRegex.test(url)) {
        // Sanitize URL so we don't get any wonky errors.
        let id = url.match(YTRegex)[1];
        return [`https://youtube.com/watch?v=${id}`, 'YouTubeVideo'];
    } else if (YTPlaylistRegex.test(url)) {
        let id = url.match(YTPlaylistRegex)[1];
        return [`https://youtube.com/playlist?list=${id}`, 'YouTubePlaylist'];
    } else if (SCPlaylistRegex.test(url)) {
        let id = url.match(SCPlaylistRegex)[1];
        return [`https://soundcloud.com/${id}`, 'SoundCloudPlaylist'];
    } else if (SCRegex.test(url)) {
        let id = url.match(SCRegex)[1];
        return [`https://soundcloud.com/${id}`, 'SoundCloudTrack'];
    } else if (ClypRegex.test(url)) {
        let id = url.match(ClypRegex)[1];
        return [`https://clyp.it/${id}`, 'ClypAudio'];
    } else if (TwitchRegex.test(url)) {
        let id = url.match(TwitchRegex)[1];
        return [`https://twitch.tv/${id}`, 'TwitchStream'];
    } else {
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

    for (let i in all) {
        all[i] = Math.floor(all[i]);
        all[i] = all[i].toString().length === 1 ? `0${all[i]}` : all[i];
    }

    return all[0] === '00' ? all.slice(1).join(':') : all.join(':');
}

module.exports = MusicHandler;
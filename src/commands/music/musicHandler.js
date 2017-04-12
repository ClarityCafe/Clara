const {Context} = require(`${__baseDir}/modules/CommandHandler`);
const ytSearch = require('youtube-search');
const Eris = require('eris');

// Link regexs
const YTRegex = /^(?:https?:\/\/)?(?:(?:www\.|m.)?youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9-_]{11})/;
const YTPlaylistRegex = /^(?:https:\/\/)(?:www.)?youtube\.com\/playlist\?list=(PL[a-zA-Z0-9-_]{32}|PL[A-Z0-9]{16})/;
const SCRegex = /^(?:https:\/\/)soundcloud\.com\/([a-z0-9-]+\/[a-z0-9-]+)/;
const SCPlaylistRegex = /^(?:https:\/\/)?soundcloud\.com\/([a-z0-9-]+\/sets\/[a-z0-9-]+)$/;
const ClypRegex = /^(?:https:\/\/)?clyp\.it\/([a-z0-9]{8})/;
const TwitchRegex = /^(?:https:\/\/)?(?:www\.)?twitch\.tv\/([a-z0-9_]+)/;

class MusicHandler {
    constructor(bot, queueHandler) {
        let tmp = handlers = require(`${__dirname}/handlers`)(bot);
        this._bot = bot;
        this.queue = queueHandler;
        this.handlers = {
            YouTubeVideo: tmp.YouTubeHandler,
            SoundCloudTrack: tmp.SoundCloudHandler,
            ClypAudio: tmp.ClypHandler,
            TwitchStream: tmp.TwitchHandler
        };
    }

    queue(ctx, url) {
        return new Promise((resolve, reject) => {
            if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
            if (typeof url !== 'string') throw new TypeError('url is not a string.');
            if (!checkURL(url)) throw new Error('Unsupported music source.');

            if (!bot.music.queues.get(ctx.guild.id)) bot.music.queues.add({id: ctx.guild.id, queue: []});
            let q = bot.music.queues.get(ctx.guild.id);
            let [getURL, type] = matchURL(url);

            this.handlers[type].getInfo(getURL).then(info => {
                q.push({info, ctx, timestamp: Date.now()});
                return ctx.createMessage(`Queued **${info.title}** to position **${q.length}** (including currently playing).`);
            }).then(resolve).catch(reject);
        });
    }

    search(ctx, terms) {
        return new Promise((resolve, reject) => {
            if (!(ctx instanceof Context)) throw new TypeError('ctx is not an instance of Context.');
            if (typeof terms !== 'string') throw new TypeError('terms is not a string.');

            let tmp;
            searchP(terms, {maxResults: 25, key: bot.config.ytSearchKey}).then(res => {
                res = res.filter(r => r.kind === 'youtube#video').slice(0, 5);
                if (res.length > 0) {
                    let embed = {
                        title: 'Search Results',
                        description: 'Please choose one of the following choices below by just typing its corresponding number.',
                        fields: []
                    };

                    for (let i = 0; i <= 4; i++) {
                        if (!res[i]) break;
                        embed.fields.push({name: `${i + 1}: ${res[i].channelTitle}`, value: res[i].title});
                    }

                    return ctx.createMessage({embed})
                } else {
                    throw new Error('No search results.');
                }
            }).then(m => {
                tmp = m;
                return bot.awaitMessage(ctx.channel.id, ctx.author.id);
            }).then(m => {
                tmp.delete();

                if (/^[1-5]$/.test(m.content.split(' ')[0])) {
                    let choice = res[Number(m.content.split(' ')[0]) - 1];
                    return {msg: m, url: choice.link};
                } else {
                    throw new Error('Invalid selection (Number too high or not a number).');
                }
            }).then(resolve).catch(reject);
        });
    }

    play() {
        return new Promise((resolve, reject) => {

        });
    }
}

// Functions
function checkURL(url) {
    if (typeof url !== 'string') return false;
    return YTRegex.test(url) || YTPlaylistRegex.test(url) || SCRegex.test(url) || SCPlaylistRegex.test(url) || ClypRegex(url) || TwitchRegex(url);
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
    } else if (SCRegex.test(url)) {
        let id = url.match(SCRegex)[1];
        return [`https://soundcloud.com/${id}`, 'SoundCloudTrack'];
    } else if (SCPlaylistRegex.test(url)) {
        let id = url.match(SCPlaylistRegex)[1];
        return [`https://soundcloud.com/${id}`, 'SoundCloudPlaylist'];
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


function searchP(search, opts) {
    return new Promise(resolve => {
        ytSearch(search, opts, (err, res) => {
            if (err) throw err;
            resolve(res);
        });
    });
}

module.exports = {MusicHandler, QueueHandler};
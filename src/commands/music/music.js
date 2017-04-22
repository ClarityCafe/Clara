/*
 * music.js - Music streaming commands
 * 
 * Contributed by Ovyerus
 */

const MusicHandler = require(`${__dirname}/musicHandler`);
var handler;

exports.loadAsSubcommands = true;
exports.commands = [
    'play',
    'queue',
    'leave',
    'join'
];

exports.init = bot => {
    handler = new MusicHandler(bot);
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
                        }).then(resolve).catch(reject);
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
    desc: 'View the queue or play something.',
    usage: '[page number|url|search terms]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix || !Number(ctx.suffix)) {
                let embed = {
                    title: 'Music Queue'
                };

                if (!bot.music.queues.get(ctx.guild.id) || bot.music.queues.get(ctx.guild.id).queue.length === 0) {
                    embed.description = 'Queue is more empty than my will to live. I mean... :eyes:';
                    ctx.createMessage({embed}).then(resolve).catch(reject);
                } else {
                    let q = bot.music.queues.get(ctx.guild.id).queue;

                    let page = !Number(ctx.suffix) ? 0 : Number(ctx.suffix);
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
            } else {
                exports.play.main(bot, ctx).then(resolve).catch(reject);
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
                bot.joinVoiceChannel(ctx.member.voiceState.channelID).then(() => {
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

function queuePaginate(q, page, pageAmt, collect) {
    for (let i = page * pageAmt; i < page * pageAmt + pageAmt; i++) {
        if (!q[i]) break;
        collect.push(`**${Number(i) + 1}.** \`${q[i].info.title}\` (${q[i].info.uploader}) **[TODO]**`);
    }
}

const urlRegex = /^(?:(?:https?:)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/;
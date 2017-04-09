/* 
 * music.js - Music commands.
 *
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

const handler = require(`${__dirname}/musicHandler.js`);
(`${__baseDir}/modules/utils`);
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

exports.play = {
    desc: 'Play music from supported sources.',
    longDesc: 'Plays music from supported sources and joins if needed.',
    usage: '[URL|search term]',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ | running in the 90s',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            handler.exposed.bot = bot;
            handler.exposed.settings = ctx.settings;
            if (!ctx.suffix && !bot.music.queues.get(ctx.msg.channel.guild.id)) {
                ctx.createMessage(localeManager.t('music-noArgs', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                if (!ctx.msg.member.voiceState.channelID) {
                    ctx.createMessage(localeManager.t('music-noChan', ctx.settings.locale)).then(resolve).catch(reject);
                } else {
                    if (ctx.suffix) {
                        if (!handler.allRegex(ctx.suffix) && !/^https?:\/\//.test(ctx.suffix) && bot.config.ytSearchKey) {
                            handler.search(ctx.msg, ctx.suffix).then(res => {
                                if (!(res instanceof Eris.Message)) {
                                    if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) > -1) bot.music.stopped.splice(bot.music.stopped.indexOf(ctx.msg.channel.guild.id), 1);
                                    handler.play(res.msg, res.url).then(resolve).catch(reject);
                                } else {
                                    resolve();
                                }
                            }).catch(reject);
                        } else if (!handler.allRegex(ctx.suffix) && !/^https?:\/\//.test(ctx.suffix) && !bot.config.ytSearchKey) {
                            ctx.createMessage(localeManager.t('music-noSearchKey', ctx.settings.locale)).then(resolve).catch(reject);
                        } else if (handler.allRegex(ctx.suffix)) {
                            if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) > -1) bot.music.stopped.splice(bot.music.stopped.indexOf(ctx.msg.channel.guild.id), 1);
                            handler.play(ctx.msg, ctx.suffix).then(resolve).catch(reject);
                        }
                    } else if (bot.music.queues.get(ctx.msg.channel.guild.id) && bot.music.queues.get(ctx.msg.channel.guild.id).q.length > 0) {
                        if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) > -1) bot.music.stopped.splice(bot.music.stopped.indexOf(ctx.msg.channel.guild.id), 1);
                        let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                        handler.play(q[0].msg, q[0].url).then(resolve).catch(reject);
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
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            handler.exposed.bot = bot;
            if (!ctx.suffix) {
                if (!bot.music.queues.get(ctx.msg.channel.guild.id) || bot.music.queues.get(ctx.msg.channel.guild.id).q.length === 0) {
                    ctx.createMessage({embed: {
                        title: localeManager.t('music-queue', ctx.settings.locale),
                        description: localeManager.t('music-noQueue', ctx.settings.locale)
                    }}).then(resolve).catch(reject);
                } else {
                    let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                    let description = `**${localeManager.t('music-queuesAmt', ctx.settings.locale, {amt: q.length, more10: q.length > 10 ? localeManager.t('music-queuesAmtMore10', ctx.settings.locale) : ''})}**\n\n`;

                    for (let i in q) {
                        if (!q[i] || Number(i) === 9) break;
                        description += `**${(Number(i) + 1)}:** \`${q[i].info.title}\` (${q[i].info.uploader}) **[${handler.timeFormat(q[i].info.length)}]**\n\n`;
                    }

                    let embed = {
                        title: localeManager.t('music-queue', ctx.settings.locale),
                        description,
                        footer: {text: q.length - 10 > 0 ? `${q.length - 10} more ${q.length - 10 === 1 ? 'item' : 'items'}.` : ''}
                    };

                    ctx.createMessage({embed}).then(resolve).catch(reject);
                }
            } else {
                exports.play.main(bot, ctx).then(resolve).catch(reject);
            }
        });
    }
};

exports.leave = {
    desc: 'Leaves voice channel and destroys all associated data.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!bot.music.connections.get(ctx.msg.channel.guild.id)) {
                ctx.createMessage(localeManager.t('music-noBotChan', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                if (ctx.msg.member.voiceState.channelID !== bot.music.connections.get(ctx.msg.channel.guild.id).channelID) {
                    ctx.createMessage(localeManager.t('music-notSameChan', ctx.settings.locale)).then(resolve).catch(reject);
                } else {
                    bot.music.connections.get(ctx.msg.channel.guild.id).disconnect();
                    ctx.createMessage(localeManager.t('music-left', ctx.settings.locale)).then(resolve).catch(reject);
                }
            }
        });
    }
};

exports.stop = {
    desc: 'Stops playing music and (optionally) clears the queue.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!bot.music.connections.get(ctx.msg.channel.guild.id)) {
                ctx.createMessage(localeManager.t('music-noBotChan', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                if (ctx.msg.member.voiceState.channelID !== bot.music.connections.get(ctx.msg.channel.guild.id).channelID) {
                    ctx.createMessage(localeManager.t('music-notSameChan', ctx.settings.locale)).then(resolve).catch(reject);
                } else {
                    bot.music.connections.get(ctx.msg.channel.guild.id).stopPlaying();
                    ctx.createMessage(localeManager.t('music-stopQuestion', ctx.settings.locale)).then(() => {
                        return bot.awaitMessage(ctx.msg.channel.id, ctx.msg.author.id);
                    }).then(m => {
                        if (/y(es)?/i.test(m.content)) {
                            bot.music.queues.get(m.channel.guild.id).q = [];
                            return m.channel.createMessage(localeManager.t('music-queueCleared', ctx.settings.locale));
                        } else if (/no?/i.test(m.content)) {
                            if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) === -1) bot.music.stopped.push(ctx.msg.channel.guild.id);
                            return m.channel.createMessage(localeManager.t('music-queueKeep', ctx.settings.locale));
                        } else {
                            if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) === -1) bot.music.stopped.push(ctx.msg.channel.guild.id);
                            return m.channel.createMessage(localeManager.t('music-invalidQueueKeep', ctx.settings.locale));
                        }
                    }).then(resolve).catch(err => {
                        if (!err.resp) {
                            if (bot.music.stopped.indexOf(ctx.msg.channel.guild.id) === -1) bot.music.stopped.push(ctx.msg.channel.guild.id);
                            ctx.createMessage(localeManager.t('music-stopTimeout', ctx.settings.locale)).then(resolve).catch(reject);
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
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (bot.music.connections.get(ctx.msg.channel.guild.id)) {
                ctx.createMessage(localeManager.t('music-alreadyInChan', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                if (!ctx.msg.member.voiceState.channelID) {
                    ctx.createMessage(localeManager.t('music-noChan', ctx.settings.locale)).then(resolve).catch(reject);
                } else {
                    bot.joinVoiceChannel(ctx.msg.member.voiceState.channelID).then(cnc => {
                        bot.music.connections.add(cnc);
                        return ctx.createMessage(localeManager.t('music-joinChan', ctx.settings.locale, {prefix: bot.config.mainPrefix}));
                    }).then(resolve).catch(reject);
                }
            }
        });
    }
};

exports.sources = {
    desc: 'View available music sources.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.createMessage({embed: {
                title: localeManager.t('music-sourcesTitle', ctx.settings.locale),
                description: '**' + localeManager.t('music-sources', ctx.settings.locale) + '**\n\n'
                + '**YouTube**: `https://youtube.com/watch?v=id` or `https://youtu.be/id`\n'
                + '**SoundCloud**: `https://soundcloud.com/user/song`\n'
                + '**Clyp**: `https://clyp.it/id`\n'
                + '**Twitch**: `https://twitch.tv/user`\n'
            }}).then(resolve).catch(reject);
        });
    }
};

exports.skip = {
    desc: 'Vote skip current song. Admins can override.',
    longDesc: 'Votes to skip the current song playing. Skip limit is half of unmuted people in current channel. Admins can force skip.',
    usage: '[force (admin only)]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!bot.music.connections.get(ctx.msg.channel.guild.id)) {
                ctx.createMessage(localeManager.t('music-noBotChan', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                if (ctx.msg.member.voiceState.channelID !== bot.music.connections.get(ctx.msg.channel.guild.id).channelID) {
                    ctx.createMessage(localeManager.t('music-notSameChan', ctx.settings.locale)).then(resolve).catch(reject);
                } else {
                    if (!bot.music.connections.get(ctx.msg.channel.guild.id).playing) {
                        ctx.createMessage(localeManager.t('music-notPlaying', ctx.settings.locale)).then(resolve).catch(reject);
                    } else {
                        if (!ctx.args[0] || ctx.args[0] !== 'force') {
                            if (!bot.music.skips.get(ctx.msg.channel.guild.id)) bot.music.skips.add({id: ctx.msg.channel.guild.id, count: 0, users: []});
                            let skips = bot.music.skips.get(ctx.msg.channel.guild.id);
                            if (!skips.users[ctx.msg.author.id]) {
                                skips.count++;
                                skips.users.push(ctx.msg.author.id);
                                let chan = ctx.msg.channel.guild.channels.get(bot.music.connections.get(ctx.msg.channel.guild.id).channelID);
                                if (skips.count >= Math.floor(chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf).length / 2)) {
                                    skips.count = 0;
                                    skips.users = [];
                                    let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                                    let qt = q[0];
                                    if (q[0].url === qt.url) bot.music.connections.get(ctx.msg.channel.guild.id).stopPlaying();
                                    ctx.createMessage(localeManager.t('music-skipped', ctx.settings.locale, {title: qt.info.title})).then(resolve).catch(reject);
                                    
                                } else {
                                    let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                                    ctx.createMessage(localeManager.t('music-voteSkip', ctx.settings.locale, {name: utils.formatUsername(ctx.msg.member), title: q[0].info.title, skipsLeft: skips.count, total: Math.floor(chan.voiceMembers.filter(m => !m.bot && !m.voiceState.selfDeaf).length)})).then(resolve).catch(reject);
                                }
                            } else {
                                ctx.createMessage(localeManager.t('music-voteSkipAlready', ctx.settings.locale)).then(resolve).catch(reject);
                            }
                        } else if (ctx.args[0] === 'force') {
                            if (!utils.isOwner(ctx.msg.author.id) || !utils.isAdmin(ctx.msg.author.id) || ctx.msg.author.id !== ctx.msg.channel.guild.ownerID || !ctx.msg.member.permission.has('administrator')) {
                                ctx.createMessage(localeManager.t('music-forceSkipNoPerms', ctx.settings.locale)).then(resolve).catch(reject);
                            } else {
                                if (!bot.music.skips.get(ctx.msg.channel.guild.id)) bot.music.skips.add({id: ctx.msg.channel.guild.id, count: 0, users: []});
                                let skips = bot.music.skips.get(ctx.msg.channel.guild.id);
                                let q = bot.music.queues.get(ctx.msg.channel.guild.id).q;
                                let qt = q[0];
                                skips.count = 0;
                                skips.users = [];
                                if (q[0].url === qt.url) bot.music.connections.get(ctx.msg.channel.guild.id).stopPlaying();
                                ctx.createMessage(localeManager.t('music-skipped', ctx.settings.locale, {title: qt.info.title})).then(resolve).catch(reject);
                            }
                        }
                    }
                }
            }
        });
    }
};
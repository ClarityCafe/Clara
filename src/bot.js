/*
 * Clara - Core file
 *
 * Contributed by:
 * Capuccino
 * Ovyerus
 *
 * Licensed under MIT. Copyright (c) 2017 Capuccino, Ovyerus and the repository contributors.
 */

// Framework imports
const Eris = require('eris');
const fs = require('fs');

//globals w

global.__baseDir = __dirname;
global.Promise = require('bluebird');
global.logger = require(`${__dirname}/lib/logger`);
global.localeManager = require(`${__dirname}/lib/localeManager`);

// Custom modules
const logger = require(`${__dirname}/lib/logger`);
const CommandHolder = require(`${__dirname}/lib/commands`);
const utils = require(`${__dirname}/lib/utils`);
const parseArgs = require(`${__dirname}/lib/argParser`);

// Setup stuff
const config = require(`${__dirname}/config.json`);
const bot = new Eris(config.token, {
    autoreconnect: true,
    seedVoiceConnections: true,
    maxShards: config.maxShards || 1,
    defaultImageFormat: 'png',
    defaultImageSize: 512,
    disableEvents: {
        TYPING_START: true
    }
});
var loadCommands = true;
var allowCommandUse = false;

// Create data files
try {
    require.resolve(`${__dirname}/data/data.json`);
} catch(err) {
    fs.mkdirSync(`${__dirname}/data/`);
    fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify({admins: [], blacklist: []}), e => {
        if (e) {
            throw e;
        } else {
            logger.info('Created data.json.');
        }
    });
}

try {
    require.resolve(`${__dirname}/data/prefixes.json`);
} catch(err) {
    fs.writeFile(`${__dirname}/data/prefixes.json`, JSON.stringify([]), e => {
        if (e) {
            throw e;
        } else {
            logger.info('Created prefixes.json.');
        }
    });
}

try {
    require.resolve(`${__dirname}/data/blacklistedGuilds.json`);
} catch (err) {
    fs.writeFile(`${__dirname}/data/blacklistedGuilds.json`, JSON.stringify([]), e => {
        if (e) {
            throw e;
        } else {
            logger.info('Created Blacklist.');
        }
    })
}

exports.bot = bot;

bot.db = require('rethinkdbdash')(config.rethinkOptions);
bot.commands = new CommandHolder();
bot.config = config;
bot.music = {
    skips: new Eris.Collection(Object),
    queues: new Eris.Collection(Object),
    connections: new Eris.Collection(Eris.VoiceConnection),
    streams: new Eris.Collection(Object),
    stopped: []
};

bot.settings = {
    guilds: new Eris.Collection(Object),
    users: new Eris.Collection(Object)
};

// Init
bot.on('ready', () => {
    if (loadCommands) {
        let meme;
        require(`${__dirname}/lib/commandLoader.js`).init().then(() => {
            logger.info(`Loaded ${bot.commands.length} ${bot.commands.length === 1 ? 'command' : 'commands'}.`);
            return localeManager.loadLocales();
        }).then(() => bot.db.tableList().run()).then(res => {
            meme = res;
            if (res.indexOf('guild_settings') === -1) {
                logger.info('Setting up "guild_settings" table in database.');
                return bot.db.tableCreate('guild_settings').run();
            } else {
                return null;
            }
        }).then(() => {
            if (meme.indexOf('user_settings') === -1) {
                logger.info('Setting up "user_settings" table in database.');
                return bot.db.tableCreate('user_settings').run();
            } else {
                return null;
            }
        }).then(() => {
            loadCommands = false;
            allowCommandUse = true;

            let altPrefixes = JSON.parse(fs.readFileSync(`${__dirname}/data/prefixes.json`));
            logger.info(`${bot.user.username} is connected to Discord and ready to use.`);
            logger.info(`Main prefix is '${config.mainPrefix}', can also use @mention.`);
            logger.info(`${altPrefixes.length > 0 ? `Alternative prefixes: '${altPrefixes.join("', ")}'` : 'No alternative prefixes.'}`);
        }).catch(err => {
            logger.error(`Experienced error while loading commands:\n${config.debug ? err.stack : err}`);
        });
    } else {
        logger.info('Reconnected to Discord from disconnect.');
    }

    bot.editStatus('online', {name: `${config.gameName || `${config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: config.gameURL ? 1 : 0, url: `${config.gameURL || null}`});
});

bot.on('shardReady', shard => {
    logger.custom('blue', 'shard/shardInfo', `shard ${shard} is ready!`);
});

bot.on('shardResume', shard => {
    logger.custom('blue', 'shard/shardInfo', `shard ${shard} has resumed.`);
});

bot.on('guildCreate', g => {
    let blacklist = require(`${__dirname}/data/blacklistedGuilds.json`);
    if (blacklist.includes(g.id)) {
        g.defaultChannel.createMessage("I'm sorry but your server was blacklisted. If you think this was done in error you can contact us in our server: discord.gg/ZgQkCkm").then(() => {
            logger.warn(`${g.id} (${g.name}) attempted to re-add the bot but guild ID in blacklist. Autoleaving...`).then(() => {
                g.leave();
            });
        });
    }
    if (g.members.filter(m => m.bot).size/ g.members.size >= 0.99 ) {
        logger.info(`Detected bot collection guild. Autoleaving and adding guild ID to blacklist... (${g.name} [${g.id}])`);
        blacklist.push(g.id);
        fs.writeFile(`${__baseDir}/data/blacklistedGuilds.json`, JSON.stringify(blacklist, '', '\t', err => {
            if (err) {
                logger.error('failed to add Guild ID to blacklist');
            } else {
                logger.info('Successfully added Guild ID to blacklist.')
            }
        }));
        g.leave();
    } else {
        bot.editStatus('online', {name: `${config.gameName || `${config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: config.gameURL ? 1 : 0, url: `${config.gameURL || null}`});
    }
});

bot.on('guildDelete', () => {
    bot.editStatus('online', {name: `${config.gameName || `${config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: config.gameURL ? 1 : 0, url: `${config.gameURL || null}`});
});

const prefixParser = require(`${__dirname}/lib/prefixParser.js`);

// Command handler
bot.on('messageCreate', msg => {
    if (!allowCommandUse || msg.author.id === bot.user.id || msg.author.bot || utils.isBlacklisted(msg.author.id)) return;
    if (!msg.channel.guild) {
        logger.custom('cyan', 'dm', loggerPrefix(msg) + msg.cleanContent);
        return;
    }

    prefixParser(msg.content).then(content => {
        if (content == null) return content;
        return parseArgs(content);
    }).then(res => {
        if (res == null) return;

        let {args, cmd, suffix} = res;

        if (bot.commands.getCommand(cmd)) {
            logger.cmd(loggerPrefix(msg) + msg.cleanContent);

            let settings = {};

            bot.getGuildSettings(msg.channel.guild.id).then(res => {
                settings.guild = res;
                return bot.getUserSettings(msg.author.id);
            }).then(res => {
                settings.user = res;
                settings.locale = settings.user.locale !== 'en-UK' ? settings.user.locale : settings.guild.locale;

                let cleanSuffix = msg.cleanContent.split(cmd)[1];
                let guildBot = msg.channel.guild.members.get(bot.user.id);

                let ctx = {msg, args, cmd, suffix, cleanSuffix, guildBot, settings};

                if (bot.commands.getCommand(cmd).adminOnly && utils.checkBotPerms(msg.author.id)) {
                    bot.commands.runCommand(cmd, bot, ctx).then(() => {
                        logger.cmd(loggerPrefix(msg) + `Successfully ran owner command '${cmd}'`); // eslint-disable-line prefer-template
                    }).catch(err => {
                        handleCmdErr(msg, cmd, err);
                    });
                } else if (bot.commands.getCommand(cmd).adminOnly) {
                    return null;
                } else {
                    bot.commands.runCommand(cmd, bot, ctx).then(() => {
                        logger.cmd(loggerPrefix(msg) + `Successfully ran command '${cmd}'`); // eslint-disable-line prefer-template
                        return null;
                    }).catch(err => {
                        handleCmdErr(msg, cmd, err);
                    });
                }
            }).catch(err => logger.error(err.stack));
        }

        return null;
    }).catch(err => {
        logger.customError('prefixParser', `Failed to parse message for prefix: ${err}${config.debug ? `\n${err.stack}` : ''}`);
    });
});

// Handle disconnect
bot.on('disconnect', () => {
    logger.warn('Disconnected from Discord.');
});
bot.on('shardDisconnect', (err, shard) => {
    if (err) logger.customError('shard/shardStatus', `Shard ${shard} disconnected. Reason ${err}`);
});

// Music Shit
bot.on('voiceChannelLeave', (mem, chan) => {
    /*if (chan.voiceMembers.filter(m => m.id !== bot.user.id && !m.bot).length === 0 && chan.voiceMembers.get(bot.user.id)) {
        setTimeout(() => {
            let c = bot.guilds.get(chan.guild.id).channels.get(chan.id);
            if (c.voiceMembers.filter(m => m.id !== bot.user.id && !m.bot).length === 0) {
                if (bot.music.connections.get(chan.guild.id).playing) bot.music.connetions.get(chan.guild.id).stopPlaying();
                bot.music.connections.get(chan.guild.id).leave();
            }
        }, 60000);
    }*/

    if (mem.id !== bot.user.id) return;
    if (bot.music.connections.get(chan.guild.id)) bot.music.connections.delete(chan.guild.id);
    if (bot.music.queues.get(chan.guild.id)) bot.music.queues.delete(chan.guild.id);
    if (bot.music.skips.get(chan.guild.id)) bot.music.skips.delete(chan.guild.id);
    if (bot.music.streams.get(chan.guild.id)) {
        bot.music.streams.delete(chan.guild.id);
    }
});

bot.on('voiceChannelSwitch', (mem, chan, old) => {
    if (mem.id !== bot.user.id) return;
    if (!bot.music.connections.get(old.id)) {
        bot.music.connections.add(chan);
    } else {
        bot.music.connections.delete(old);
        bot.music.connects.add(old);
    }
});

bot.connect();

// Functions

/**
 * Returns pre-formatted prefix to use in the logger.
 *
 * @param {Eris.Message} msg Message to use to get names of channels, user, etc.
 * @returns {String}
 */
function loggerPrefix(msg) {
    return msg.channel.guild ? `${msg.channel.guild.name} | ${msg.channel.name} > ${utils.formatUsername(msg.author)} (${msg.author.id}): ` : `Direct Message > ${utils.formatUsername(msg.author)} (${msg.author.id}): `;
}

/**
 * Handle errors from commands.
 *
 * @param {Eris.Message} msg Message to pass for sending messages.
 * @param {String} cmd Command name.
 * @param {Object} err The error object to analyse.
 */
function handleCmdErr(msg, cmd, err) {
    if (err.response) var resp = JSON.parse(err.response);
    if (resp && resp.code === 50013) {
        logger.warn(`Can't send message in '#${msg.channel.name}' (${msg.channel.id}), cmd from user '${
        utils.formatUsername(msg.author)}' (${msg.author.id})`);
        msg.author.getDMChannel().then(dm => {
            console.log(dm.id);
            return dm.createMessage(`It appears I was unable to send a message in \`#${msg.channel.name}\` on the server \`${msg.channel.guild.name}\`. Please give me the Send Messages permission or notify a mod or admin if you cannot do this.`);
        }).catch(() => logger.warn(`Couldn't get DM channel for/send DM to ${utils.formatUsername(msg.author)} (${msg.author.id})`));
    } else if (resp && /\{'code':.+, 'message':.+\}/.test(err.response) && resp.code !== 50013) {
        logger.warn(loggerPrefix(msg) + `Discord error running command "${cmd}":\n:${config.debug ? err.stack : err}`); // eslint-disable-line prefer-template
        let m = `Discord error while trying to execute \`${cmd}\`\n`;
        m += '```js\n';
        m += `Code: ${resp.code}. Message: ${resp.message}\n`;
        m += "``` If you feel this shouldn't be happening, join my support server. Invite can be found in the `invite` command.";
        msg.channel.createMessage(m);
    } else {
        logger.error(loggerPrefix(msg) + `Error running command "${cmd}":\n${config.debug ? err.stack || err : err}`); // eslint-disable-line prefer-template
        let m = `Experienced error while executing \`${cmd}\`\n`;
        m += '```js\n';
        m += err + '\n'; // eslint-disable-line prefer-template
        m += "``` If you feel this shouldn't be happening, join my support server. Invite can be found in the `invite` command.";
        msg.channel.createMessage(m);
    }
}

/**
 * Wait for a message in the specified channel from the specified user.
 *
 * @param {String} channelID ID of channel to wait in.
 * @param {String} userID ID of user to wait for.
 * @param {Function} [filter] Filter to pass to message. Must return true.
 * @param {Number} [timeout=15000] Time in milliseconds to wait for message.
 */
bot.awaitMessage = (channelID, userID, filter = () => true, timeout = 15000) =>
    new Promise((resolve, reject) => {
        if (!channelID || typeof channelID !== 'string') {
            reject(new TypeError('channelID is not string.'));
        } else if (!userID || typeof userID !== 'string') {
            reject(new TypeError('userId is not string.'));
        } else {
            var responded, rmvTimeout;

            var onCrt = msg => {
                if (msg.channel.id === channelID && msg.author.id === userID && filter(msg)) {
                    responded = true;
                    return msg;
                }
            };

            var onCrtWrap = msg => {
                var res = onCrt(msg);
                if (responded) {
                    bot.removeListener('messageCreate', onCrtWrap);
                    clearInterval(rmvTimeout);
                    resolve(res);
                }
            };

            bot.on('messageCreate', onCrtWrap);

            rmvTimeout = setTimeout(() => {
                if (!responded) {
                    bot.removeListener('messageCreate', onCrtWrap);
                    reject(new Error('Message await expired.'));
                }
            }, timeout);
        }
    });

/**
 * Get the settings for a guild.
 *
 * @param {String} guildID ID of guild to get settings for.
 * @returns {Promise<Object>}
 */
bot.getGuildSettings = guildID =>
    new Promise((resolve, reject) => {
        if (typeof guildID !== 'string') {
            reject(new TypeError('guildID is not string.'));
        } else {
            if (bot.settings.guilds.get(guildID)) {
                resolve(bot.settings.guilds.get(guildID));
            } else {
                bot.db.table('guild_settings').get(guildID).run().then(res => {
                    if (!res) {
                        return bot.initGuildSettings(guildID);
                    } else {
                        bot.settings.guilds.add(res);
                        resolve(res);
                    }
                }).then(res => {
                    if (res) {
                        resolve(res);
                    } else {
                        return null;
                    }
                }).catch(reject);
            }
        }
    });

/**
 * Initialize settings for a guild.
 *
 * @param {String} guildID ID of guild to init settings for.
 * @returns {Promise<Object>}
 */
bot.initGuildSettings = guildID =>
    new Promise((resolve, reject) => {
        if (typeof guildID !== 'string') {
            reject(new TypeError('guildID is not string.'));
        } else {
            let settings = {id: guildID, locale: 'en-UK', greeting: {enabled: false, channelID: null, message: null}};
            bot.settings.guilds.add(settings);
            bot.db.table('guild_settings').get(guildID).run().then(res => {
                if (res) {
                    return res;
                } else {
                    return bot.db.table('guild_settings').insert(settings).run();
                }
            }).then(res => {
                resolve(res);
            }).catch(reject);
        }
    });


/**
 * Edit a guild's settings.
 *
 * @param {String} guildID ID of guild to edit settings for.
 * @param {Object} settings Settings to change.
 * @returns {Promise<Object>}
 */
bot.setGuildSettings = (guildID, settings = {}) =>
    new Promise((resolve, reject) => {
        if (typeof guildID !== 'string') {
            reject(new TypeError('guildID is not string.'));
        } else if (Object.keys(settings).length === 0) {
            reject(new Error('No settings.'));
        } else {
            bot.db.table('guild_settings').get(guildID).update(settings).run().then(() =>
                bot.db.table('guild_settings').get(guildID)
            ).then(res => {
                if (!bot.settings.guilds.get(guildID)) {
                    bot.settings.guilds.add(res);
                } else {
                    bot.settings.guilds.remove(res);
                    bot.settings.guilds.add(res);
                }

                resolve(res);
            }).catch(reject);
        }
    });

/**
 * Get the settings for a user.
 *
 * @param {String} userID ID of user to get settings for.
 * @returns {Promise<Object>}
 */
bot.getUserSettings = userID =>
    new Promise((resolve, reject) => {
        if (typeof userID !== 'string') {
            reject(new TypeError('userID is not string.'));
        } else {
            if (bot.settings.users.get(userID)) {
                resolve(bot.settings.users.get(userID));
            } else {
                bot.db.table('user_settings').get(userID).run().then(res => {
                    if (!res) {
                        return bot.initUserSettings(userID);
                    } else {
                        bot.settings.users.add(res);
                        resolve(res);
                    }
                }).then(res => {
                    if (res) {
                        resolve(res);
                    } else {
                        return null;
                    }
                }).catch(reject);
            }
        }
    });

/**
 * Initialize settings for a user.
 *
 * @param {String} userID ID of user to init settings for.
 * @returns {Promise<Object>}
 */
bot.initUserSettings = userID =>
    new Promise((resolve, reject) => {
        if (typeof userID !== 'string') {
            reject(new TypeError('userID is not string.'));
        } else {
            let settings = {id: userID, locale: 'en-UK'};
            bot.settings.users.add(settings);
            bot.db.table('user_settings').get(userID).run().then(res => {
                if (res) {
                    return res;
                } else {
                    return bot.db.table('user_settings').insert(settings).run();
                }
            }).then(res => {
                resolve(res);
            }).catch(reject);
        }
    });

/**
 * Edit a user's settings.
 *
 * @param {String} userID ID of user to edit settings for.
 * @param {Object} settings Settings to change.
 * @returns {Promise<Object>}
 */
bot.setUserSettings = (userID, settings = {}) =>
    new Promise((resolve, reject) => {
        if (typeof userID !== 'string') {
            reject(new TypeError('userID is not string.'));
        } else if (Object.keys(settings).length === 0) {
            reject(new Error('No settings.'));
        } else {
            bot.db.table('user_settings').get(userID).update(settings).run().then(() =>
                bot.db.table('user_settings').get(userID)
            ).then(res => {
                if (!bot.settings.users.get(userID)) {
                    bot.settings.users.add(res);
                } else {
                    bot.settings.users.remove(res);
                    bot.settings.users.add(res);
                }

                resolve(res);
            }).catch(reject);
        }
    });
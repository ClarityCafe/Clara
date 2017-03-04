/*
 * owo-whats this - Core file
 * 
 * Contributed by:
 * | Capuccino
 * | Ovyerus
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

// Custom modules
const logger = require(`${__dirname}/lib/logger`);
const CommandHolder = require(`${__dirname}/lib/commands`);
const utils = require(`${__dirname}/lib/utils`);

// Setup stuff
const config = require(`${__dirname}/config.json`);
const bot = new Eris(config.token, {
    autoreconnect: true,
    seedVoiceConnections: true,
    maxShards: config.maxShards || 1,
    disableEvents: {
        TYPING_START: true
    }
});
var loadCommands = true;
var allowCommandUse = false;

// Create data files
try {
    require.resolve(`${__dirname}/data/data.json`);
} catch (err) {
    fs.mkdirSync(`${__dirname}/data/`);
    fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify({ admins: [], blacklist: [] }), e => {
        if (e) {
            throw e;
        } else {
            logger.info('Created data.json.');
        }
    });
}

try {
    require.resolve(`${__dirname}/data/prefixes.json`);
} catch (err) {
    fs.writeFile(`${__dirname}/data/prefixes.json`, JSON.stringify([]), e => {
        if (e) {
            throw e;
        } else {
            logger.info('Created prefixes.json.');
        }
    });
}

exports.bot = bot;

bot.logger = logger;
bot.commands = new CommandHolder();
bot.config = config;
bot.music = {
    skips: new Eris.Collection(Object),
    queues: new Eris.Collection(Object),
    connections: new Eris.Collection(Eris.VoiceConnection),
    streams: new Eris.Collection(Object),
    stopped: []
};

// Init
bot.on('ready', () => {
    if (loadCommands) {
        require(`${__dirname}/lib/commandLoader.js`).init().then(() => {
            var altPrefixes = JSON.parse(fs.readFileSync(`${__dirname}/data/prefixes.json`));
            logger.info(`Loaded ${bot.commands.length} ${bot.commands.length === 1 ? 'command' : 'commands'}.`);
            logger.info(`${bot.user.username} is connected to Discord and ready to use.`);
            logger.info(`Main prefix is '${config.mainPrefix}', can also use @mention.`);
            logger.info(`${altPrefixes.length > 0 ? `Alternative prefixes: '${altPrefixes.join("', ")}'` : 'No alternative prefixes.'}`);
            loadCommands = false;
            allowCommandUse = true;
        }).catch(err => {
            console.error(`Experienced error while loading commands:\n${config.debug ? err.stack : err}`);
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
    if (g.members.filter(m => m.bot).length >= Math.ceil(g.memberCount / 2)) {
        logger.info(`Detected bot collection guild. Autoleaving.... (${g.name} [${g.id}])`);
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
        if (content === undefined) return;

        var args = content.split(' ');
        var cmd = args.shift();
        var suffix = args.join(' ');
        var cleanSuffix = msg.cleanContent.split(' ');
        cleanSuffix.splice(0, 1);
        cleanSuffix = cleanSuffix.join(' ');
        var guildBot = msg.channel.guild.members.get(bot.user.id);

        var ctx = {msg, args, cmd, suffix, cleanSuffix, guildBot};

        if (bot.commands.getCommand(cmd)) {
            logger.cmd(loggerPrefix(msg) + msg.cleanContent);

            if (bot.commands.getCommand(cmd).adminOnly && (utils.isOwner(msg.author.id) || utils.isAdmin(msg.author.id))) {
                bot.commands.runCommand(cmd, bot, ctx).then(() => {
                    logger.cmd(loggerPrefix(msg) + `Successfully ran owner command '${cmd}'`);
                }).catch(err => {
                    handleCmdErr(msg, cmd, err);
                });
            } else if (bot.commands.getCommand(cmd).adminOnly) {
                return;
            } else {
                bot.commands.runCommand(cmd, bot, ctx).then(() => {
                    logger.cmd(loggerPrefix(msg) + `Successfully ran command '${cmd}'`);
                }).catch(err => {
                    handleCmdErr(msg, cmd, err);
                });
            }
        }
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
function loggerPrefix(msg) {
    return msg.channel.guild ? `${msg.channel.guild.name} | ${msg.channel.name} > ${utils.formatUsername(msg.author)} (${msg.author.id}): ` : `Direct Message > ${utils.formatUsername(msg.author)} (${msg.author.id}): `;
}

function handleCmdErr(msg, cmd, err) {
    if (err.response) var resp = JSON.parse(err.response);
    if (resp && resp.code === 50013) {
        logger.warn(`Can't send message in '#${msg.channel.name}' (${msg.channel.id}), cmd from user '${utils.formatUsername(msg.author)}' (${msg.author.id})`);
        msg.author.getDMChannel().then(dm => {
            console.log(dm.id);
            return dm.createMessage(`It appears I was unable to send a message in \`#${msg.channel.name}\` on the server \`${msg.channel.guild.name}\`. Please give me the Send Messages permission or notify a mod or admin if you cannot do this.`);
        }).catch(() => logger.warn(`Couldn't get DM channel for/send DM to ${utils.formatUsername(msg.author)} (${msg.author.id})`));
    } else if (resp && /\{'code':.+, 'message':.+\}/.test(err.response) && resp.code !== 50013) {
        logger.warn(loggerPrefix(msg) + `Discord error running command "${cmd}":\n:${config.debug ? err.stack : err}`);
        let m = `Discord error while trying to execute \`${cmd}\`\n`;
        m += '```js\n';
        m += `Code: ${resp.code}. Message: ${resp.message}\n`;
        m += "``` If you feel this shouldn't be happening, join my support server. Invite can be found in the `invite` command.";
        msg.channel.createMessage(m);
    } else {
        logger.error(loggerPrefix(msg) + `Error running command "${cmd}":\n${config.debug ? err.stack || err : err}`);
        let m = `Experienced error while executing \`${cmd}\`\n`;
        m += '```js\n';
        m += err + '\n';
        m += "``` If you feel this shouldn't be happening, join my support server. Invite can be found in the `invite` command.";
        msg.channel.createMessage(m);
    }
}

bot.awaitMessage = (channelID, userID, filter = function () { return true; }, timeout = 15000) => {
    return new Promise((resolve, reject) => {
        if (!channelID || typeof channelID !== 'string') {
            reject(new Error(`Unwanted type of channelID: got "${typeof channelID}" expected "string"`));
        } else if (!userID || typeof userID !== 'string') {
            reject(new Error(`Unwanted type of userID: got "${typeof userID}" expected "string"`));
        } else {
            var responded, rmvTimeout;

            var onCrt = (msg) => {
                if (msg.channel.id === channelID && msg.author.id === userID && filter(msg)) {
                    responded = true;
                    return msg;
                }
            };

            var onCrtWrap = (msg) => {
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
};
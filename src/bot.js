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

global.__baseDir = __dirname;
global.Promise = require('bluebird');
global.logger = require(`${__dirname}/lib/logger`);

// Custom modules
const commandsMod = require(`${__dirname}/lib/commands.js`);
const utils = require(`${__dirname}/lib/utils.js`);

// Setup stuff
const config = require(`${__dirname}/config.json`);
const bot = new Eris(config.token, {
    autoreconnect: true,
    disableEvents: {
        TYPING_START: true,
        PRESENCE_UPDATE: true,
        VOICE_STATE_UPDATE: true
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

exports.addCommand = commandsMod.addCommand;
exports.removeCommand = commandsMod.removeCommand;
exports.bot = bot;

bot.logger = logger;
bot.commands = commandsMod.commands;
bot.config = config;
bot.music = {
    skips : new Collection(Object),
    queues: new Collection(Object),
    current: new Collection(Object)
}

// Functions
function loggerPrefix(msg) {
    return msg.channel.guild ? `${msg.channel.guild.name} | ${msg.channel.name} > ${utils.formatUsername(msg.author)} (${msg.author.id}): ` : `Direct Message > ${utils.formatUsername(msg.author)} (${msg.author.id}): `;
}

function handleCmdErr(msg, cmd, err) {
    if (err == undefined || (err instanceof Array && err[0] == undefined)) return;
    if (err instanceof Array) {
        logger.warn(loggerPrefix(msg) + `Error when running command '${cmd}':\n${config.debug ? err[0].stack : err[0]}`);
    } else {
        logger.warn(loggerPrefix(msg) + `Error when running command '${cmd}':\n${config.debug ? err.stack : err}`);
    }

    if (!(err instanceof Array)) {
        var errMsg = `Unexpected error while executing command '${cmd}'\n`;
        errMsg += '```js\n';
        errMsg += err + '\n';
        errMsg += '```';
        msg.channel.createMessage(errMsg);
    }
}

bot.awaitMessage = (channelID, userID, filter=function(){return true}, timeout=15000) => {
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
            }

            var onCrtWrap = (msg) => {
                var res = onCrt(msg);
                if (responded) {
                    knife.removeListener('messageCreate', onCrtWrap);
                    clearInterval(rmvTimeout);
                    resolve(res);
                } 
            }

            knife.on('messageCreate', onCrtWrap);

            rmvTimeout = setTimeout(() => {
                if (!responded) {
                    knife.removeListener('messageCreate', onCrtWrap);
                    reject(new Error('Message await expired.'))
                }
            }, timeout);
        }
    });
}

// Init
bot.on('ready', () => {
    if (loadCommands) {
        require(`${__dirname}/lib/commandLoader.js`).init().then(() => {
            var altPrefixes = JSON.parse(fs.readFileSync(`${__dirname}/data/prefixes.json`));
            logger.info(`Loaded ${Object.keys(bot.commands).length} ${Object.keys(bot.commands).length === 1 ? 'command' : 'commands'}.`);
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
});

bot.on ('shardReady', shard => {
    logger.custom('blue', 'shard/shardInfo', `shard ${shard} is ready!`); 
});

bot.on('shardResume', shard => {
    logger.custom('blue', 'shard/shardInfo', `shard ${shard} has resumed.`);
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
        
        var ctx = {msg: msg, args: args, cmd: cmd, suffix: suffix, cleanSuffix: cleanSuffix, guildBot: guildBot };

        if (bot.commands[cmd]) {
            logger.cmd(loggerPrefix(msg) + msg.cleanContent);

            if (bot.commands[cmd].adminOnly && (utils.isOwner(msg.author.id) || utils.isAdmin(msg.author.id))) {
                bot.commands[cmd].main(bot, ctx).then(() => {
                    logger.cmd(loggerPrefix(msg) + `Successfully ran owner command '${cmd}'`);
                }).catch(err => {
                    handleCmdErr(msg, cmd, err);
                });
            } else if (bot.commands[cmd].adminOnly) {
                msg.channel.createMessage(`You do not have permission to do that.`);
            } else {
                bot.commands[cmd].main(bot, ctx).then(() => {
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
bot.on('shardDisconnect', (err,shard) => {
    if (err) logger.customError('shard/shardStatus', `shard${shard} disconnected. Reason ${err}`);
});

bot.connect();
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
const YAML = require('yamljs');

// global YAML parser 

global.__baseDir = __dirname;
global.Promise = require('bluebird');
global.logger = require(`${__dirname}/lib/logger`);

// Custom modules
const logger = require(`${__dirname}/lib/logger`);
const commandsMod = require(`${__dirname}/lib/commands`);
const utils = require(`${__dirname}/lib/utils`);

//Auth Function 
function getAuthToken () {
    try {
        // let's parse our JSON first
        let JsonToken = require(`${__dirname}/config.json`);
        return JsonToken.token;
    } catch(err) {
        //if JSON is undefined, we'll parse YAML then
        logger.warn('JSON not found!, checking for YAML...');
        let YAMLConfig = `${__dirname}/config.yml`;
        YAML.load(YAMLConfig);
        return YAML.parse(YAMLConfig.token);
    }
}

// Setup stuff
const config = require(`${__dirname}/config.json`);
const bot = new Eris(getAuthToken(), {
    autoreconnect: true,
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

exports.addCommand = commandsMod.addCommand;
exports.removeCommand = commandsMod.removeCommand;
exports.bot = bot;

bot.logger = logger;
bot.commands = commandsMod.commands;
bot.config = config;
bot.music = {
    skips: new Eris.Collection(Object),
    queues: new Eris.Collection(Object),
    channels: new Eris.Collection(Eris.Channel),
    guilds: new Eris.Collection(Eris.Guild),
    connections: new Eris.Collection(Eris.VoiceConnection),
    streams: new Eris.Collection(Object)
};

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
        m += '```';
        msg.channel.createMessage(m);
    } else {
        logger.error(loggerPrefix(msg) + `Error running command "${cmd}":\n${config.debug ? err.stack : err}`);
        let m = `Experienced error while executing \`${cmd}\`\n`;
        m += '```js\n';
        m += err + '\n';
        m += '```';
        msg.channel.createMessage(m);
    }
}

bot.awaitMessage = (channelID, userID, filter=function(){return true;}, timeout=15000) => {
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
    bot.editStatus('online',{name : `Spreading the love in ${bot.guilds.size} servers!`, type: 1, url: 'https://twitch.tv/osulive'});
});

bot.on ('shardReady', shard => {
    logger.custom('blue', 'shard/shardInfo', `shard ${shard} is ready!`); 
});

bot.on('shardResume', shard => {
    logger.custom('blue', 'shard/shardInfo', `shard ${shard} has resumed.`);
});

bot.on('onGuildJoin', () => {
    bot.editStatus('online',{name : `Spreading the love in ${bot.guilds.size} servers!`, type: 1, url: 'https://twitch.tv/osulive'});
});

bot.on('onGuildLeave', () => {
    bot.editStatus('online',{name : `Spreading the love in ${bot.guilds.size} servers!`, type: 1, url: 'https://twitch.tv/osulive'});
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
    if (err) logger.customError('shard/shardStatus', `Shard ${shard} disconnected. Reason ${err}`);
});

// Music shit
bot.on('voiceChannelJoin', (mem, chan) => {
    if (mem.id !== bot.user.id) return;
    if (!bot.music.channels.get(chan.id)) bot.music.channels.add(chan);
    if (!bot.music.guilds.get(chan.guild.id)) bot.music.guilds.add(chan.guild);
});

bot.on('voiceChannelLeave', (mem, chan) => {
    if (mem.id !== bot.user.id) return;
    if (bot.music.channels.get(chan.id)) bot.music.channels.delete(chan.id);
    if (bot.music.guilds.get(chan.guild.id)) bot.music.guilds.delete(chan.guild.id);
    if (bot.music.connections.get(chan.guild.id)) bot.music.connections.delete(chan.guild.id);
    if (bot.music.queues.get(chan.guild.id)) bot.music.queues.delete(chan.guild.id);
    if (bot.music.skips.get(chan.guild.id)) bot.music.skips.delete(chan.guild.id);
    if (bot.music.streams.get(chan.guild.id)) {
        bot.music.streams.get(chan.guild.id).stream.destroy();
        bot.music.streams.delete(chan.guild.id);
    }
});

bot.on('voiceChannelSwitch', (mem, chan, old) => {
    if (mem.id !== bot.user.id) return;
    if (bot.music.channels.get(old.id)) {
        bot.music.channels.delete(old.id);
        bot.music.channels.add(chan);
    }
});

bot.connect();


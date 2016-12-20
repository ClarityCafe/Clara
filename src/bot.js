/*
 * owo-whats this - Core file
 * 
 * Contributed by:
 * | Capuccino
 * | Ovyerus
 *
 * Licensed under MIT. Copyright (c) 2016 Capuccino, Ovyerus and the repository contributors.
 */

// Framework imports
const Discord = require('discord.js');
const fs = require('fs');

global.__baseDir = __dirname;

// Custom modules
const commandsMod = require(`${__dirname}/lib/commands.js`);
const logger = require(`${__dirname}/lib/logger.js`);
const utils = require(`${__dirname}/lib/utils.js`);

// Setup stuff
const config = require(`${__dirname}/config.json`);
const bot = new Discord.Client();

// Create data files
try {
    require.resolve(`${__dirname}/data/data.json`);
} catch(err) {
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

exports.addCommand = commandsMod.addCommand;
exports.removeCommand = commandsMod.removeCommand;
exports.bot = bot;

bot.logger = logger;
bot.commands = commandsMod.commands;
bot.config = config;

// Functions
function loggerPrefix(msg) {
    return msg.guild ? `${msg.guild.name} | ${msg.channel.name} > ${utils.formatUsername(msg.author)} (${msg.author.id}): ` : `Direct Message > ${utils.formatUsername(msg.author)} (${msg.author.id}): `;
}

function handleCmdErr(msg, cmd, err) {
    logger.warn(loggerPrefix(msg) + `Error when running command '${cmd}':\n${err instanceof Array ? config.debug : err[0].stack ? err[0] : config.debug ? err.stack : err}`);
    if (!(err instanceof Array)) {
        var errMsg = `Unexpected error while executing command '${cmd}'\n`;
        errMsg += '```js\n';
        errMsg += err + '\n';
        errMsg += '```';
        msg.channel.sendMessage(errMsg);
    }
}

// Init
bot.on('ready', () => {
    require(`${__dirname}/lib/commandLoader.js`).init().then(() => {
        var altPrefixes = JSON.parse(fs.readFileSync(`${__dirname}/data/prefixes.json`));
        logger.info(`Loaded ${Object.keys(bot.commands).length} ${Object.keys(bot.commands).length === 1 ? 'command' : 'commands'}.`);
        logger.info(`${bot.user.username} is connected to Discord and ready to use.`);
        logger.info(`Main prefix is '${config.mainPrefix}', can also use @mention.`);
        logger.info(`${altPrefixes.length > 0 ? `Alternative prefixes: '${altPrefixes.join("', ")}'`: 'No alternative prefixes.'}`);
    }).catch(err => {
        console.error(`Experienced error while loading commands:\n${config.debug ? err.stack : err}`);
    });
});

// Command handler
bot.on('message', msg => {
    if (msg.author.id === bot.user.id || msg.author.bot || utils.isBlacklisted(msg.author.id)) return;
    if (!msg.guild) {
        logger.custom('cyan', 'dm', loggerPrefix(msg) + msg.cleanContent);
        return;
    }

    require(`${__dirname}/lib/prefixParser.js`)(msg.content).then(content => {
        if (content ===  undefined) return;

        var args = content.split(' ');
        var cmd = args.shift();
        var suffix = args.join(' ');
        var cleanSuffix = msg.cleanContent.split(' ');
        cleanSuffix.splice(0, 1);
        cleanSuffix = cleanSuffix.join(' ');
        console.log(cleanSuffix);
        var guildBot;
        msg.guild ? guildBot = msg.guild.members.find('id', bot.user.id) : guildBot = null;
        var ctx = {msg: msg, args: args, cmd: cmd, suffix: suffix, cleanSuffix: cleanSuffix, guildBot: guildBot};

        if (bot.commands[cmd]) {
            logger.cmd(loggerPrefix(msg) + msg.cleanContent);

            if (bot.commands[cmd].adminOnly && (utils.isOwner(msg.author.id) || utils.isAdmin(msg.author.id))) {
                bot.commands[cmd].main(bot, ctx).then(() => {
                    logger.cmd(loggerPrefix(msg) + `Successfully ran owner command '${cmd}'`);
                }).catch(err => {
                    handleCmdErr(msg, cmd, err);
                });
            } else if (bot.commands[cmd].adminOnly) {
                msg.channel.sendMessage(`You do not have permission to do that.`);
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
bot.on('disconnected', () => {
    console.log('disconnected from Discord, retrying...');
    var p;
    !config.useEmail ? p = bot.login(config.token) : p = bot.login(config.email, config.password);
    p.catch(err => {
        console.log(`Error when attempting to reconnect to Discord, terminating...\n${err}`);
        process.exit(1);
    });
});

!config.useEmail ? bot.login(config.token) : bot.login(config.email, config.password);

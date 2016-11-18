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
const Promise = require('bluebird');
const chalk = require('chalk');
const fs = require('fs');
const util = require('util');

global._baseDir = __dirname;

// Custom modules
const commandLoader = require(`${__dirname}/lib/commandLoader.js`);
const commandsMod = require(`${__dirname}/lib/commands.js`);
const logger = require(`${__dirname}/lib/logger.js`);

// Setup stuff
const config = require(`${__dirname}/config.json`);
const bot = new Discord.Client();

try {
    require.resolve(`${__dirname}/data/data.json`);
} catch(err) {
    fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify({admins: [], blacklist: []}), e => {
        if (e) {
            throw e;
        } else {
            logger.info('Created data.json file.');
        }
    });
}

exports.addCommand = commandsMod.addCommand;
exports.removeCommand = commandsMod.removeCommand;
exports.bot = bot;

bot.logger = logger;
bot.commands = commandsMod.commands;
bot.isAdmin = (userID) => {
    return thingy = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`)).admins
}
bot.isOwner = (userID) => {
    return userID === config.ownerID;
}

// Functions
function loggerPrefix(msg) {
    return msg.guild ? `${msg.guild.name} | ${msg.channel.name} > ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}): ` : `Direct Message > ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}): `;
}

function handleCmdErr(msg, cmd, err) {
    logger.warn(loggerPrefix(msg) + `Error when running command '${cmd}':\n${err instanceof Array ? config.debug ? err[0].stack : err[0] : config.debug ? err.stack : err}`)
    if ((err instanceof Array) === false) {
        var errMsg = `Unexpected error while executing command '${cmd}'\n`;
        errMsg += '```js\n';
        errMsg += err + '\n';
        errMsg += '```';
        msg.channel.sendMessage(errMsg);
    }
}

// Init
bot.on('ready', () => {
    commandLoader.init().then(() => {
        var altPrefixes = JSON.parse(fs.readFileSync(`${__dirname}/data/prefixes.json`));
        logger.info(`Loaded ${Object.keys(bot.commands).length} ${Object.keys(bot.commands).length === 1 ? 'command' : 'commands'}.`);
        logger.info(`${bot.user.username} is connected to Discord and ready to use.`);
        logger.info(`Main prefix is '${config.mainPrefix}', can also use @mention.`);
        logger.info(`${altPrefixes.length > 0 ? `Alternative prefixes: '${altPrefixes.join("', ")}'`: 'No alternative prefixes.'}`);
    }).catch(err => {
        console.error(`Experienced error while loading commands: ${err}`);
    });
    bot.config = config;
});

// Command handler
bot.on("message", msg => {
    if (msg.author.id === bot.user.id || msg.author.bot || JSON.stringify(fs.readFileSync(`${__dirname}/data/data.json`)).indexOf(msg.author.id) > -1) return;
    require(`${__dirname}/lib/prefixParser.js`)(msg.content).then(content => {
        if (!msg.guild && content == undefined) logger.custom('cyan', 'dm', loggerPrefix(msg) + msg.cleanContent);
        if (content == undefined) return;

        var args = content.split(' ');
        var cmd = args.shift();
        var suffix = args.join(' ');
        var guildBot;
        msg.guild ? guildBot = msg.guild.members.find('id', bot.user.id) : guildBot = null;
        var ctx = {msg: msg, args: args, cmd: cmd, suffix: suffix, guildBot: guildBot};

        if (bot.commands[cmd]) {
            logger.cmd(loggerPrefix(msg) + msg.cleanContent);

            if (bot.commands[cmd].adminOnly && (bot.isOwner(msg.author.id) || bot.isAdmin(msg.author.id))) {
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
                })
            }
        }
    }).catch(err => {
        logger.customError('prefixParser', `Failed to parse message for prefix: ${err}`);
    });
});

// Handle disconnect
bot.on('disconnected', () => {
    console.log('disconnected from Discord, retrying...');
    bot.login(config.token).catch(err => {
        console.log(`Error when attempting to reconnect to Discord, terminating...\n${err}`);
        process.exit(1);
    });
});

bot.login(config.token);
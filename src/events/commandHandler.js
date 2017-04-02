/* eslint-env node */

const prefixParser = require(`${__baseDir}/modules/prefixParser`);
const parseArgs = require(`${__baseDir}/modules/argParser`);
const utils = require(`${__baseDir}/modules/utils`);
const config = require(`${__baseDir}/config.json`);

module.exports = bot => {
    bot.on('messageCreate', msg => {
        if (!bot.allowCommandUse || msg.author.id === bot.user.id || msg.author.bot || utils.isBlacklisted(msg.author.id)) return;
        if (!msg.channel.guild) {
            logger.custom('cyan', 'dm', loggerPrefix(msg) + msg.cleanContent);
            return;
        }

        prefixParser(bot, msg.content).then(content => {
            if (content == null) return content;
            return parseArgs(content);
        }).then(res => {
            if (res == null) return;

            let {args, cmd, suffix} = res;

            if (bot.commands.checkCommand(cmd)) {
                logger.cmd(loggerPrefix(msg) + msg.cleanContent);

                let settings = {};

                bot.getGuildSettings(msg.channel.guild.id).then(res => {
                    settings.guild = res;
                    return bot.getUserSettings(msg.author.id);
                }).then(res => {
                    settings.user = res;
                    settings.locale = settings.user.locale !== localeManager.fallbackLocale ? settings.user.locale : settings.guild.locale;

                    let cleanSuffix = msg.cleanContent.split(cmd)[1];
                    let guildBot = msg.channel.guild.members.get(bot.user.id);

                    let ctx = {msg, args, cmd, suffix, cleanSuffix, guildBot, settings};

                    if (args.length > 0 && bot.commands.getCommand(cmd).subcommands && bot.commands.getCommand(cmd).subcommands[args[0]]) {
                        ctx.args = ctx.args.slice(1);
                        if ((bot.commands.getCommand(cmd).adminOnly || bot.commands.getCommand(cmd).subcommands[args[0]].adminOnly) && utils.checkBotPerms(msg.author.id)) {
                            bot.commands.runCommand(cmd, bot, ctx, args[0]).then(() => {
                                logger.cmd(loggerPrefix(msg) + `Successfully ran owner command '${cmd}'`); // eslint-disable-line prefer-template
                            }).catch(err => {
                                handleCmdErr(msg, cmd, err);
                            });
                            return null;
                        } else if (bot.commands.getCommand(cmd).adminOnly || bot.commands.getCommand(cmd).subcommands[args[0]]) {
                            return null;
                        } else {
                            bot.commands.runCommand(cmd, bot, ctx, args[0]).then(() => {
                                logger.cmd(loggerPrefix(msg) + `Successfully ran command '${cmd}'`); // eslint-disable-line prefer-template
                                return null;
                            }).catch(err => {
                                handleCmdErr(msg, cmd, err);
                            });
                            return null;
                        }
                    } else {
                        if (bot.commands.getCommand(cmd).adminOnly && utils.checkBotPerms(msg.author.id)) {
                            bot.commands.runCommand(cmd, bot, ctx).then(() => {
                                logger.cmd(loggerPrefix(msg) + `Successfully ran owner command '${cmd}'`); // eslint-disable-line prefer-template
                            }).catch(err => {
                                handleCmdErr(msg, cmd, err);
                            });
                            return null;
                        } else if (bot.commands.getCommand(cmd).adminOnly) {
                            return null;
                        } else {
                            bot.commands.runCommand(cmd, bot, ctx).then(() => {
                                logger.cmd(loggerPrefix(msg) + `Successfully ran command '${cmd}'`); // eslint-disable-line prefer-template
                                return null;
                            }).catch(err => {
                                handleCmdErr(msg, cmd, err);
                            });
                            return null;
                        }
                    }
                }).catch(err => logger.error(err.stack));
            }

            return null;
        }).catch(err => {
            logger.customError('prefixParser', `Failed to parse message for prefix: ${err}${config.debug ? `\n${err.stack}` : ''}`);
        });
    });
};

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
    if (err.response && typeof err.response === 'string') var resp = JSON.parse(err.response);
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
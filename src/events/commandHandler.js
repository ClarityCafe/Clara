/* eslint-env node */

const {parseArgs, parsePrefix} = require(`${__baseDir}/modules/messageParser`);
const {Context} = require(`${__baseDir}/modules/CommandHolder`);
const {formatUsername} = require(`${__baseDir}/modules/utils`);

module.exports = bot => {
    bot.on('messageCreate', msg => {
        if (!msg.author) console.log(msg);
        if (!bot.allowCommandUse || !msg.author || msg.author.id === bot.user.id || msg.author.bot || bot.isBlacklisted(msg.author.id)) return;
        if (!msg.channel.guild) {
            logger.custom('cyan', 'dm', loggerPrefix(msg) + msg.cleanContent);
            return;
        }

        let outer = {msg};
        parsePrefix(msg.content, bot.prefixes).then(content => {
            if (!content) return null;
            return parseArgs(content);
        }).then(res => {
            if (!res) return null;
            if (!bot.commands.checkCommand(res.cmd)) {
                if (RegExp(`^<@!?${bot.user.id}> ?.+$`).test(msg.content) && bot.commands.getCommand('chat')) {
                    res.cmd = 'chat';
                    res.suffix = msg.content.split(' ')[1] + res.suffix
                    res.args = [msg.content.split(' ')[1]].concat(res.args)
                } else {
                    return;
                }
            }

            res.cleanSuffix = msg.cleanContent.split(res.cmd).slice(1).join(res.cmd);
            Object.assign(outer, res);
            return bot.getGuildSettings(msg.channel.guild.id);
        }).then(settings => {
            if (!settings) return null;

            outer.settings = {guild: settings};
            return bot.getUserSettings(msg.author.id);
        }).then(settings => {
            if (!settings) return null;

            outer.settings.user = settings;
            outer.settings.locale = settings.locale !== localeManager.defaultLocale ? settings.locale : outer.settings.guild.locale;
            outer.cleanSuffix = msg.cleanContent.split(outer.cmd).slice(1).join(outer.cmd);
            outer.guildBot = msg.channel.guild.members.get(bot.user.id);

            let ctx = new Context(outer);

            return bot.commands.runCommand(ctx.cmd, ctx);
        }).then(res => {
            if (!res) return null;
            logger.cmd(`${loggerPrefix(msg)}${outer.cmd}`);
        }).catch(err => handleCmdErr(msg, outer.cmd, err));
    });

    /**
     * Returns pre-formatted prefix to use in the logger.
     *
     * @param {Eris.Message} msg Message to use to get names of channels, user, etc.
     * @returns {String} Formatted string.
     */
    function loggerPrefix(msg) {
        return msg.channel.guild ? `${msg.channel.guild.name} | ${msg.channel.name} > ${formatUsername(msg.author)} (${msg.author.id}): ` : `Direct Message > ${formatUsername(msg.author)} (${msg.author.id}): `;
    }

    /**
     * Handle errors from commands.
     *
     * @param {Eris.Message} msg Message to pass for sending messages.
     * @param {String} cmd Command name.
     * @param {Object} err The error object to analyse.
     * @returns {Promise} .
     */
    function handleCmdErr(msg, cmd, err) {
        return new Promise((resolve, reject) => {
            let resp = typeof err.response === 'string' && /^\{'code':\d+, 'message':.*\}$/.test(err.response) ? JSON.parse(err.response) : null;

            if (resp && resp.code === 50013 && !msg.channel.guild.members.get(bot.user.id).permissions.has('sendMessages')) {
                logger.warn(`Can't send message in '#${msg.channel.name}' (${msg.channel.id}), cmd from user '${bot.formatUser(msg.author)}' (${msg.author.id})`);

                msg.author.getDMChannel().then(dm => {
                    console.log(dm.id);
                    return dm.createMessage(`It appears I was unable to send a message in \`#${msg.channel.name}\` on the server \`${msg.channel.guild.name}\`.\nPlease give me the Send Messages permission or notify a mod or admin if you cannot do this.`);
                }).then(resolve).catch(() => logger.warn(`Couldn't get DM channel for/send DM to ${bot.formatUser(msg.author)} (${msg.author.id})`));
            } else if (resp && resp.code !== 50013) {
                logger.warn(`${loggerPrefix(msg)}Discord error while running command "${cmd}":\n${err.stack}`);
                    
                let embed = {
                    title: 'Error',
                    description: `An error occurred while trying to execute command \`${cmd}\``,
                    color: 0xF44336,
                    timestamp: new Date(),
                    footer: {text: 'Powered by Clara'},
                    fields: [
                        {
                            name: '\u200b',
                            value: '```js\n'
                            + `Code: ${resp.code}\n`
                            + `Message: ${resp.message}\n`
                            + '```\n'
                            + 'This has been logged, but if you wish to report this now so it can get fixed faster, you can join my [**support server**](https://discord.gg/rmMTZue).'
                        }
                    ]
                };

                if (!bot.hasPermission('embedLinks', msg.channel)) {
                    let content = bot.flattenEmbed(embed);
                    msg.channel.createMessage(content).then(resolve).catch(reject);
                } else {
                    msg.channel.createMessage({embed}).then(resolve).catch(reject);
                }
            } else {
                logger.error(`${loggerPrefix(msg)}Error running command "${cmd}":\n${err.stack}`);

                let embed = {
                    title: 'Whoops!',
                    description: `An error occurred while trying to execute command \`${cmd}\``,
                    color: 0xF44336,
                    timestamp: new Date(),
                    footer: {text: 'Powered by Clara'},
                    fields: [
                        {
                            name: '\u200b',
                            value: '```js\n'
                            + `${err}\n`
                            + '```\n'
                            + 'This has been logged, but if you wish to report this now so it can get fixed faster, you can join my [**support server**](https://discord.gg/rmMTZue).'
                        }
                    ]
                };

                if (!bot.hasPermission('embedLinks', msg.channel)) {
                    let content = bot.flattenEmbed(embed);
                    msg.channel.createMessage(content).then(resolve).catch(reject);
                } else {
                    msg.channel.createMessage({embed}).then(resolve).catch(reject);
                }
            }
        });
    }
};
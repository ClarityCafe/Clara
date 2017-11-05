/**
 * @file Main command handler.
 * @author Capuccino
 * @author Ovyerus
 */

const path = require('path');
const {parsePrefix} = require(path.resolve(__dirname, '../modules', 'messageParser'));
const {Context} = require(path.resolve(__dirname, '../modules', 'CommandHolder'));

module.exports = bot => {
    bot.on('messageCreate', async msg => {
        if (!msg.author) console.log(msg);
        if (!bot.allowCommandUse || !msg.author || msg.author.id === bot.user.id || msg.author.bot || bot.isBlacklisted(msg.author.id) || !msg.channel.guild) return;

        let cleaned = parsePrefix(msg.content, bot.prefixes);

        if (cleaned === msg.content) return;

        let cmd = cleaned.split(' ')[0];
         
        if (!bot.commands.getCommand(cmd) && !(RegExp(`^<@!?${bot.user.id}>\s?.+$`) && bot.commands.getCommand('chat'))) return; // eslint-disable-line

        let settings = {};
        settings.guild = await bot.getGuildSettings(msg.channel.guild.id);
        settings.user = await bot.getUserSettings(msg.author.id);
        settings.locale = settings.user.locale !== bot.localeManager.defaultLocale ? settings.user.locale : settings.guild.locale;

        let ctx = new Context(msg, bot, settings);
        ctx.cmd = cmd;

        try {
            await bot.commands.runCommand(ctx);
        } catch(err) {
            await handleCmdErr(msg, cmd, err);
        }
    });

    /**
     * Returns pre-formatted prefix to use in the logger.
     *
     * @param {Eris.Message} msg Message to use to get names of channels, user, etc.
     * @returns {String} Formatted string.
     */
    function loggerPrefix(msg) {
        return `${msg.channel.guild.id} > ${msg.author.id}: `;
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
                            +  `\n${err.stack.split('\n')[1]}`
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
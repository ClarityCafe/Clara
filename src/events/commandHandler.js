/* eslint-env node */

const {parseArgs, parsePrefix} = require(`${__baseDir}/modules/messageParser`);
const {Context} = require(`${__baseDir}/modules/CommandHolder`);

module.exports = bot => {
    bot.on('messageCreate', msg => {
        if (!msg.author) console.log(msg);

        if (!bot.useCommands || !msg.author || msg.author.id === bot.user.id || msg.author.bot || bot.isBlacklisted(msg.author.id)) return;

        if (!msg.channel.guild) {
            logger.custom('cyan', 'dm', loggerPrefix(msg) + msg.cleanContent);
            return;
        }

        let outer = {msg};
        parsePrefix(msg.content, bot.config.prefixes).then(content => {
            if (!content) return null;

            return parseArgs(content);
        }).then(res => {
            if (!res) return null;
            if (/^vs$/i.test(res.cmd)) res.cmd = 'vs';
            if (!bot.commands.checkCommand(res.cmd)) return null;
            
            res.cleanSuffix = msg.cleanContent.split(res.cmd).slice(1).join(res.cmd);
            Object.assign(outer, res);
            return bot.getSettings(msg.channel.guild.id);
        }).then(settings => {
            if (!settings) return null;

            Object.assign(outer, {settings});
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
        return msg.channel.guild ? `${msg.channel.guild.name} | ${msg.channel.name} > ${bot.formatUser(msg.author)} (${msg.author.id}): ` : `Direct Message > ${bot.formatUser(msg.author)} (${msg.author.id}): `;
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
            bot.formatUser(msg.author)}' (${msg.author.id})`);
            msg.author.getDMChannel().then(dm => {
                console.log(dm.id);
                return dm.createMessage(`It appears I was unable to send a message in \`#${msg.channel.name}\` on the server \`${msg.channel.guild.name}\`. Please give me the Send Messages permission or notify a mod or admin if you cannot do this.`);
            }).catch(() => logger.warn(`Couldn't get DM channel for/send DM to ${bot.formatUser(msg.author)} (${msg.author.id})`));
        } else if (resp && /\{'code':.+, 'message':.+\}/.test(err.response) && resp.code !== 50013) {
            logger.warn(loggerPrefix(msg) + `Discord error running command "${cmd}":\n:${err.stack}`); // eslint-disable-line prefer-template
            let m = `Discord error while trying to execute \`${cmd}\`\n`;
            m += '```js\n';
            m += `Code: ${resp.code}. Message: ${resp.message}\n`;
            m += "``` If you feel this shouldn't be happening, join my support server. Invite can be found in the `invite` command.";
            msg.channel.createMessage(m);
        } else {
            logger.error(loggerPrefix(msg) + `Error running command "${cmd}":\n${err.stack}`); // eslint-disable-line prefer-template
            let m = `Experienced error while executing \`${cmd}\`\n`;
            m += '```js\n';
            m += err + '\n'; // eslint-disable-line prefer-template
            m += "``` If you feel this shouldn't be happening, join my support server. Invite can be found in the `invite` command.";
            msg.channel.createMessage(m);
        }
    }
};
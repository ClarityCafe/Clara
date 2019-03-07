/**
 * @file Main command handler.
 * @author Capuccino
 * @author Ovyerus
 */

const {Constants: {GatewayOPCodes}} = require('eris');
const path = require('path');
const fs = require('fs');
const {parsePrefix} = require(path.resolve(__dirname, '../modules', 'messageParser'));
const {Context} = require(path.resolve(__dirname, '../modules', 'CommandHolder'));
var version;

try {
    version = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../', '../', './package.json'))).version;
} catch(_) {
    version = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../', '../', '../', './package.json'))).version;
}

module.exports = bot => {
    // bot.on('messageCreate', async msg => {
    //     if (!msg.author) console.log(msg);
    //     if (!bot.allowCommandUse || !msg.author || msg.author.id === bot.user.id || msg.author.bot || bot.isBlacklisted(msg.author.id) || !msg.channel.guild) return;

    //     let cleaned = parsePrefix(msg.content, bot.prefixes);

    //     if (cleaned === msg.content) return;

    //     let cmd = cleaned.split(' ')[0];

    //     if (!bot.commands.getCommand(cmd) && !(RegExp(`^<@!?${bot.user.id}>\s?.+$`) && bot.commands.getCommand('chat'))) return; // eslint-disable-line

    //     let settings = {};
    //     settings.guild = await bot.getGuildSettings(msg.channel.guild.id);
    //     settings.user = await bot.getUserSettings(msg.author.id);
    //     settings.locale = settings.user.locale !== bot.localeManager.defaultLocale ? settings.user.locale : settings.guild.locale;

    //     let ctx = new Context(msg, bot, settings);
    //     ctx.cmd = cmd;

    //     try {
    //         await bot.commands.runCommand(ctx);
    //     } catch(err) {
    //         await handleCmdErr(msg, cmd, err);
    //     }
    // });

    bot.on('rawWS', async packet => {
        if (!bot.allowCommandUse || packet.op !== GatewayOPCodes.EVENT || packet.t !== 'MESSAGE_CREATE' || !packet.d.content ||
            parsePrefix(packet.d.content, bot.prefixes) === packet.d.content) return;

        const ctx = new Context(packet.d, bot);
        const settings = {
            guild: ctx.guild ? await bot.getGuildSettings(ctx.guild.id) : {},
            user: await bot.getUserSettings(ctx.author.id)
        };

        settings.locale = settings.user.locale !== bot.localeManager.defaultLocale
            ? settings.user.locale
            : settings.guild.locale;

        ctx.settings = settings;

        try {
            await bot.commands.runCommand(ctx);
        } catch(err) {
            await handleCmdErr(ctx, err);
        }
    });

    // Message await handler.
    bot.on('messageCreate', msg => {
        let awaiting = bot._currentlyAwaiting[msg.channel.id + msg.author.id];

        // Test if something is being awaited, if it does, try the filter and return if it doesnt return a truthy.
        if (!awaiting || !awaiting.filter(msg)) return;

        // Resolve and clean up.
        awaiting.p.resolve(msg);
        clearTimeout(awaiting.timer);
        delete bot._currentlyAwaiting[msg.channel.id + msg.author.id];
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
     * @param {Context} ctx Context to send error for.
     * @param {Object} err The error object to analyse.
     * @returns {Promise} .
     */
    function handleCmdErr(ctx, err) {
        return new Promise((resolve, reject) => {
            let resp = typeof err.response === 'string' && /^\{'code':\d+, 'message':.*\}$/.test(err.response) ? JSON.parse(err.response) : null;

            if (resp && resp.code === 50013 && !ctx.channel.guild.members.get(bot.user.id).permissions.has('sendMessages')) {
                logger.warn(`Can't send message in '#${ctx.channel.name}' (${ctx.channel.id}), cmd from user '${bot.formatUser(ctx.author)}' (${ctx.author.id})`);

                ctx.author.getDMChannel().then(dm => {
                    console.log(dm.id);
                    return dm.createMessage(`It appears I was unable to send a message in \`#${ctx.channel.name}\` on the server \`${ctx.channel.guild.name}\`.\nPlease give me the Send Messages permission or notify a mod or admin if you cannot do this.`);
                }).then(resolve).catch(() => logger.warn(`Couldn't get DM channel for/send DM to ${bot.formatUser(ctx.author)} (${ctx.author.id})`));
            } else if (resp && resp.code !== 50013) {
                logger.warn(`${loggerPrefix(ctx)}Discord error while running command "${ctx.cmd}":\n${err.stack}`);

                let embed = {
                    title: 'Error',
                    description: `An error occurred while trying to execute command \`${ctx.cmd}\``,
                    color: 0xF44336,
                    timestamp: new Date(),
                    footer: {text: `Clara Version ${version}`},
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

                if (!bot.hasPermission('embedLinks', ctx.channel)) {
                    let content = bot.flattenEmbed(embed);
                    ctx.channel.createMessage(content).then(resolve).catch(reject);
                } else {
                    ctx.channel.createMessage({embed}).then(resolve).catch(reject);
                }
            } else {
                logger.error(`${loggerPrefix(ctx)}Error running command "${ctx.cmd}":\n${err.stack}`);

                let embed = {
                    title: 'Whoops!',
                    description: `An error occurred while trying to execute command \`${ctx.cmd}\``,
                    color: 0xF44336,
                    timestamp: new Date(),
                    footer: {text: `Clara Version ${version}`},
                    fields: [
                        {
                            name: '\u200b',
                            value: '```js\n'
                            + `${err}\n`
                            +  `\n${err.stack.split('\n')[1].trim()}`
                            + '```\n'
                            + 'This has been logged, but if you wish to report this now so it can get fixed faster, you can join my [**support server**](https://discord.gg/rmMTZue).'
                        }
                    ]
                };

                if (!bot.hasPermission('embedLinks', ctx.channel)) {
                    let content = bot.flattenEmbed(embed);
                    ctx.channel.createMessage(content).then(resolve).catch(reject);
                } else {
                    ctx.channel.createMessage({embed}).then(resolve).catch(reject);
                }
            }
        });
    }
};
/**
 * @file Ready event that handles loading commands, locales, and the database tables if need be.
 * @author Capuccino
 * @author Ovyerus
 */

const path = require('path');

module.exports = bot => {
    bot.on('ready', async () => {
        if (bot.loadCommands) {
            try {
                let {prefixes, blacklist, admins} = await bot.getDataSettings();
                bot.admins = admins;
                bot.blacklist = blacklist;
                bot.prefixes = prefixes.concat([`<@${bot.user.id}> `, `<@!${bot.user.id}> `, bot.config.mainPrefix]);

                await bot.localeManager.loadLocales(bot);
                logger.info(`Loaded ${Object.keys(bot.localeManager.locales).length} locales.`);

                require(path.resolve(__dirname, '../modules', 'loader'))(bot);
                logger.info(`Loaded ${bot.commands.length} ${bot.commands.length === 1 ? 'command' : 'commands'}.`);

                bot.loadCommands = false;
                bot.allowCommandUse = true;

                logger.info(`${bot.user.username} is connected to Discord and is ready to use.`);
                logger.info('--------------------');
                logger.info(`Owner: ${bot.config.ownerID}`);
                logger.info(`Admins: ${admins.join(', ')}`);
                logger.info(`Blacklist: ${blacklist.join(', ')}`);
                logger.info(`Prefixes: "${[bot.config.mainPrefix, '@mention'].concat(prefixes).join('", "')}"`);
                logger.info('--------------------\n');
            } catch(err) {
                logger.error(`Error while starting up:\n${err.stack}`);
            }
        } else logger.info('Reconnected to Discord from disconnection.');
        if (!bot.config.gameURL || bot.config.gameURL === null) {
            await bot.editStatus('online', {
                name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`,
                type: 0,
                url: null
            });
        } else { 
            await bot.editStatus('online', {
                name: `${bot.config.gameName}` || `${bot.config.mainPrefix} for commands! | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`,
                type: 1,
                url: bot.config.gameURL
            });
        }  
        await bot.postGuildCount();
    });
};

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
                let {prefixes, blacklist, admins, unloadedModules} = await bot.getDataSettings();
                bot.admins = admins;
                bot.blacklist = blacklist;
                bot.prefixes = prefixes.concat([`<@${bot.user.id}> `, `<@!${bot.user.id}> `, bot.config.general.mainPrefix]);
                bot.unloadedModules = unloadedModules;

                await bot.localeManager.loadLocales(bot);
                logger.info(`Loaded ${Object.keys(bot.localeManager.locales).length} locales.`);

                require(path.resolve(__dirname, '../modules', 'loader'))(bot);
                logger.info(`Loaded ${bot.commands.length} ${bot.commands.length === 1 ? 'command' : 'commands'}.`);

                bot.loadCommands = false;
                bot.allowCommandUse = true;

                logger.info(`${bot.user.username} is connected to Discord and is ready to use.`);
                logger.info('--------------------');
                logger.info(`Owner: ${bot.config.general.ownerID}`);
                logger.info(`Admins: ${admins.join(', ')}`);
                logger.info(`Blacklist: ${blacklist.join(', ')}`);
                logger.info(`Prefixes: "${[bot.config.general.mainPrefix, '@mention'].concat(prefixes).join('", "')}"`);
                logger.info('--------------------\n');
            } catch(err) {
                logger.error(`Error while starting up:\n${err.stack}`);
            }
        } else logger.info('Reconnected to Discord from disconnection.');

        bot.editStatus(bot.config.discord.status || 'online', bot.config.discord.game || {});
        await bot.postGuildCount();
    });
};

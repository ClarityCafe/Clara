/**
 * @file Ready event that handles loading commands, locales, and the database tables if need be.
 * @author Capuccino
 * @author Ovyerus
 */

const fs = require('fs');
const path = require('path');

module.exports = bot => {
    bot.on('ready', async () => {
        if (bot.loadCommands) {
            try {
                bot.prefixes = bot.prefixes.concat([`<@${bot.user.id}> `, `<@!${bot.user.id}> `]);

                await bot.localeManager.loadLocales(bot);
                logger.info(`Loaded ${Object.keys(bot.localeManager.locales).length} locales.`);

                require(path.resolve(__dirname, '../modules', 'loader'))(bot);
                logger.info(`Loaded ${bot.commands.length} ${bot.commands.length === 1 ? 'command' : 'commands'}.`);

                if (!await bot.db.guild_settings._promise) {
                    logger.info('Setting up "guild_settings" table in database.');
                    await bot.db.guild_settings.set({});
                }

                if (!await bot.db.user_settings._promise) {
                    logger.info('Setting up "user_settings" talbe in database.');
                    await bot.db.user_settings.set({});
                }

                bot.loadCommands = false;
                bot.allowCommandUse = true;

                let altPrefixes = JSON.parse(fs.readFileSync(path.resolve(`${__dirname}`, '../', '../', './data/prefixes.json')));

                logger.info(`${bot.user.username} is connected to Discord and is ready to use.`);
                logger.info(`Main prefix is '${bot.config.mainPrefix}', you can also use @mention.`);
                logger.info(altPrefixes.length > 0 ? `Alternative prefixes: '${altPrefixes.join("', ")}'`: 'No alternative prefixes.');
            } catch(err) {
                logger.error(`Error while starting up:\n${err.stack}`);
            }
        } else {
            logger.info('Reconnected to Discord from disconnection.');
        }

        bot.editStatus('online', {
            name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`,
            type: bot.config.gameURL ? 1 : 0,
            url: `${bot.config.gameURL || null}`
        });
        await bot.postGuildCount();
    });
};

/* eslint-env node */

const fs = require('fs');

module.exports = bot => {
    bot.on('ready', () => {
        if (bot.loadCommands) {
            bot.prefixes = bot.prefixes.concat([`<@${bot.user.id}> `, `<@!${bot.user.id}> `]);
            let meme;
            localeManager.loadLocales().then(() => {
                logger.info(`Loaded ${Object.keys(localeManager.locales).length} locales.`);
                return require(`${__baseDir}/modules/commandLoader`).init();
            }).then(() => {
                logger.info(`Loaded ${bot.commands.length} ${bot.commands.length === 1 ? 'command' : 'commands'}.`);
                return bot.db.tableList().run();
            }).then(res => {
                meme = res;
                if (res.indexOf('guild_settings') === -1) {
                    logger.info('Setting up "guild_settings" table in database.');
                    return bot.db.tableCreate('guild_settings').run();
                } else {
                    return null;
                }
            }).then(() => {
                if (meme.indexOf('user_settings') === -1) {
                    logger.info('Setting up "user_settings" table in database.');
                    return bot.db.tableCreate('user_settings').run();
                } else {
                    return null;
                }
            }).then(() => {
                /**
                 * @todo Kindly explain what this bools supposed to do. 
                 */
                bot.loadCommands = false;
                bot.allowCommandUse = true;

                let altPrefixes = JSON.parse(fs.readFileSync(`${__baseDir}/data/prefixes.json`));
                logger.info(`${bot.user.username} is connected to Discord and ready to use.`);
                logger.info(`Main prefix is '${bot.config.mainPrefix}', can also use @mention.`);
                logger.info(`${altPrefixes.length > 0 ? `Alternative prefixes: '${altPrefixes.join("', ")}'` : 'No alternative prefixes.'}`);
            }).catch(err => {
                logger.error(`Experienced error while loading commands:\n${bot.config.debug ? err.stack : err}`);
            });
        } else {
            logger.info('Reconnected to Discord from disconnection.');
        }

        bot.editStatus('online', {name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: bot.config.gameURL ? 1 : 0, url: `${bot.config.gameURL || ''}`});
        bot.postGuildCount();
    });
};

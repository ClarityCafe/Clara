module.exports = bot => {
    bot.on('guildCreate', g => {
        if (g.members.filter(m => m.bot).size/g.members.size >= 0.75) {
            logger.info(`Leaving bot collection '${g.name}' (${g.id})`);
            g.leave();
        } else {
            bot.editStatus('online', {name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: bot.config.gameURL ? 1 : 0, url: `${bot.config.gameURL || null}`});
            bot.postGuildCount();
        }
    });
};
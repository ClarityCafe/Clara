module.exports = bot => {
    bot.on('guildDelete', () => {
        if (!(g.members.filter(m => m.bot).size/g.members.size >= 0.75)) {
            bot.editStatus('online', {name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: bot.config.gameURL ? 1 : 0, url: `${bot.config.gameURL || null}`});
            bot.postGuildCount();
        }
    });
};
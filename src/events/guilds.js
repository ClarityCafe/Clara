/**
 * @file Guild events file.
 * @author Capuccino
 * @author Ovyerus
 */

/* eslint-env node */

module.exports = bot => {
    bot.on('guildCreate', g => {
        if (g.members.filter(m => m.bot).size / g.members.size >= 0.50) {
            logger.info(`Leaving bot collection '${g.name}' (${g.id})`);
            g.leave();
        } else {
            bot.editStatus('online', {name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: bot.config.gameURL ? 1 : 0, url: `${bot.config.gameURL || null}`});
            bot.postGuildCount();
        }
    });

    bot.on('guildDelete', g => {
        if (!(g.members.filter(m => m.bot).size/g.members.size >= 0.50)) {
            bot.editStatus('online', {name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: bot.config.gameURL ? 1 : 0, url: `${bot.config.gameURL || null}`});
            bot.postGuildCount();
        }
    });

    bot.on('guildMemberAdd', (g, m) => {
        bot.getGuildSettings(g.id).then(res => {
            if (!res || !res.greeting || !res.greeting.enabled || !res.greeting.channelID || !res.greeting.message) {
                return null;
            }
            let msg = res.greeting.message.replace(/\{\{user\}\}/g, m.mention).replace(/\{\{name\}\}/g, utils.formatUsername(m));
            return g.channels.get(res.greeting.channelID).createMessage(msg);
        });
    });

    bot.on('guildMemberDelete', (g, m) => {
        bot.guildSettings(g.id).then(res => {
            if (!res || !res.goodbyes || !res.goodbyes.enabled || !res.goodbyes.channelID || !res.goodbyes.message) {
                return null;
            }
<<<<<<< HEAD
            let msg = res.goodbye.message.replace(/\{\user\}\}/g, m.mention).replace(/\{name\}\}/g, utils.formatUsername(m));
            return g.channels.get(res.goodbye.channelID).createMessage(msg);
=======
            let msg = res.goodbyes.message.replace(/\{\user\}\}/g, m.mention).replace(/\{name\}\}/g, utils.formatUsername(m));
            return g.channels.get(res.greeting.channelID).createMessage(msg);
>>>>>>> 72821cf5cc6b8f706c1ac6b0a896e7862880fff8
        });
    });
};

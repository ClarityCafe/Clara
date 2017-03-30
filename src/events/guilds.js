const utils = require(`${__baseDir}/modules/utils`);

module.exports = bot => {
    bot.on('guildCreate', g => {
        if (g.members.filter(m => m.bot).size / g.members.size >= 0.75 && g.members.filter(m => m.bot).length >= Math.ceil(g.memberCount / 2)) {
            logger.info(`Leaving bot collection '${g.name}' (${g.id})`);
            g.leave();
        } else {
            bot.editStatus('online', {name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: bot.config.gameURL ? 1 : 0, url: `${bot.config.gameURL || null}`});
            bot.postGuildCount();
        }
    });

    bot.on('guildDelete', () => {
        if (!(g.members.filter(m => m.bot).size/g.members.size >= 0.30)) {
            bot.editStatus('online', {name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`, type: bot.config.gameURL ? 1 : 0, url: `${bot.config.gameURL || null}`});
            bot.postGuildCount();
        }
    });

    bot.on('guildMemberAdd', (g, m) => {
        bot.getGuildSettings(g.id).then(res => {
            if (!res || !res.greeting || !res.greeting.enabled || !res.greeting.channelID || !res.greeting.message) {
                return null;
            } else {
                let msg = res.greeting.message.replace(/\{\{user\}\}/g, m.mention).replace(/\{\{name\}\}/g, utils.formatUsername(m));
                return g.channels.get(res.greeting.channelID).createMessage(msg);
            }
        });
    });

    bot.on('guildMemberDelete', (g, m) => {
        bot.guildSettings(g.id).then(res => {
            if (!res || !res.greeting || !res.greeting.enabled || !res.greeting.channelID || !res.parting.message) {
                return null;
            } else {
                let msg = res.parting.message.replace(/\{\user\}\}/g, m.mention).replace(/\{name\}\}/g, utils.formatUsername(m));
                return g.channels.get(res.greeting.channelID).createMessage(msg);
            }
        });
    });
};
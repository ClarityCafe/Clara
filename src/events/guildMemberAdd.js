const utils = require(`${__baseDir}/modules/utils`);

module.exports = bot => {
    bot.on('guildMemberAdd', (g, m) => {
        bot.getGuildSettings(g.id).then(res => {
            if (!res.greeting.enabled || !res.greeting.channelID || !res.greeting.message) {
                return null;
            } else {
                let msg = res.greeting.message.replace(/\{\{user\}\}/g, m.mention).replace(/\{\{name\}\}/g, utils.formatUsername(m));
                return g.channels.get(res.greeting.channelID).createMessage(msg);
            }
        });
    });
};
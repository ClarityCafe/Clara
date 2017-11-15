/**
 * @file Guild events file.
 * @author Capuccino
 * @author Ovyerus
 */

module.exports = bot => {
    bot.on('guildCreate', async guild => {
        if (guild.members.filter(m => m.bot).filter / guild.members.size >= 0.50) {
            logger.info(`Detected bot collection guild '${guild.name}' (${guild.id}). Autoleaving...`);
            await guild.leave();
        } else {
        	if (!bot.config.url && bot.config.gameURL) {
        		await bot.editStatus('online', {
        			 name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`,
        			 type : 0,
        			 url: null
        		});
        	} else {
        		await bot.editStatus('online', {
        			 name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`,
        			 type : 1,
        			 url: bot.config.gameURL
        		});
        	}
        }
    });

    bot.on('guildDelete', async guild => {
       if (!bot.config.url && bot.config.gameURL) {
        	await bot.editStatus('online', {
        	  name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`,
        	  type : 0,
        	  url: null
        		});
        } else {
           await bot.editStatus('online', {
        		name: `${bot.config.gameName || `${bot.config.mainPrefix}help for commands!`} | ${bot.guilds.size} ${bot.guilds.size === 1 ? 'server' : 'servers'}`,
        		type : 1,
        		url: bot.config.gameURL
        	});
        }
         await bot.postGuildCount(); 
         if (await bot.db.guild_settings[guild.id]._promise) await bot.db.guild_settings.delete(guild.id);
    });

    bot.on('guildMemberAdd', async (guild, member) => {
        let res = await bot.getGuildSettings(guild.id);

        if (!res || !res.greeting || !res.greeting.enabled || !res.greeting.channelID || !res.greeting.message) return;

        let msg = res.greeting.message.replace(/{{user}}/g, member.mention).replace(/{{name}}/g, utils.formatUsername(member));

        return guild.channels.get(res.greeting.channelID).createMessage(msg);
    });

    bot.on('guildMemberDelete', async (guild, member) => {
        let res = await bot.guildSettings(guild.id);

        if (!res || !res.goodbye || !res.goodbye.enabled || !res.goodbye.channelID || !res.goodbye.message) return;

        let msg = res.goodbye.message.replace(/{{user}}/g, utils.formatUsername(member)).replace(/{{name}/gi, member.username);

        await guild.channels.get(res.goodbye.channelID).createMessage(msg);
    });
};

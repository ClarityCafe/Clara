/* eslint-env node */

module.exports = bot => {
    bot.on('voiceChannelLeave', (mem, chan) => {
        /*if (chan.voiceMembers.filter(m => m.id !== bot.user.id && !m.bot).length === 0 && chan.voiceMembers.get(bot.user.id)) {
            setTimeout(() => {
                let c = bot.guilds.get(chan.guild.id).channels.get(chan.id);
                if (c.voiceMembers.filter(m => m.id !== bot.user.id && !m.bot).length === 0) {
                    if (bot.music.connections.get(chan.guild.id).playing) bot.music.connetions.get(chan.guild.id).stopPlaying();
                    bot.music.connections.get(chan.guild.id).leave();
                }
            }, 60000);
        }*/

        if (mem.id !== bot.user.id && chan.voiceMembers.get(bot.user.id) && chan.voiceMembers.filter(m => m.id !== bot.user.id && !m.bot).length === 0) {
            setTimeout(() => {
                if (chan.voiceMembers.filter(m => m.id !== bot.user.id && !m.bot).length === 0) {
                    let cnc = bot.music.connections.get(chan.guild.id);
                    if (cnc.playing) cnc.stopPlaying();
                    bot.leaveVoiceChannel(chan.id);

                }
            }, 300000);
        }

        if (mem.id !== bot.user.id) return;
        if (bot.music.connections.get(chan.guild.id)) bot.music.connections.delete(chan.guild.id);
        if (bot.music.queues.get(chan.guild.id)) bot.music.queues.delete(chan.guild.id);
        if (bot.music.skips.get(chan.guild.id)) bot.music.skips.delete(chan.guild.id);
        if (bot.music.streams.get(chan.guild.id)) {
            bot.music.streams.delete(chan.guild.id);
        }
    });

    bot.on('voiceChannelSwitch', (mem, chan, old) => {
        if (mem.id !== bot.user.id) return;
        if (!bot.music.connections.get(old.id)) {
            bot.music.connections.add(chan);
        } else {
            bot.music.connections.delete(old);
            bot.music.connects.add(old);
        }
    });
};
/**
 * @file Voice events for the music system.
 * @author Ovyerus
 */

/* eslint-env node */

const Eris = require('eris');

module.exports = bot => {
    bot.on('voiceChannelLeave', (mem, chan) => {
        if (!bot.music.connections.get(chan.guild.id)) return;

        if (mem.id !== bot.user.id && chan.voiceMembers.get(bot.user.id) && chan.voiceMembers.filter(m => m.id !== bot.user.id && !m.bot).length === 0) {
            setTimeout(() => {
                if (chan.voiceMembers.filter(m => m.id !== bot.user.id && !m.bot).length === 0) {
                    let cnc = bot.music.connections.get(chan.guild.id);
                    if (cnc.playing) cnc.stopPlaying();
                    bot.leaveVoiceChannel(chan.id);

                }
            }, 300000);
        }

        let cnc = bot.music.connections.get(chan.guild.id);

        if (cnc.summoner && mem.id === cnc.summoner.id) delete cnc.summoner;

        if (mem.id !== bot.user.id) return;
        if (bot.music.connections.get(chan.guild.id)) bot.music.connections.delete(chan.guild.id);
        if (bot.music.queues.get(chan.guild.id)) bot.music.queues.delete(chan.guild.id);
        if (bot.music.skips.get(chan.guild.id)) bot.music.skips.delete(chan.guild.id);
        if (bot.music.streams.get(chan.guild.id)) {
            bot.music.streams.delete(chan.guild.id);
        }
    });

    bot.music = {
        skips: new Eris.Collection(Object),
        queues: new Eris.Collection(Array),
        connections: bot.voiceConnections,
        streams: new Eris.Collection(Object),
        stopped: [],
        inactives: []
    };

    bot.music.autoLeaveTimer = setInterval(() => {
        for (let c of bot.music.inactives) {
            let chan = c[0];
            let timestamp = c[1];
            if (((bot.music.connections.get(chan.guild.id) && !bot.music.connections.get(chan.guild.id).playing) || (bot.music.queues.get(chan.guild.id) && bot.music.queues.get(chan.guild.id).length === 0)) && Date.now() - timestamp >= 300000) {
                bot.leaveVoiceChannel(chan.id);
            }
        }
    }, 60000);
};
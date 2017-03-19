module.exports = bot => {
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
module.exports = bot => {
    bot.on('shardDisconnect', (err, shard) => {
        if (err) logger.customError('shard/shardStatus', `Shard ${shard} disconnected. Reason ${err}`);
    });
};
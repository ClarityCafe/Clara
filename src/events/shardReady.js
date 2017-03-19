module.exports = bot => {
    bot.on('shardReady', shard => {
        logger.custom('blue', 'shard/shardInfo', `Shard ${shard} is ready!`);
    });
};
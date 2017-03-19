module.exports = bot => {
    bot.on('shardResume', shard => {
        logger.custom('blue', 'shard/shardInfo', `Shard ${shard} has resumed.`);
    });
};
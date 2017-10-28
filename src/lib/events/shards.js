/**
 * @file Shard event logging.
 * @author Capuccino
 */

module.exports = bot => {
    bot.on('shardResume', shard => {
        logger.custom('shard/shardInfo', `Shard ${shard} has resumed.`);
    });

    bot.on('shardDisconnect', (err, shard) => {
        if (err) logger.customError('shard/shardStatus', `Shard ${shard} disconnected. Reason ${err}`);
    });

    bot.on('shardReady', shard => {
        logger.custom('shard/shardInfo', `Shard ${shard} is ready!`);
    });
};
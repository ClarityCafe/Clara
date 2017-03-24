module.exports = bot => {
    bot.on('disconnect', () => {
        logger.warn('Disconnected from Discord.');
    });
};
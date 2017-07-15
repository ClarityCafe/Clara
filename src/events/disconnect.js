/**
 * @file Disconnect event.
 * @author Ovyerus
 */

/* eslint-env node */

module.exports = bot => {
    bot.on('disconnect', () => {
        logger.warn('Disconnected from Discord.');
    });
};
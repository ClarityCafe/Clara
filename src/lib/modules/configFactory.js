/**
 *  @file Configuration Factory for Clara
 *  @author Capuccino
 */
const fs = require('fs');

/**
 *  Powder that makes you nya
 *  @class
 */
class configFactory {
    /**
     *  @param {String} file filepath of the config object.
     */
    constructor(file) {
        this.file = file;
        if (typeof file !== String) return new Error('file is not a string');
    }

    /**
     * Generates a config Object based on Env vars on a JSON file 
     * @returns {Object} Config object
     */
    async generateConfig() {
        if (!fs.existsSync(this.file)) {
            return {
                /** @see {Link} https://github.com/ClarityMoe/Clara/issues/133 */

                token: process.env.DISCORD_TOKEN,
                debug: process.env.DEBUG || false,
                promiseWarnings: process.env.ENABLE_PROMISE_WARNS || false,
                ibKey: process.env.IB_TOKEN || null,
                mainPrefix: process.env.DEFAULT_PREFIX,
                osuApiKey: process.env.OSU_API_TOKEN || null,
                sauceKey: process.env.SAUCENAO_TOKEN || null,
                soundCloudKey: process.env.SOUNDCLOUD_TOKEN || null,
                gameName: process.env.GAME_NAME || null,
                gameURL: process.env.GAME_URL || null,
                ownerID: process.env.BOT_OWNER_ID,
                maxShards: process.env.INSTANCES || 1,
                ytSearchKey: process.env.YOUTUBE_TOKEN || null,
                discordBotsPWKey: process.env.DISCORD_PW_TOKEN || null,
                discordBotsOrgKey: process.env.DISCORD_ORG_TOKEN || null,
                twitchKey: process.env.TWITCH_TOKEN || null,
                nasaKey: process.env.NASA_KEY || null,
                redisURL: process.env.REDIS_URL || 'redis://127.0.0.1/0'
            };
        } else {
            return JSON.parse(fs.readFileSync(this.file));
        }
    }
}

exports.module = configFactory;

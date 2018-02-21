/**
 *  @file Configuration Factory for Clara
 *  @author Capuccino
 */
const fs = require('fs');
const YAML = require('yamljs');

/**
 * Abstraction class for managing loading config, falling back to environment args if the file doesn't exist.
 */
class ConfigFactory {
    /**
     * Generates a config Object based on Env vars or on a JSON file
     * 
     * @param {String} [file] Config file to try and load. Will fallback to environment args if it doesn't exist.
     * @returns {Object} Config object
     */
    static generate(file) {
        if (file && fs.existsSync(file)) return YAML.load(file);
        else {
            /**
             * @todo Make this programmatic so its easier to have new options added.
             */
            return {
                tokens: {
                    youtube: process.env.CLARA_TOKENS_YOUTUBE,
                    soundcloud: process.env.CLARA_TOKENS_SOUNDCLOUD,
                    ibsearch: process.env.CLARA_TOKENS_IBSEARCH,
                    osu: process.env.CLARA_TOKENS_OSU,
                    saucenao: process.env.CLARA_TOKENS_SAUCENAO,
                    nasa: process.env.CLARA_TOKENS_NASA,
                    twitch: process.env.CLARA_TOKENS_TWITCH
                },
                botlistTokens: {
                    dbl: process.env.CLARA_BOTLIST_TOKENS_DBL,
                    dbots: process.env.CLARA_BOTLIST_TOKENS_DBOTS
                },
                development: {
                    debug: process.env.CLARA_DEVELOPMENT_DEBUG,
                    promiseWarnings: process.env.CLARA_DEVELOPMENT_PROCESS_WARNINGS
                },
                general: {
                    ownerID: process.env.CLARA_GENERAL_OWNERID,
                    token: process.env.CLARA_GENERAL_TOKEN,
                    redisURL: process.env.CLARA_GENERAL_REDISURL || 'redis://127.0.0.1/0',
                    mainPrefix: process.env.CLARA_GENERAL_MAINPREFIX,
                    maxShards: process.env.CLARA_GENERAL_MAXSHARDS || 1
                },
                discord: {
                    status: process.env.CLARA_DISCORD_STATUS || 'online',
                    game: {
                        url: process.env.CLARA_DISCORD_GAME_URL,
                        type: process.env.CLARA_DISCORD_GAME_TYPE || 0,
                        name: process.env.CLARA_DISCORD_GAME_NAME
                    }
                }
            };
        }
    }
}

module.exports = ConfigFactory;
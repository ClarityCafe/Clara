/**
 *  @file Configuration Factory for Clara
 *  @author Capuccino
 */
const fs = require('fs');
const YAML = require('yamljs');

const capitalReplacers = ['id', 'url'];

function formatStr(str, len) {
    let res = str.slice(len).toLowerCase();
    capitalReplacers.forEach(rep => res = res.replace(rep, v => v.toUpperCase()));

    return res.replace(/_./g, (m, i, s) => /[A-Z]/.test(s[i--]) ? m[1] : m[1].toUpperCase());
}

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
        let conf;
        let fromEnv = false;

        if (file && fs.existsSync(file)) conf = YAML.load(file);
        else {
            let env = Object.entries(process.env);

            /*
             * 13 = length of "CLARA_TOKENS_"
             * 21 = length of "CLARA_BOTLIST_TOKENS_"
             * 18 = length of "CLARA_DEVELOPMENT_"
             * 14 = length of "CLARA_GENERAL_"
             */
            let tokens = env.filter(v => v[0].startsWith('CLARA_TOKENS_')).map(([k, v]) => ({[formatStr(k, 13)]: v}));
            let botlistTokens = env.filter(v => v[0].startsWith('CLARA_BOTLIST_TOKENS_')).map(([k, v]) => ({[formatStr(k, 21)]: v}));
            let development = env.filter(v => v[0].startsWith('CLARA_DEVELOPMENT_')).map(([k, v]) => ({[formatStr(k, 18)]: v}));
            let general = env.filter(v => v[0].startsWith('CLARA_GENERAL_')).map(([k, v]) => ({[formatStr(k, 14)]: v}));

            conf = {
                tokens: tokens.reduce((m, v) => Object.assign(m, v), {}),
                botlistTokens: botlistTokens.reduce((m, v) => Object.assign(m, v), {}),
                development: development.reduce((m, v) => Object.assign(m, v), {}),
                general: general.reduce((m, v) => Object.assign(m, v), {}),
                discord: {
                    status: process.env.CLARA_DISCORD_STATUS || 'online',
                    game: {
                        url: process.env.CLARA_DISCORD_GAME_URL,
                        type: process.env.CLARA_DISCORD_GAME_TYPE || 0,
                        name: process.env.CLARA_DISCORD_GAME_NAME
                    }
                }
            };

            fromEnv = true;
        }

        // Force debug mode if not production env.
        if (process.env.NODE_ENV !== 'production') conf.development.debug = true;
        if (conf.discord.game && conf.discord.game.url) conf.discord.game.type = 1;
        if (conf.discord.game && !conf.discord.game.name) conf.discord.game.name = '{{prefix}}help | {{guilds}} guilds';
        if (fromEnv && !conf.general.redisURL) conf.general.redisURL = process.env.REDIS_URL || process.env.REDISCLOUD_URL;
        if (!conf.general.redisURL) conf.general.redisURL = 'redis://127.0.0.1/0';

        return conf;
    }
}

module.exports = ConfigFactory;
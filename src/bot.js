/**
  * @file the main file the makes everything work
  * @author Capuccino
  * @author Ovyerus
  * @copyright Copyright (c) 2018 Capuccino, Ovyerus and the repository contributors.
  * @license MIT
  */

// Imports
const Clara = require(`${__dirname}/lib/Clara`);
const fs = require('fs');
let config;

try {
    config = require(`${__dirname}/config.json`);
} catch(_) {
    config = {
        /** @see {Link} https://github.com/ClarityMoe/Clara/issues/133 */
       
        token: process.env.DISCORD_TOKEN,
        debug: process.env.DEBUG,
        promiseWarnings: process.env.ENABLE_PROMISE_WARNS || false,
        ibKey: process.env.IB_TOKEN,
        mainPrefix: process.env.DEFAULT_PREFIX,
        osuApiKey: process.env.OSU_API_TOKEN,
        sauceKey: process.env.SAUCENAO_TOKEN,
        soundCloudKey: process.env.SOUNDCLOUD_TOKEN,
        gameName: process.env.GAME_NAME || null,
        gameURL: process.env.GAME_URL || null,
        ownerID: process.env.BOT_OWNER_ID,
        maxShards: process.env.INSTANCES || 1,
        ytSearchKey: process.env.YOUTUBE_TOKEN,
        discordBotsPWKey: process.env.DISCORD_PW_TOKEN,
        discordBotsOrgKey: process.env.DISCORD_ORG_TOKEN,
        twitchKey: process.env.TWITCH_TOKEN,
        nasaKey: process.env.NASA_KEY,
        redisURL: process.env.REDIS_URL || 'redis://127.0.0.1/0'
    };
}

// Globals
global.mainDir = __dirname;
global.utils = require(`${__dirname}/lib/modules/utils`);
global.logger = require(`${__dirname}/lib/modules/Logger`);
global.Promise = require('bluebird');
global.got = require('got');

// Bot stuff
const bot = new Clara(config, {
    seedVoiceConnections: true,
    maxShards: config.maxShards || 1,
    latencyThreshold: 420000000,
    defaultImageFormat: 'webp',
    defaultImageSize: 512,
    disableEvents: {
        TYPING_START: true
    }
});

bot.commandsDir = `${__dirname}/cmd`;
bot.unloadedPath = `${__dirname}/data/unloadedCommands.json`;

//Promise configuration
Promise.config({
    warnings: {wForgottenReturn: config.promiseWarnings || false},
    longStackTraces: config.promiseWarnings || false
});

if (!fs.existsSync(`${__dirname}/cache`)) fs.mkdirSync(`${__dirname}/cache/`);
if (fs.readdirSync(`${__dirname}/cache`).length) {
    // Clears out anything in the cache directory if it has something.
    fs.readdirSync(`${__dirname}/cache`).forEach(f => fs.unlinkSync(`${__dirname}/cache/${f}`));
}

require(`${__dirname}/lib/events`)(bot);
bot.connect();

exports.bot = bot;
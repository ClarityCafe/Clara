/**
  * @file the main file the makes everything work
  * @author Capuccino
  * @author Ovyerus
  * @copyright Copyright (c) 2017 Capuccino, Ovyerus and the repository contributors.
  * @license MIT
  */

// Imports
const Clara = require(`${__dirname}/lib/Clara`);
const fs = require('fs');
const process = require('process');
let config; // = require(`${__dirname}/config.json`);

try {
    config = require (`${__dirname}/config.json`);
} catch(_) {
    config = {
      /** @see {Link} https://github.com/ClarityMoe/Clara/issues/133 */
       
      token: process.env.DISCORD_TOKEN,
      debug: process.env.DEBUG,
      promiseWarnings: process.env.ENABLE_PROMISE_WARNS,
      ibKey: process.env.IB_TOKEN,
      mainPrefix: process.env.DEFAULT_PREFIX,
      osuApiKey: process.env.OSU_API_TOKEN,
      sauceKey: process.env.SAUCENAO_TOKEN,
      gameName: process.env.GAME_NAME,
      gameURL: process.env.GAME_URL,
      ownerID: process.env.BOT_OWNER_ID,
      maxShards: process.env.INSTANCES,
      ytSearchKey: process.env.YOUTUBE_KEY,
      twitchKey: process.env.TWITCH_KEY,
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

//bot stuff
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

require(`${__dirname}/lib/events`)(bot);
bot.connect();

exports.bot = bot;
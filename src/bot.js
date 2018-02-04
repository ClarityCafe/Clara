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
const configFactory = require(`${__dirname}/lib/modules/configFactory`);
const cf = new configFactory(`${__dirname}/config.json`);
const config = cf.generateConfig();

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
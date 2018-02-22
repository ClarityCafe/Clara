/**
  * @file the main file the makes everything work
  * @author Capuccino
  * @author Ovyerus
  * @copyright Copyright (c) 2018 Capuccino, Ovyerus and the repository contributors.
  * @license MIT
  */

// Imports
const Clara = require(`${__dirname}/lib/Clara`);
const ConfigFactory = require(`${__dirname}/lib/modules/ConfigFactory`);
const fs = require('fs');

const config = ConfigFactory.generate(`${__dirname}/config.yaml`);

// Globals
global.mainDir = __dirname;
global.utils = require(`${__dirname}/lib/modules/utils`);
global.logger = require(`${__dirname}/lib/modules/Logger`);
global.Promise = require('bluebird');
global.got = require('got');

//Promise configuration
Promise.config({
    warnings: {wForgottenReturn: config.development.promiseWarnings},
    longStackTraces: config.development.promiseWarnings
});

// Bot stuff
const bot = new Clara(config, {
    firstShardID : Math.floor(Math.random() * 100).toFixed(0),
    maxShards: config.general.maxShards ||'auto',
    seedVoiceConnections: true,
    latencyThreshold: 420000000,
    defaultImageFormat: 'webp',
    defaultImageSize: 512,
    disableEvents: {
        TYPING_START: true
    }
});

bot.commandsDir = `${__dirname}/cmd`;
bot.unloadedPath = `${__dirname}/data/unloadedCommands.json`;

if (!fs.existsSync(`${__dirname}/cache`)) fs.mkdirSync(`${__dirname}/cache/`);
if (fs.readdirSync(`${__dirname}/cache`).length) {
    // Clears out anything in the cache directory if it has something.
    fs.readdirSync(`${__dirname}/cache`).forEach(f => fs.unlinkSync(`${__dirname}/cache/${f}`));
}

require(`${__dirname}/lib/events`)(bot);
bot.connect().catch(err => {
    console.error(err);
    process.exit(1);
});
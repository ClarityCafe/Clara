/**
  * @file the main file the makes everything work
  * @author Capuccino
  * @author Ovyerus
  * @copyright Copyright (c) 2017 Capuccino, Ovyerus and the repository contributors.
  * @license MIT
  */

// Imports
const Clara = require('./lib/Clara');
const fs = require('fs');
const config = require('./config.json');

//globals
global.utils = require('./lib/modules/utils');
global.logger = require('./lib/modules/Logger');
global.Promise = require('bluebird');

//bot stuff
=======
>>>>>>> 8e8d0d6c3331ff90d53c99b790a99d5800a57d8b
const bot = new Clara(config, {
    autoreconnect: true,
    seedVoiceConnections: true,
    maxShards: config.maxShards || 1,
    defaultImageFormat: 'webp',
    defaultImageSize: 512,
    disableEvents: {
        TYPING_START: true
    }
});

bot.commandsDir = `${__dirname}/cmd`;
bot.unloadedPath = `${__dirname}/data/unloadedCommands.json`;

global.utils = require(`${__dirname}/lib/modules/utils`);
global.Promise = require('bluebird');

//Promise configuration
Promise.config({
    warnings: {wForgottenReturn: config.promiseWarnings || false},
    longStackTraces: config.promiseWarnings || false
});

if (!fs.existsSync(`${__dirname}/cache`)) fs.mkdirSync(`${__dirname}/cache/`);

require(`${__dirname}/lib/events`)(bot);
bot.connect();

exports.bot = bot;
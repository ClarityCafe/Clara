/**
  * @file the main file the makes everything work
  * @author Capuccino
  * @author Ovyerus
  * @copyright Copyright (c) 2017 Capuccino, Ovyerus and the repository contributors.
  * @license MIT
  */


//module requires
const Clara = require('./lib/Clara');
const fs = require('fs');
const config = require('./config.json');

//globals
global.utils = require(`${__dirname}/lib/modules/utils`);
global.Promise = require('bluebird');

//bot stuff
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

//Promise configuration
Promise.config({
    warnings: {
        wForgottenReturn: config.promiseWarnings || false
    },
    longStackTraces: config.promiseWarnings || false
});

exports.bot = bot;

if (!fs.existsSync(`${__dirname}/cache`)) fs.mkdirSync(`${__dirname}/cache/`);

// call init events
require(`${__dirname}/lib/events`)(bot);


bot.connect();
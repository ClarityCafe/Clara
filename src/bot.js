 /**
  * @file the main file the makes everything work
  * @author Capuccino
  * @author Ovyerus
  * @copyright Copyright (c) 2017 Capuccino, Ovyerus and the repository contributors.
  * @license MIT
  */

/* eslint-env node */

// Module requies
const Eris = require('eris');
const fs = require('fs');

//global stuff
global.utils = require(`${__dirname}/modules/utils`);
global.got = require('got');
global.__baseDir = __dirname;
global.Promise = require('bluebird');
global.logger = require(`${__dirname}/modules/Logger`);
global.localeManager = new (require(`${__dirname}/modules/LocaleManager`))();

// Setup stuff
const bot = new Eris(config, {
    autoreconnect: true,
    seedVoiceConnections: true,
    maxShards: config.maxShards || 1,
    defaultImageFormat: 'webp',
    defaultImageSize: 512,
    disableEvents: {
        TYPING_START: true
    }
});

Promise.config({
    warnings: {
        wForgottenReturn: config.promiseWarnings || false
    },
    longStackTraces: config.promiseWarnings || false
});

exports.bot = bot;

// Create data folder and files if they don't exist
if (!fs.existsSync(`${__dirname}/data/`)) fs.mkdirSync(`${__dirname}/data/`);
if (!fs.existsSync(`${__dirname}/cache/`)) fs.mkdirSync(`${__dirname}/cache/`);
if (!fs.existsSync(`${__dirname}/data/data.json`)) fs.writeFileSync(`${__dirname}/data/data.json`, '{"admins": [], "blacklist": []}');
if (!fs.existsSync(`${__dirname}/data/prefixes.json`)) fs.writeFileSync(`${__dirname}/data/prefixes.json`, '[]');

// Init events
require(`${__dirname}/events`)(bot);

bot.connect();
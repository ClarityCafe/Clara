/*
 * Clara - Core file
 *
 * Contributed by Capuccino and Ovyerus
 *
 * Licensed under MIT. Copyright (c) 2017 Capuccino, Ovyerus and the repository contributors.
 */

// Module requies
const Eris = require('eris');
const fs = require('fs');
const CommandHolder = require(`${__dirname}/modules/CommandHolder`);

// Global variables
global.__baseDir = __dirname;
global.Promise = require('bluebird');
global.logger = require(`${__dirname}/modules/logger`);
global.localeManager = new (require(`${__dirname}/modules/LocaleManager`))();

Promise.config({
    warnings: {wForgottenReturn: false},
    longStackTraces: false
});

// Setup stuff
const config = require(`${__dirname}/config.json`);
const bot = new Eris(config.token, {
    autoreconnect: true,
    seedVoiceConnections: true,
    maxShards: config.maxShards || 1,
    defaultImageFormat: 'png',
    defaultImageSize: 1024,
    disableEvents: {
        TYPING_START: true
    }
});

exports.bot = bot;

require(`${__dirname}/modules/botExtensions`);

// Create data files
try {
    require.resolve(`${__dirname}/data/data.json`);
    require.resolve(`${__dirname}/data/prefixes.json`);
} catch(err) {
    if (!fs.existsSync(`${__dirname}/data/`)) fs.mkdirSync(`${__dirname}/data/`);
    if (!fs.existsSync(`${__dirname}/data/data.json`)) fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify({admins: [], blacklist: []}), e => {
        if (e) {
            throw e;
        } else {
            logger.info('Created data.json.');
        }
    });

    if (!fs.existsSync(`${__dirname}/data/prefixes.json`)) fs.writeFile(`${__dirname}/data/prefixes.json`, JSON.stringify([]), e => {
        if (e) {
            throw e;
        } else {
            logger.info('Created Prefixes data');
        }    
    });
}

// Bot object modification
bot.db = require('rethinkdbdash')(config.rethinkOptions);
bot.commands = new CommandHolder(bot);
bot.config = config;
bot.loadCommands = true;
bot.allowCommandUse = false;
bot.music = {
    skips: new Eris.Collection(Object),
    queues: new Eris.Collection(Object),
    connections: new Eris.Collection(Eris.VoiceConnection),
    streams: new Eris.Collection(Object),
    stopped: []
};

bot.settings = {
    guilds: new Eris.Collection(Object),
    users: new Eris.Collection(Object)
};

// Init events
require(`${__dirname}/events`)(bot);

bot.connect();
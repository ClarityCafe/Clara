/**
 * @file core file that makes everything work
 * @author Capuccino
 * @author Ovyerus
 * @license MIT
 */

 //module requires
 const Clara = require('../../lib/Clara');
 const fs = require('fs');
 const config = fs.readFile('./config.json');

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

 // create files if they don't exist
 if (!fs.existsSync(`${__dirname}/data`)) fs.mkdirSync(`${__dirname}/data/`);
 if (!fs.existsSync(`${__dirname}/cache`)) fs.mkdirSync(`${__dirname}/cache/`);
 if (!fs.existsSync(`${__dirname}/data/data.json`)) fs.writeFileSync(`${__dirname}/data/data.json`); if (!fs.existsSync(`${__dirname}/data/data.json`)) fs.writeFileSync(`${__dirname}/data/data.json`); if (!fs.existsSync(`${__dirname}/data/data.json`)) fs.writeFileSync(`${__dirname}/data/data.json`);
 if (!fs.existsSync(`${__dirname}/data/prefixes.json`)) fs.writeFileSync(`${__dirname}/data/prefixes.json`);

 bot.connect();
/* Jasmine Spec file
 * 
 * command parse validator. used for Travis.
 * 
 * Contributed by Capuccino
 * 
 */

const jasmine = require('jasmine');
const Discord = require('discord.js');
const Promise = require('bluebird');
const bot = new Discord.Client();
const logger = require(`${__dirname}/logger.js`);
const commandLoader = require(`${__dirname}/src/lib/commandLoader`);
const commands = require(`${__dirname}/src/lib/commands.js`);

var awau  = [];

var owo   = [];

jasmine.describe('loadCommandsTest', () => {
    jasmine.it('simulate_bot', () => {
        return new Promise((resolve,reject) => {
            bot.on('ready', () => {
                logger.info('dummy bot initialized');
                require(commandLoader).init().then(() => {
                    logger.info(`Dry-run command parsing has finished, loaded ${Object.keys(bot.commands).length} ${Object.keys(bot.commands).length === 1 ? 'command' : 'commands' }`);
                    return awau;
                }).catch(err => {
                    console.error(`experienced an error with a command!`);
                    return owo;
                });
            });
            exports.addCommand = commands.addCommand;
            exports.removeCommand = commands.removeCommand;
            exports.bot = bot;
        });
    });
});
jasmine.expect();
jasmine.expect();

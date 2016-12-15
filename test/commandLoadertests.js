/* Jasmine Spec file
 * 
 * command parse validator. used for Travis.
 * 
 * Contributed by Capuccino
 * 
 */
global._baseDir = __dirname;

const Discord = require('discord.js');
const Promise = require('bluebird');
const bot = new Discord.Client();
const logger = require(`${__dirname}/lib/logger.js`);
const commandLoader = require(`${__dirname}/lib/commandLoader`);
const commands = require(`${__dirname}/lib/commands.js`);

var awau = [];

var owo = [];

describe('loadCommandsTest', () => {
    it('simulate_bot', () => {
        return new Promise((resolve, reject) => {
            bot.on('ready', () => {
                logger.info('dummy bot initialized');
                require(commandLoader).init().then(() => {
                    logger.info(`Dry-run command parsing has finished, loaded ${Object.keys(bot.commands).length} ${Object.keys(bot.commands).length === 1 ? 'command' : 'commands'}`);
                    resolve();
                    expect(owo).toBe(0);
                    expect(awau).toBe(`${Object.keys(bot.commands).length}`);
                }).catch(err => {
                    console.error(`experienced an error with a command! ${err}`);
                    reject([err]);
                    return owo = commandLoader.noLoad.length;
                });
            });
            exports.addCommand = commands.addCommand;
            exports.removeCommand = commands.removeCommand;
            exports.bot = bot;
        });
    });
});

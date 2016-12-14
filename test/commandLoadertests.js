const jasmine = require('jasmine');
const Discord = require('discord.js');
const Promise = require('bluebird');
const bot = new Discord.Client();
const logger = require(`${__dirname}/logger.js`);
const commandLoader = require(`${__dirname}/src/lib/commandLoader`);
const commands = require(`${__dirname}/src/lib/commands.js`);


jasmine.describe('loadCommandsTest', () => {
    jasmine.it('simulate_bot', () => {
        return new Promise((resolve,reject) => {
            
        });
    });
});
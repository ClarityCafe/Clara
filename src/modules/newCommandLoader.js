/*
 * Clara - Command Loader
 * based from chalda/DiscordBot
 * 
 * Contributed by Capuccino and Ovyerus
 */

//dependencies
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const logger = require(`${__dirname}/Logger`);

// stuff to make shit work
const noLoad=[];
const unloadedCommands;

/**
 *  Handler for command initialization
 * 
 */
class CommandLoader {
    /** 
    * @param {Object} options list of options
    * @param {String} [options.commandsDir] the name of the folder that contains the commands
    */
    constructor(options = {}) {
        this.options = {
            commandsDir: this.options.commandsDir || 'commands'
        };
        if (!fs.existsSync(`${__baseDir}/${this.otpions.commandsDir}`)) {
            throw new TypeError('folderName for commandsDir resolves to nothing.');
        }
    }
    /**
     * Loads all of the commands
     * @param {String} path the path for the commands.
     * @returns {Promise} returns the commands
     */
    loadCommands(path) {
        return new Promise((resolve, reject) => {
            if (!path === typeof path) {
                reject(new Error('path is not a valid directory path'));
            } else {
                //do nothing for now
                /** @todo make some statics */
            }
        });
    }
}

module.exports = CommandLoader;
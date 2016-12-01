/*
 * owo-whats this - Command Loader File
 * based from chalda/DiscordBot
 * 
 * Contributed by:
 * | Capuccino
 * | Ovyerus
 * 
 * Licensed under MIT. Copyright (c) 2016 Capuccino, Ovyerus and the repository contributors.
 */

// Dependancies
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const cp = require('child_process');
const logger = require(`${__dirname}/logger.js`);

// Variables
var commandsDirectory = 'commands';
var commandFolders;
var noLoad = [];
var commandsFrom = {};

function getDirectories(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err);
            } else {
                var numnum = files.filter(file => fs.statSync(path.join(dir, file)).isDirectory());
                resolve(numnum);
            }
        });
    });
}

getDirectories(`${_baseDir}/${commandsDirectory}`).then(dirs => commandFolders = dirs);

function preloadCommands() {
    return new Promise((resolve, reject) => {
        var deps = [];
        for (let awoo of commandFolders) {
            var cmdFiles = fs.readdirSync(`${_baseDir}/${commandsDirectory}/${awoo}`);
            if (cmdFiles.indexOf('package.json') === -1) {
                logger.customError('commandLoader/preloadCommands', `Skipping over '${awoo}' due to missing package.json`);
                noLoad.push(awoo);
            } else {
                var jsooon = fs.readFileSync(`${_baseDir}/${commandsDirectory}/${awoo}/package.json`);
                var pkg = JSON.parse(jsooon);
                if (Object.keys(pkg.dependencies).length > 0) {
                    for (let awau in pkg.dependencies) {
                        try {
                            require.resolve(awau);
                        } catch (err) {
                            if (deps.indexOf(awau) === -1) deps.push(awau);
                        }
                    }
                }
            }
        }
        if (deps.length > 0) {
            deps = deps.join(' ');
            logger.custom('blue', 'commandLoader/preloadCommands', `Installing dependencies for commands, this may take a while...\nDependencies: ${deps}`);
            cp.exec(`npm i ${deps}`, (err, stdout, stderr) => {
                if (stdout) logger.custom("green", `${stdout}`);
                if (err) logger.customError('commandLoader/preloadCommands', `Error when trying to install dependencies: ${err}`);
                if (stderr) logger.customError('commandLoader/preloadCommands', `Error when trying to install dependencies: ${stderr}`);
                resolve();
            });
        } else {
            resolve();
        }
    });
}

function loadCommands() {
    return new Promise((resolve, reject) => {
        var bot = require(`${_baseDir}/bot.js`);
        for (let cmdFolder of commandFolders) {
            if (noLoad.indexOf(cmdFolder) !== -1) continue;
            var command, commandPackage;
            try {
                commandPackage = require(`${_baseDir}/${commandsDirectory}/${cmdFolder}/package.json`);
                command = require(`${_baseDir}/${commandsDirectory}/${cmdFolder}/${commandPackage.main}`);
            } catch (err) {
                logger.customError('commandLoader/loadCommands', `Experienced error while loading command '${cmdFolder}', skipping...\n${bot.config.debug ? err.stack : err}`);
            }
            if (command) {
                if (command.commands) {
                    for (let cmd of command.commands) {
                        if (command[cmd]) {
                            bot.addCommand(cmd, command[cmd]).then(() => {
                                commandsFrom[cmd] = `${cmdFolder}/${commandPackage.main}`;
                                logger.custom('blue', 'commandLoader/loadCommands', `Successfully loaded command '${cmd}'`);
                            }).catch(err => logger.customError('commandLoader/loadCommands', `Error when attempting to load command '${cmd}':\n${bot.config.debug ? err.stack : err}`));
                        }
                    }
                    resolve();
                } else {
                    logger.customError('commandLoader/loadCommands', `Command '${cmdFolder}' not properly set up, skipping...\nCommand array not found.`);
                }
            }
        }
    });
}

exports.init = () => {
    return new Promise((resolve, reject) => {
        logger.custom('blue', 'commandLoader/init', 'Preloading commands.');
        preloadCommands().then(() => {
            logger.custom('blue', 'commandLoader/init', 'Loading commands.');
            loadCommands().then(() => {
                resolve();
            }).catch(reject);
        }).catch(reject);
    });
}

exports.commandsFrom = commandsFrom;
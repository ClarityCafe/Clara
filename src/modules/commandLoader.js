/*
 * Clara - Command Loader File
 * based from chalda/DiscordBot
 *
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

// Dependancies
const fs = require('fs');
const path = require('path');

const cp = require('child_process');
const logger = require(`${__dirname}/logger.js`);

// Variables
var commandsDirectory = 'commands';
var commandFolders;
var noLoad = [];
var unloadedCommands;

try {
    unloadedCommands = JSON.parse(fs.readFileSync(`${__baseDir}/data/unloadedCommands.json`).toString());
} catch(err) {
    unloadedCommands = [];
    fs.writeFile(`${__baseDir}/data/unloadedCommands.json`, '[]');
}

function getDirectories(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err);
            } else {
                let numnum = files.filter(file => fs.statSync(path.join(dir, file)).isDirectory());
                resolve(numnum);
            }
        });
    });
}

function preloadCommands() {
    return new Promise(resolve => {
        var deps = [];
        for (let awoo of commandFolders) {
            let cmdFiles = fs.readdirSync(`${__baseDir}/${commandsDirectory}/${awoo}`);
            if (cmdFiles.indexOf('package.json') === -1) {
                logger.customError('commandLoader/preloadCommands', `Skipping over '${awoo}' due to missing package.json`);
                noLoad.push(awoo);
            } else {
                let json = fs.readFileSync(`${__baseDir}/${commandsDirectory}/${awoo}/package.json`);
                let pkg;
                try {
                    pkg = JSON.parse(json);
                } catch(err) {
                    logger.customError('commandLoader/preloadCommands', `Skipping over '${awoo}' due to error parsing package.json\n${err}`);
                }

                if (pkg.dependencies == null) continue;
                if (Object.keys(pkg.dependencies).length > 0) {
                    for (let awau in pkg.dependencies) {
                        try {
                            require.resolve(awau);
                        } catch(err) {
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
        let bot = require(`${__baseDir}/bot.js`).bot;
        for (let cmdFolder of commandFolders) {
            if (noLoad.indexOf(cmdFolder) !== -1 || unloadedCommands.indexOf(cmdFolder) !== -1) continue;

            let command, commandPackage;

            try {
                commandPackage = require(`${__baseDir}/${commandsDirectory}/${cmdFolder}/package.json`);
                command = require(`${__baseDir}/${commandsDirectory}/${cmdFolder}/${commandPackage.main}`);
            } catch(err) {
                logger.customError('commandLoader/loadCommands', `Experienced error while loading module '${cmdFolder}', skipping...\n${err}`);
                unloadedCommands.push(cmdFolder);
            }

            if (command) {
                try {
                    bot.commands.addModule(cmdFolder, command);
                } catch(err) {
                    logger.customError('commandLoader/loadCommands', `Experienced error while loading module '${cmdFolder}', skipping...\n${err}`);
                    unloadedCommands.push(cmdFolder);
                }
            }
        }

        if (!unloadedCommands.equals(JSON.parse(fs.readFileSync(`${__baseDir}/data/unloadedCommands.json`).toString()))) {
            fs.writeFile(`${__baseDir}/data/unloadedCommands.json`, JSON.stringify(unloadedCommands), err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}

exports.init = () =>
    new Promise((resolve, reject) => {
        getDirectories(`${__baseDir}/${commandsDirectory}`).then(dirs => {
            commandFolders = dirs;
            logger.custom('blue', 'commandLoader/init', 'Preloading commands.');
            return preloadCommands();
        }).then(() => {
            logger.custom('blue', 'commandLoader/init', 'Loading commands.');
            return loadCommands();
        }).then(resolve).catch(reject);
    });

Array.prototype.equals = array => {
    if (!array || this.length !== array.length) return false;

    for (var i = 0, l=this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }

    return true;
};

Object.defineProperty(Array.prototype, 'equals', {enumerable: false});
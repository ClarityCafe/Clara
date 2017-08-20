/**
 * @file Command loader and dependency installer for bot startup.
 * Based from chalda/DiscordBot
 * @author Capuccino
 * @author Ovyerus
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
    unloadedCommands = JSON.parse(fs.readFileSync(`${__baseDir}/unloadedCommands.json`).toString());
} catch(err) {
    unloadedCommands = [];
    fs.writeFile(`${__baseDir}/unloadedCommands.json`, '[]');
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

async function preloadCommands() {
    let deps = [];
    for (let mod of commandFolders) {
        let cmdFiles = fs.readdirSync(`${__baseDir}/${commandsDirectory}/${mod}`);
        if (!cmdFiles.includes('package.json')) {
            logger.customError('commandLoader/preloadCommands', `Skipping over '${mod}' due to missing package.json`);
            noLoad.push(mod);
        } else {
            let json = fs.readFileSync(`${__baseDir}/${commandsDirectory}/${mod}/package.json`);
            let pkg;
            try {
                pkg = JSON.parse(json);
            } catch(err) {
                logger.customError('commandLoader/preloadCommands', `Skipping over '${mod}' due to error parsing package.json\n${err}`);
            }

            if (pkg.dependencies == null) continue;
            if (Object.keys(pkg.dependencies).length > 0) {
                for (let dep in pkg.dependencies) {
                    try {
                        require.resolve(dep);
                    } catch(err) {
                        if (!deps.includes(dep)) deps.push(dep);
                    }
                }
            }
        }
    }

    if (deps.length > 0) {
        deps = deps.join(' ');
        logger.custom('commandLoader/preloadCommands', `Installing dependencies for commands, this may take a while...\nDependencies: ${deps}`);
        cp.exec(`npm i ${deps}`, (err, stdout, stderr) => {
            if (err) logger.customError('commandLoader/preloadCommands', `Error when trying to install dependencies: ${err}`);
            if (stderr) logger.customError('commandLoader/preloadCommands', `Error when trying to install dependencies: ${stderr}`);
        });
    }
}

function loadCommands(bot) {
    return new Promise((resolve, reject) => {
        for (let cmdFolder of commandFolders) {
            if (noLoad.includes(cmdFolder) || unloadedCommands.includes(cmdFolder)) continue;

            let command, commandPackage;

            try {
                commandPackage = require(`${__baseDir}/${commandsDirectory}/${cmdFolder}/package.json`);
                command = `${__baseDir}/${commandsDirectory}/${cmdFolder}/${commandPackage.main}`;
            } catch(err) {
                logger.customError('commandLoader/loadCommands', `Experienced error while loading module '${cmdFolder}', skipping...\n${err.stack}`);
                unloadedCommands.push(cmdFolder);
            }

            if (command) {
                try {
                    bot.commands.loadModule(command);
                } catch(err) {
                    logger.customError('commandLoader/loadCommands', `Experienced error while loading module '${cmdFolder}', skipping...\n${err.stack}`);
                    unloadedCommands.push(cmdFolder);
                }
            }
        }

        if (!unloadedCommands.equals(JSON.parse(fs.readFileSync(`${__baseDir}/unloadedCommands.json`).toString()))) {
            fs.writeFile(`${__baseDir}/unloadedCommands.json`, JSON.stringify(unloadedCommands), err => {
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

exports.init = async bot => {
    commandFolders = await getDirectories(`${__baseDir}/${commandsDirectory}`);

    logger.custom('commandLoader/init', 'Preloading commands.');
    await preloadCommands();

    logger.custom('commandLoader/init', 'Loading commands.');
    await loadCommands(bot);
};

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
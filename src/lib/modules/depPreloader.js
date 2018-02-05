/**
 * @file Clara 0.4.X command module loader.
 * @author Ovyerus
 */

const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const logger = require(`${__dirname}/Logger`);

const cmdPath = path.resolve(__dirname, '..', '..', 'cmd');

function exists(module) {
    try {
        require.resolve(module);
        return true;
    } catch(err) {
        return false;
    }
}

function getCommandFolders() {
    // Read the command directory, find all the folders, and then read each of those.
    let cmdDirs = fs.readdirSync(cmdPath).filter(f => fs.lstatSync(path.join(cmdPath, f)).isDirectory());
    cmdDirs = cmdDirs.map(d => ({[d]: fs.readdirSync(path.join(cmdPath, d))}));
    let allCmds = cmdDirs.reduce((m, v) => Object.assign(m, v));

    // Turn the cmdDirs into an array of just the directory names, for the next part.
    cmdDirs = cmdDirs.map(e => Object.keys(e)[0]);

    // Turn folder names into proper paths for future ease.
    allCmds = Object.entries(allCmds).map(([name, dirs]) => dirs.filter(dir => fs.statSync(path.join(cmdPath, name, dir)).isDirectory()));
    allCmds = allCmds.map((v, i) => v.map(x => path.join(cmdPath, cmdDirs[i], x)));
    allCmds = [].concat.apply([], allCmds); // Flatten the arrays.

    return allCmds;
}

const allDeps = [];
const allCmdFolders = getCommandFolders();

logger.custom('pre-installer', 'Pre-installing command dependencies...');

for (let cmd of allCmdFolders) {
    let name = cmd.split(path.sep).slice(-1)[0];
    let files = fs.readdirSync(cmd);
    let pkg;

    if (!files.includes('package.json')) {
        logger.customError('pre-installer', `Cannot pre-install dependencies for "${name}" due to missing package.json.`);
        continue;
    }

    try {
        pkg = JSON.parse(fs.readFileSync(path.join(cmd, 'package.json')));
    } catch(err) {
        logger.customError('pre-installer', `Unable to load package.json for "${name}", possibly malformed JSON.`);
        continue;
    }

    if (!pkg.dependencies) continue;

    for (let [dep, ver] of Object.entries(pkg.dependencies)) if (!exists(dep) && !allDeps.includes(dep)) allDeps.push(`${dep}@${ver}`);
}

if (allDeps.length) {
    logger.custom('pre-installer', `Installing the following dependencies for commands:\n\x1b[36m"${allDeps.join('", "')}"`);
    cp.execSync(`npm i ${allDeps.join(' ')} --no-save`);
}

logger.custom('pre-installer', 'Finished pre-installing command deps.');
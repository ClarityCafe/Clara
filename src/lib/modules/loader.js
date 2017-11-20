/**
 * @file Clara 0.4.X command module loader.
 * @author Ovyerus
 */

const fs = require('fs');
const cp = require('child_process');
const logger = require(`${__dirname}/Logger`);

function exists(module) {
    try {
        require.resolve(module);
        return true;
    } catch(err) {
        return false;
    }
}

module.exports = bot => {
    let allDeps = [];
    let dontLoad = [];
    let unloaded;

    logger.custom('loader', 'Preloading commands...');

    for (let cmd of bot.commandFolders) {
        let name = cmd.split('/').slice(-1)[0];
        let files = fs.readdirSync(cmd);
        let pkg;

        if (!files.includes('package.json')) {
            logger.customError('loader', `Will not load "${name}" due to missing package.json.`);
            dontLoad.push(cmd);
            continue;
        }

        try {
            pkg = JSON.parse(fs.readFileSync(`${cmd}/package.json`));
        } catch(err) {
            logger.customError('loader', `Malformed package file for "${name}".`);
            continue;
        }

        if (!pkg.dependencies || !Object.keys(pkg.dependencies)[0]) continue;

        for (let dep of Object.keys(pkg.dependencies)) {
            if (!exists(dep) && !allDeps.includes(dep)) allDeps.push(`${dep}@${pkg.dependencies[dep]}`);
        }
    }

    if (allDeps.length !== 0) {
        logger.custom('loader', `Installing following dependencies for commands: \x1b[36m"${allDeps.join(', ')}"`);
        cp.execSync(`npm i ${allDeps.join(' ')} --no-save`);
    }

    try {
        unloaded = JSON.parse(fs.readFileSync(bot.unloadedPath));
    } catch(err) {
        fs.writeFileSync(bot.unloadedPath, '[]');
        unloaded = [];
    }

    logger.custom('loader', 'Loading commands...');

    for (let cmd of bot.commandFolders) {
        if (dontLoad.includes(cmd) || unloaded.includes(cmd)) continue;

        let pkg = JSON.parse(fs.readFileSync(`${cmd}/package.json`));
        let path = `${cmd}/${pkg.main}`;
        let name = cmd.split('/').slice(-1)[0];

        try {
            bot.commands.loadCommand(path);
        } catch(err) {
            logger.customError('loader', `Error while loading "${name}"\n${err}${err.stack ? `\n${err.stack.split('\n')[1]}` : ''}`);
            unloaded.push(cmd);
        }
    }

    fs.writeFileSync(bot.unloadedPath, JSON.stringify(unloaded));
};
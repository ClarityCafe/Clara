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

module.exports = async bot => {
    let allDeps = [];

    logger.custom('loader', 'Preloading commands...');

    for (let cmd of bot.commandFolders) {
        let name = cmd.split('/').slice(-1)[0];
        let files = fs.readdirSync(cmd);
        let pkg;

        if (!files.includes('command.json')) {
            logger.customError('loader', `Will not load "${name}" due to missing command.json.`);
            await bot.addUnloadedModule(name);
            continue;
        }

        try {
            pkg = JSON.parse(fs.readFileSync(`${cmd}/command.json`));
        } catch(err) {
            logger.customError('loader', `Malformed package file for "${name}".`);
            await bot.addUnloadedModule(name);
            continue;
        }

        if (!pkg.dependencies || !Object.keys(pkg.dependencies)[0]) continue;

        for (let dep of Object.keys(pkg.dependencies)) {
            if (!exists(dep) && !allDeps.includes(dep)) allDeps.push(`${dep}@${pkg.dependencies[dep]}`);
        }
    }

    if (allDeps.length !== 0) {
        logger.warn('CLARA-2019-0713: We no longer run preloading on init, this will be done on postinstall now.')
        // logger.custom('loader', `Installing following dependencies for commands: \x1b[36m"${allDeps.join(', ')}"`);
        // cp.execSync(`yarn add ${allDeps.join(' ')}`);
    }

    logger.custom('loader', 'Loading commands...');

    for (let cmd of bot.commandFolders) {
        let name = cmd.split('/').slice(-1)[0];

        if (bot.unloadedModules.includes(name)) continue;

        let pkg = JSON.parse(fs.readFileSync(`${cmd}/command.json`));
        let path = `${cmd}/${pkg.main}`;

        if (Array.isArray(pkg.requiredTokens)) {
            let missingTokens = pkg.requiredTokens.filter(tkn => !bot.config.tokens[tkn]);

            if (missingTokens.length) {
                logger.customError('loader', `Will not load "${name}" due to missing tokens: "${missingTokens.join('", "')}"`);
                await bot.addUnloadedModule(name);
                continue;
            }
        }

        try {
            bot.commands.loadModule(path);
        } catch(err) {
            logger.customError('loader', `Error while loading "${name}"\n${err}${err.stack ? `\n${err.stack.split('\n')[1]}` : ''}`);
            await bot.addUnloadedModule(name);
        }
    }

    logger.custom('loader', 'Finshed loading commands.\n');
};
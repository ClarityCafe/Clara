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
    let cmdDirs = fs.readdirSync(bot.commandsDir).map(d => ({[d]: fs.readdirSync(`${bot.commandsDir}/${d}`)}));
    let allCmds = {};
    let unloaded;

    // Go from an array of objects to an object of arrays.
    cmdDirs.forEach(d => Object.assign(allCmds, d));
    cmdDirs = cmdDirs.map(e => Object.keys(e)[0]);

    // Turn folder names into proper paths for future ease (also make sure we only get folders).
    allCmds = Object.entries(allCmds).map(x => x[1].filter(y => fs.statSync(`${bot.commandsDir}/${x[0]}/${y}`).isDirectory()));
    allCmds = allCmds.map((v, i) => v.map(x => `./${bot.commandsDir}/${cmdDirs[i]}/${x}`));
    allCmds = [].concat.apply([], allCmds);

    logger.custom('loader', 'Preloading commands...');

    for (let cmd of allCmds) {
        let name = cmd.split('/')[-1];
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

        for (let dep in pkg.dependencies) if (!exists(dep) && !allDeps.includes(dep)) allDeps.push(dep);
    }

    if (allDeps.length !== 0) {
        logger.custom('loader', `Installing following dependencies for commands: [36m"${allDeps.join(', ')}"`);
        cp.execSync(`npm i ${allDeps.join(' ')}`);
    }

    try {
        unloaded = JSON.parse(fs.readFileSync(bot.unloadedPath));
    } catch(err) {
        unloaded = [];
        fs.writeFileSync(bot.unloadedPath, '[]');
    }

    logger.custom('loader', 'Loading commands...');

    for (let cmd of allCmds) {
        if (dontLoad.includes(cmd) || unloaded.includes(cmd)) continue;

        let pkg = JSON.parse(fs.readFileSync(`${cmd}/package.json`));
        let path = `${cmd}/${pkg.main}`;
        let name = cmd.split('/')[-1];

        try {
            bot.commands.loadModule(path);
        } catch(err) {
            logger.customError('loader', `Error while loading "${name}"\n${err}`);
            unloaded.push(cmd);
        }
    }

    fs.writeFileSync(bot.unloadedPath, JSON.stringify(unloaded));
};
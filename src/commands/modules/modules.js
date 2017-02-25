/*
 * modules.js - Dynamic command module loading, unloading and reloading.
 * 
 * Contributed by Ovyerus
 */

const fs = require('fs');
const path = require('path');
const decache = require('decache');

var subCommands = {
    load: loadFunc,
    unload: unloadFunc,
    reload: reloadFunc
};

exports.commands = [
    'modules'
];

exports.modules = {
    desc: 'Command for managing modules.',
    longDesc: 'Manages command modules for the bots. If no arguments, lists currently loaded modules, else runs the specified subcommand if possible.',
    usage: '[load|unload|reload]',
    adminOnly: true,
    fixed: true,
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.args || Object.keys(subCommands).indexOf(ctx.args[0]) === -1) {
                let cmdFolders = fs.readdirSync(path.join(__dirname, '../'));
                let unloadedMods = JSON.parse(fs.readFileSync(`${__baseDir}/data/unloadedCommands.json`));
                let embed = {title: 'Current Modules', description: `Showing **${cmdFolders.length}** command modules.`, fields: [{name: 'Loaded Modules'}, {name: 'Unloaded Modules'}]};
                let loaded = [];
                let unloaded = [];

                bot.commands.modules.forEach(mod => {
                    loaded.push(`**${mod}**`);
                });

                unloadedMods.forEach(mod =>  {
                    unloaded.push(`**${mod}**`);
                });

                embed.fields[0].value = loaded.join('\n');
                embed.fields[1].value = unloaded.join('\n');

                ctx.msg.channel.createMessage({embed}).then(resolve).catch(reject);
            } else if (Object.keys(subCommands).indexOf(ctx.args[0]) !== -1) {
                let sub = ctx.args.shift();
                subCommands[sub](bot, ctx).then(resolve).catch(reject);
            }
        });
    }
};


function loadFunc(bot, ctx) {
    return new Promise((resolve, reject) => {
        if (bot.commands.checkModule(ctx.args[0])) {
            ctx.msg.channel.createMessage(`Module **${ctx.args[0]}** already exist's in the command holder.`).then(resolve).catch(reject);
        } else {
            readDir(`${__baseDir}/commands`).then(folders => {
                if (folders.indexOf(ctx.args[0]) === -1) {
                    return ctx.msg.channel.createMessage(`Module **${ctx.args[0]}** does not exist.`);
                } else {
                    let pkg = require(path.join(__dirname,  '../', ctx.args[0], 'package.json'));
                    let mod = require(path.join(__dirname, '../', ctx.args[0], pkg.main));
                    let loadedAmt = 0;

                    if (!mod.commands) {
                        return ctx.msg.channel.createMessage(`Module **${ctx.args[0]}** is not set up properly (commands array does not exist).`);
                    } else {
                        bot.commands.addModule(ctx.args[0]);
                        for (let cmd of mod.commands) {
                            if (mod[cmd]) {
                                try {
                                    bot.commands.addCommand(cmd, mod[cmd]);
                                    logger.custom('blue', 'modules/loadFunc', `Successfully loaded command '${cmd}'`);
                                    loadedAmt++;
                                } catch(err) {
                                    logger.customError('modules/loadFunc', `Error when attempting to load command '${cmd}':\n${err}`);
                                    let m = `Error attempting to load **${cmd}**\n`;
                                    m += '```js\n';
                                    m += err + '\n';
                                    m += '```';

                                    ctx.msg.channel.createMessage(m);
                                }
                            }
                        }

                        if (loadedAmt === 0) bot.commands.removeModule(ctx.args[0]);

                        if (loadedAmt !== 0) {
                            let unloadedMods = JSON.parse(fs.readFileSync(`${__baseDir}/data/unloadedCommands.json`).toString());
                            if (unloadedMods.indexOf(ctx.args[0]) !== -1) {
                                unloadedMods.splice(unloadedMods.indexOf(ctx.args[0]), 1);
                                fs.writeFileSync(`${__baseDir}/data/unloadedCommands.json`, JSON.stringify(unloadedMods));
                            }
                        }

                        return ctx.msg.channel.createMessage(`Loaded **${loadedAmt}/${mod.commands.length}** commands from module **${ctx.args[0]}**`);
                    }
                }
            }).then(resolve).catch(reject);
        }
    });
}

function unloadFunc(bot, ctx) {
    return new Promise((resolve, reject) => {
        if (!bot.commands.checkModule(ctx.args[0])) {
            ctx.msg.channel.createMessage(`Module **${ctx.args[0]}** is not loaded or does not exist.`).then(resolve).catch(reject);
        } else {
            bot.commands.removeModule(ctx.args[0]);
            let pkg = require(path.join(__dirname, '../', ctx.args[0], 'package.json'));
            let mod = require(path.join(__dirname, '../', ctx.args[0], pkg.main));
            let unloadedAmt = 0;

            if (!mod.commands) {
                return ctx.msg.channel.createMessage(`Module **${ctx.args[0]}** is not set up properly (commands array does not exist).`);
            } else {
                for (let cmd of mod.commands) {
                    if (bot.commands.getCommand(cmd)) {
                        try {
                            bot.commands.removeCommand(cmd);
                            logger.custom('blue', 'modules/unloadFunc', `Successfully unloaded command '${cmd}'`);
                            unloadedAmt++;
                        } catch(err) {
                            logger.customError('modules/unloadFunc', `Error when attempting to unload command '${cmd}':\n${err}`);
                            let m = `Error attempting to unload **${cmd}**\n`;
                            m += '```js\n';
                            m += err + '\n';
                            m += '```';

                            ctx.msg.channel.createMessage(m);
                        }
                    }
                }

                decache(path.join(__dirname, '../', ctx.args[0], pkg.main));
                decache(path.join(__dirname, '../', ctx.args[0], 'package.json'));

                if (unloadedAmt !== 0) {
                    let unloadedMods = JSON.parse(fs.readFileSync(`${__baseDir}/data/unloadedCommands.json`).toString());
                    unloadedMods.push(ctx.args[0]);
                    fs.writeFileSync(`${__baseDir}/data/unloadedCommands.json`, JSON.stringify(unloadedMods));
                }

                ctx.msg.channel.createMessage(`Unloaded **${unloadedAmt}/${mod.commands.length}** commands from module **${ctx.args[0]}**`).then(resolve).catch(reject);
            }
        }
    });
}

function reloadFunc(bot, ctx) {
    return new Promise((resolve, reject) => {
        if (!bot.commands.checkModule(ctx.args[0])) {
            ctx.msg.channel.createMessage(`Module **${ctx.args[0]}** is not loaded or does not exist.`).then(resolve).catch(reject);
        } else {
            decache(path.join(__dirname, '../', ctx.args[0], 'package.json'));
            let pkg = require(path.join(__dirname,  '../', ctx.args[0], 'package.json'));
            decache(path.join(__dirname, '../', ctx.args[0], pkg.main));
            let mod = require(path.join(__dirname, '../', ctx.args[0], pkg.main));
            let reloadedAmt = 0;

            if (!mod.commands) {
                return ctx.msg.channel.createMessage(`Module **${ctx.args[0]}** is not set up properly (commands array does not exist).`);
            } else {
                for (let cmd of mod.commands) {
                    if (bot.commands.getCommand(cmd)) {
                        try {
                            bot.commands.reloadCommand(cmd, mod[cmd]);
                            logger.custom('blue', 'modules/reloadFunc', `Successfully reloaded command '${cmd}'`);
                            reloadedAmt++;
                        } catch(err) {
                            logger.customError('modules/unloadFunc', `Error when attempting to unload command '${cmd}':\n${err}`);
                            let m = `Error attempting to unload **${cmd}**\n`;
                            m += '```js\n';
                            m += err + '\n';
                            m += '```';

                            ctx.msg.channel.createMessage(m);
                        }
                    }
                }

                ctx.msg.channel.createMessage(`Reloaded **${reloadedAmt}/${mod.commands.length}** commands from module **${ctx.args[0]}**`).then(resolve).catch(reject);
            }
        }
    });
}

function readDir(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}
/*
 * modules.js - Dynamic command module loading, unloading and reloading.
 *
 * Contributed by Ovyerus
 */

/* eslint-env node */

const fs = require('fs');
const path = require('path');
const decache = require('decache');

exports.loadAsSubcommands = true;

exports.commands = [
    'load',
    'unload',
    'reload'
];

exports.main = {
    desc: 'Command for managing modules.',
    longDesc: 'Manages command modules for the bots. If no arguments, lists currently loaded modules, else runs the specified subcommand if possible.',
    usage: '[load|unload|reload]',
    adminOnly: true,
    fixed: true,
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            let cmdFolders = fs.readdirSync(path.join(__dirname, '../'));
            let unloadedMods = JSON.parse(fs.readFileSync(`${__baseDir}/data/unloadedCommands.json`));
            let embed = {
                title: 'Current Modules',
                description: `Showing **${cmdFolders.length}** command modules.`,
                fields: [
                    {name: 'Loaded Modules', value: []},
                    {name: 'Unloaded Modules', value: []}
                ]
            };

            Object.keys(bot.commands.modules).filter(m => !m.endsWith('-fixed')).forEach(mod => {
                embed.fields[0].value.push(`\`${mod}\``);
            });

            unloadedMods.forEach(mod =>  {
                embed.fields[1].value.push(`\`${mod}\``);
            });

            embed.fields[0].value = embed.fields[0].value.join(', ');
            embed.fields[1].value = embed.fields[1].value.join(', ');

            ctx.createMessage({embed}).then(resolve).catch(reject);
        });
    }
};

exports.load = {
    desc: 'Load a module.',
    usage: '<module>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.args[0]) {
                ctx.createMessage('No module given to load.').then(resolve).catch(reject);
            } else if (bot.commands.checkModule(ctx.args[0])) {
                ctx.createMessage(`Module **${ctx.args[0]}** is already loaded.`).then(resolve).catch(reject);
            } else {
                readDir(`${__baseDir}/commands`).then(folders => {
                    if (folders.indexOf(ctx.args[0]) === -1) {
                        return ctx.createMessage(`Module **${ctx.args[0]}** does not exist.`);
                    } else {
                        let pkg = require(path.join(__dirname,  '../', ctx.args[0], 'package.json'));
                        let mod = require(path.join(__dirname, '../', ctx.args[0], pkg.main));
                        let loadedAmt = bot.commands.addModule(ctx.args[0], mod);

                        if (loadedAmt === 0) bot.commands.removeModule(ctx.args[0]);

                        if (loadedAmt !== 0) {
                            let unloadedMods = JSON.parse(fs.readFileSync(`${__baseDir}/data/unloadedCommands.json`).toString());
                            if (unloadedMods.indexOf(ctx.args[0]) !== -1) {
                                unloadedMods.splice(unloadedMods.indexOf(ctx.args[0]), 1);
                                fs.writeFileSync(`${__baseDir}/data/unloadedCommands.json`, JSON.stringify(unloadedMods));
                            }
                        }

                        return ctx.createMessage(`Loaded **${loadedAmt}/${mod.commands.length}** commands from module **${ctx.args[0]}**`);
                    }
                }).then(resolve).catch(reject);
            }
        });
    }
};

exports.unload = {
    desc: 'Unload a module.',
    usage: '<module>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.args[0]) {
                ctx.createMessage('No module given to unload.').then(resolve).catch(reject);
            } else if (!bot.commands.checkModule(ctx.args[0])) {
                ctx.createMessage(`Module **${ctx.args[0]}** is not loaded or does not exist.`).then(resolve).catch(reject);
            } else {
                let pkg = require(path.join(__dirname, '../', ctx.args[0], 'package.json'));
                let mod = require(path.join(__dirname, '../', ctx.args[0], pkg.main));
                let unloadedAmt = bot.commands.removeModule(ctx.args[0], path.join(__dirname, '../', ctx.args[0], pkg.main));
                decache(path.join(__dirname, '../', ctx.args[0], 'package.json'));

                if (unloadedAmt !== 0) {
                    let unloadedMods = JSON.parse(fs.readFileSync(`${__baseDir}/data/unloadedCommands.json`).toString());
                    unloadedMods.push(ctx.args[0]);
                    fs.writeFileSync(`${__baseDir}/data/unloadedCommands.json`, JSON.stringify(unloadedMods));
                }

                ctx.createMessage(`Unloaded **${unloadedAmt}/${mod.commands.length}** commands from module **${ctx.args[0]}**`).then(resolve).catch(reject);
            }
        });
    }
};

exports.reload = {
    desc: 'Reload a module.',
    usage: '<module>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.args[0]) {
                ctx.createMessage('No module given to reload.').then(resolve).catch(reject);
            } else if (!bot.commands.checkModule(ctx.args[0])) {
                ctx.createMessage(`Module **${ctx.args[0]}** is not loaded or does not exist.`).then(resolve).catch(reject);
            } else {
                decache(path.join(__dirname, '../', ctx.args[0], 'package.json'));
                let pkg = require(path.join(__dirname,  '../', ctx.args[0], 'package.json'));
                decache(path.join(__dirname, '../', ctx.args[0], pkg.main));
                let mod = require(path.join(__dirname, '../', ctx.args[0], pkg.main));

                let reloadedAmt = bot.commands.reloadModule(ctx.args[0], mod, path.join(__dirname, '../', ctx.args[0], pkg.main)) || 0;

                ctx.createMessage(`Reloaded **${reloadedAmt}/${mod.commands.length}** commands from module **${ctx.args[0]}**`).then(resolve).catch(reject);
            }
        });
    }
};

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
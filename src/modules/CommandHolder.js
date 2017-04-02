/*
 * Clara - command holder file
 *
 * Contributed by Ovyerus
 */

/* eslint-env node*/

const Eris = require('eris');
const decache = require('decache');
const logger = require(`${__dirname}/logger`);

/**
 * Holds lots of commands and other shit.
 * 
 * @prop {Object} commands Object mapping command objects to their name.
 * @prop {Object} aliases Object mapping aliases to the name of their command.
 * @prop {Object} modules Object mapping module names to and array of their commands.
 * @prop {Number} length Amount of commands currently loaded.
 * @prop {Number} aliasesLength Amount of aliases currently registered.
 * @prop {Array} usedArrayOptions Array of options used by the command handler and loader.
 */

class CommandHolder {

    /**
     * Create a command holder object.
     * 
     * @param {Eris.Client} bot An instance of an Eris client to use in module handling.
     */
    constructor(bot) {
        if (!(bot instanceof Eris.Client)) throw new Error('bot is not an Eris client.');

        this.commands = {};
        this.aliases = {};
        this.modules = {};
        this._bot = bot;
    }

    /**
     * Handle adding a module.
     * 
     * @param {String} moduleName Name to register as in the modules array
     * @param {Object} module Module to add.
     * @param {Boolean} [module.loadAsSubcommands] If true, loads all commands defined in module.commands as subcommands.
     * @param {String[]} module.commands Array of command names to load.
     * @param {Function} [module.init] Function to run when module is loaded and before commands are loaded. Gets passed the main bot object as the only arg.
     * @param {Command} [module.main] If `module.loadAsSubcommands` is true, this is required and is used to give information on the module. `module.main.main` is optional, and by default will list all subcommands, but you can override this.
     * @param {Command} module.* Commands for the module. If their name is in `module.commands`, the command with will loaded. If `module.loadAsSubcommands` is true, these will be loaded as subcommands.
     * @returns {Number} Number of commands loaded.
     */
    addModule(moduleName, module) {
        if (typeof moduleName !== 'string') throw new TypeError('moduleName is not a string.');
        if (!module || typeof module !== 'object') throw new TypeError('module is not an object.');
        if (!(module.commands instanceof Array)) throw new TypeError('module.commands is not an array');
        if (this.modules[moduleName]) throw new TypeError(`'${moduleName}' is already loaded.`);
        if (module.looadAsSubcommands && (typeof module.main !== 'object' || !Object.keys(module.main).length)) throw new TypeError('module.options and module.main are both not objects or are both empty.');

        this.modules[moduleName] = [];

        if (typeof module.init === 'function') module.init(this._bot);

        if (module.loadAsSubcommands) {
            let command = Object.assign({adminOnly: false, fixed: false}, module.main, {subcommands: {}});

            for (let cmd of module.commands) {
                if (typeof module[cmd] === 'object') {
                    command.subcommands[cmd] = module[cmd];
                }
            }

            if (!module.main.main) {
                command.main = (bot, ctx) => {
                    return new Promise((resolve, reject) => {
                        ctx.msg.channel.createMessage('soon').then(resolve).catch(reject);
                    });
                };
            }

            try {
                this.addCommand(moduleName, command);
                this.modules[moduleName].push(moduleName);
                this.modules[`${moduleName}-fixed`] = command.fixed;
                logger.custom('blue', 'CommandHolder/addModule', `Successfully loaded module '${moduleName}'`);
            } catch(err) {
                logger.customError('CommandHolder/addMoule', `Error when attempting to load module '${moduleName}':\n${err}`);
            }
        } else {
            for (let cmd of module.commands) {
                if (typeof module[cmd] === 'object') {
                    try {
                        this.addCommand(cmd, module[cmd]);
                        this.modules[moduleName].push(cmd);
                        logger.custom('blue', 'CommandHolder/addModule', `Successfully loaded command '${cmd}'`);
                    } catch(err) {
                        logger.customError('CommandHolder/addMoule', `Error when attempting to load command '${cmd}':\n${err}`);
                    }
                }
            }
        }

        return this.modules[moduleName].length;
    }

    /**
     * Unloads a module and all its commands
     * 
     * @param {String} moduleName Name of the module to remove.
     * @param {String} path Path of the module. Used to decache the required module.
     * @param {Boolean} reloading If true, bypasses the fixed error.
     * @returns {Number} Amount of commands unloaded.
     */
    removeModule(moduleName, path, reloading = false) {
        if (typeof moduleName !== 'string') throw new TypeError('moduleName is not a string.');
        if (typeof path !== 'string') throw new TypeError('path is not a string.');
        if (!this.modules[moduleName]) throw new TypeError(`'${moduleName}' is not loaded.`);
        if (!reloading && this.modules[`${moduleName}-fixed`]) throw new TypeError(`'${moduleName}' cannot be removed.`);

        let amt = 0;
        this.modules[moduleName].forEach(cmd => {
            try {
                this.removeCommand(cmd, true);
                logger.custom('blue', 'CommandHolder/addModule', `Successfully removed command '${cmd}'`);
                amt++;
            } catch(err) {
                logger.customError('CommandHolder/removeMoule', `Error when attempting to remove command '${cmd}':\n${err}`);
            }
        });

        decache(path);
        delete this.modules[moduleName];
        delete this.modules[`${moduleName}-fixed`];
        return amt;
    }

    /**
     * Reload a module and its commands.
     * 
     * @param {String} moduleName Name of the module to reload
     * @param {Object} module Module to replace the old one
     * @param {String} path Path of the module. Used to decache the required module.
     * @returns {Number} Amount of commands reloaded.
     */
    reloadModule(moduleName, module, path) {
        this.removeModule(moduleName, path, true);
        return this.addModule(moduleName, module);
    }

    /**
     * Register a command into the command object.
     * 
     * @param {String} cmdName Name to register the command under.
     * @param {Command} cmdObject Object of the command to register.
     */
    addCommand(cmdName, cmdObject) {
        if (typeof cmdName !== 'string') throw new TypeError('cmdName is not a string');
        if (typeof cmdObject !== 'object') new TypeError('cmdObject is not an object');
        if (this.commands[cmdName] == null && !(cmdObject.desc && cmdObject.main)) throw new TypeError(`Not loading '${cmdName}' due to missing one or both required properties, desc and main.`);
        if (this.commands[cmdName]) throw new TypeError(`'${cmdName}' already exists in the command holder.`);

        this.commands[cmdName] = cmdObject;
    }

    /**
     * Remove a command from the command object.
     * 
     * @param {String} cmdName The name of the command to remove.
     */
    removeCommand(cmdName, reloading) {
        if (typeof cmdName !== 'string') throw new TypeError('cmdName is not a string.');
        if (!this.commands[cmdName]) throw new TypeError(`'${cmdName}' does not exist in the command holder.`);
        if (this.commands[cmdName].fixed && !reloading) throw new TypeError(`'${cmdName}' cannot be removed.`);

        delete this.commands[cmdName];
    }

    /**
     * Reload a command in the command object.
     * 
     * @param {String} cmdName The name of the command to reload.
     * @param {Command} cmdObject Object of the command to register.
     */
    reloadCommand(cmdName, cmdObject) {
        removeCommand(cmdName, true);
        addCommand(cmdName, cmdObject);
    }

    /**
     * Get a command from the command object.
     * 
     * @param {String} cmdName The name of the command to get.
     * @returns {Object|Null} Returns command object if it exists.
     */
    getCommand(cmdName) {
        return this.commands[cmdName] || null;
    }

    /**
     * Check if a command is in the command object.
     * 
     * @param {String} cmdName The name of the command to check.
     * @returns {Boolean}
     */
    checkCommand(cmdName) {
        return this.commands[cmdName] ? true : false;
    }

    /**
     * Run a command from the command object.
     * 
     * @param {String} cmdName The name of the command to run.
     * @param {Eris.Client} bot Instance of bot to pass to the command.
     * @param {Context} ctx Context object to be passed to the command.
     * @param {String} [subcommand] Name of subcommand to run.
     * @returns {Promise} Resolves if command is run successfully, or rejects if there is an error.
     */
    runCommand(cmdName, bot, ctx, subcommand) {
        return new Promise((resolve, reject) => {
            if (!cmdName || !bot || !ctx) {
                reject(new Error('One or more arguments are missing.'));
            } else if (!this.commands[cmdName]) {
                reject(new Error(`Command '${cmdName}' does not exist in the command holder.`));
            } else {
                if (!subcommand || typeof this.commands[cmdName].subcommands[subcommand] !== 'object') {
                    this.commands[cmdName].main(bot, ctx).then(resolve).catch(reject);
                } else {
                    this.commands[cmdName].subcommands[subcommand].main(bot, ctx).then(resolve).catch(reject);
                }
            }
        });
    }

    /**
     * Loop through the commands.
     * @param {Function} callback Function to run on each iteration.
     */
    forEach(callback) {
        if (!callback || typeof callback !== 'function') throw new Error('callback is not a function');

        for (let cmd in this.commands) {
            callback(cmd, this.commands[cmd]);
        }
    }

    /**
     * Check if a module exists in the modules object.
     * 
     * @param {String} modName Name of the module to check.
     * @returns {Boolean} True if module exists.
     */
    checkModule(modName) {
        return this.modules[modName] ? true : false;
    }

    get length() {
        return Object.keys(this.commands).length;
    }

    get aliasesLength() {
        return Object.keys(this.aliases).length;
    }

    get usedCommandOptions() {
        return ['desc', 'longDesc', 'usage', 'adminOnly', 'fixed', 'main'];
    }
}

/**
 * A command.
 * 
 * @prop {String} desc Short description of what the command does.
 * @prop {String} [longDesc] Full description of the command.
 * @prop {String} [usage] Arguments for the command.
 * @prop {Boolean} adminOnly Restricts the command to the bot admins.
 * @prop {Boolean} fixed Says if the command can be unloaded or not.
 * @prop {Function} main Function for when the command is run.
 */
class Command { // eslint-disable-line
    constructor() {}
}

/**
 * Context to pass to a command.
 * 
 * @prop {Eris.Message} ctx.msg Message to be passed through context.
 * @prop {Array} ctx.args Array of command arguments.
 * @prop {String} ctx.cmd Name of command run.
 * @prop {String} ctx.suffix Arguments joined with spaces.
 * @prop {String} ctx.cleanSuffix Suffix with resolved content.
 * @prop {Eris.Member} ctx.guildBot The member object of the bot.
 */
class Context { // eslint-disable-line
    constructor() {}
}

module.exports = CommandHolder;
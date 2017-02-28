/*
 * Clara - command object file
 * 
 * Contributed by Ovyerus
 */

/** 
 * Object to handle and store commands, modules and aliases.
 * @prop {Object} commands Object mapping command objects to their name.
 * @prop {Object} aliases Object mapping aliases to the name of their command.
 * @prop {Array<String>} modules Array of strings of loaded modules.
 * @prop {Number} length Amount of commands currently loaded.
 * @prop {Number} aliasesLength Amount of aliases currently registered.
 */

class CommandHolder {

    /**
     * Create a command holder object.
     */
    constructor() {
        this.commands = {};
        this.aliases = {};
        this.modules = [];
    }

    /**
     * Add a module name to the modules array.
     * @arg {String} modFolder Name of the module folder to add.
     */
    addModule(modFolder) {
        if (!modFolder || typeof modFolder !== 'string') throw new Error(`modFolder is ${!modFolder ? 'not specified.' : 'not a string.'}`);
        this.modules.push(modFolder);
    }

    /**
     * Remove a module name from the modules array if it exists.
     * @arg {String} modFolder Name of the module folder to remove.
     */
    removeModule(modFolder) {
        if (!modFolder || typeof modFolder !== 'string') throw new Error(`modFolder is ${!modFolder ? 'not specified.' : 'not a string.'}`);
        delete this.modules[this.modules.indexOf(modFolder)];
    }

    /**
     * Register a command into the command object.
     * @arg {String} cmdName Name to register the command under.
     * @arg {Object} cmdObject Object of the command to register.
     * @arg {String} cmdObject.desc Description to display in the help command.
     * @arg {Function} cmdObject.main Function for when the command is run.
     * @arg {String} [cmdObject.longDesc] Description to show in single command help dialog.
     * @arg {String} [cmdObject.usage] Arguments for the command.
     * @arg {Boolean} [cmdObject.adminOnly] If true, limits command to be only able to be run by the bot owner or bot admins.
     * @arg {Boolean} [cmdObject.fixed] If true, will not allow the command to be unloaded.
     * @returns {String} The name of the command registered.
     */
    addCommand(cmdName, cmdObject) {
        if (typeof cmdName !== 'string') throw new Error('cmdName is not a string');
        if ((cmdObject instanceof Object) !== true) new Error('cmdObject is not an object');
        if (this.commands[cmdName] == undefined && !(cmdObject.desc && cmdObject.main)) throw new Error(`Not loading '${cmdName}' due to missing one or both required properties, desc and main.`);
        if (this.commands[cmdName]) throw new Error(`'${cmdName}' already exists in the command holder.`);

        this.commands[cmdName] = cmdObject;
        return this.commands[cmdName];
    }

    /**
     * Remove a command from the command object.
     * @arg {String} cmdName The name of the command to remove.
     * @returns {String} The name of the command removed.
     */
    removeCommand(cmdName) {
        if (typeof cmdName !== 'string') throw new Error('cmdName is not a string.');
        if (!this.commands[cmdName]) throw new Error(`'${cmdName}' does not exist in the command holder.`);
        if (this.commands[cmdName].fixed) throw new Error(`'${cmdName}' cannot be removed.`);
        
        delete this.commands[cmdName];
        return cmdName;
    }

    /**
     * Reload a command in the command object.
     * @arg {String} cmdName The name of the command to reload.
     * @arg {Object} cmdObject Object of the command to register.
     * @arg {String} cmdObject.desc Description to display in the help command.
     * @arg {Function} cmdObject.main Function for when the command is run.
     * @arg {String} [cmdObject.longDesc] Description to show in single command help dialog.
     * @arg {String} [cmdObject.usage] Arguments for the command.
     * @arg {Boolean} [cmdObject.adminOnly] If true, limits command to be only able to be run by the bot owner or bot admins.
     * @arg {Boolean} [cmdObject.fixed] If true, will not allow the command to be unloaded.
     * @returns {String} The name of the command registered.
     */
    reloadCommand(cmdName, cmdObject) {
        if (!this.commands[cmdName]) throw new Error(`Command '${cmdName}' does not exist in the command holder.`);
        if (!cmdObject.desc || !cmdObject.main) throw new Error('One or both required properties of cmdObject are missing, desc and main.');

        delete this.commands[cmdName];
        this.commands[cmdName] = cmdObject;
        return cmdName;
    }

    /**
     * Get a command from the command object.
     * @arg {String} cmdName The name of the command to get.
     * @returns {Object|Null} Returns command object if it exists.
     */
    getCommand(cmdName) {
        return this.commands[cmdName] || null;
    }

    /**
     * Run a command from the command object.
     * @arg {String} cmdName The name of the command to run.
     * @arg {Eris.Client} bot Instance of bot to pass to the command.
     * @arg {Object} ctx Context object to be passed to the command.
     * @arg {Eris.Message} ctx.msg Message to be passed through context.
     * @arg {Array} ctx.args Array of command arguments.
     * @arg {String} ctx.cmd Name of command run.
     * @arg {String} ctx.suffix Arguments joined with spaces.
     * @arg {String} ctx.cleanSuffix Suffix with resolved content.
     * @arg {Eris.Member} ctx.guildBot The member object of the bot.
     * @returns {Promise} Resolves if command is run successfully, or rejects if there is an error.
     */
    runCommand(cmdName, bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!cmdName || !bot || !ctx) {
                reject(new Error('One or more arguments are missing.'));
            } else if (!this.commands[cmdName]) {
                reject(new Error(`Command '${cmdName}' does not exist in the command holder.`));
            } else {
                this.commands[cmdName].main(bot, ctx).then(resolve).catch(reject);
            }
        });
    }

    /**
     * Loop through the commands.
     * @arg {Function} callback Function to run on each iteration.
     */
    forEach(callback) {
        if (!callback || typeof callback !== 'function') throw new Error('callback is not a function');
        
        for (let cmd in this.commands) {
            callback(cmd, this.commands[cmd]);
        }
    }

    /**
     * Check if a module exists in the module array.
     * @arg {String} modName Name of the module to check.
     * @returns {Boolean} True if module exists.
     */
    checkModule(modName) {
        return this.modules.indexOf(modName) !== -1;
    }

    get length() {
        return Object.keys(this.commands).length;
    }

    get aliasesLength() {
        return Object.keys(this.aliases).length;
    }
}

module.exports = CommandHolder;
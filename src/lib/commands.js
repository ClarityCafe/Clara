/*
 * Clara - command object file.
 * 
 * Contributed by Ovyerus
 */

class CommandHolder {

    constructor() {
        this.commands = {};
        this.aliases = {};
        this.modules = [];
    }

    addModule(modFolder) {
        if (!modFolder || typeof modFolder !== 'string') throw new Error(`modFolder is ${!modFolder ? 'not specified.' : 'not a string.'}`);
        this.modules.push(modFolder);
    }

    removeModule(modFolder) {
        if (!modFolder || typeof modFolder !== 'string') throw new Error(`modFolder is ${!modFolder ? 'not specified.' : 'not a string.'}`);
        delete this.modules[this.modules.indexOf(modFolder)];
    }

    addCommand(cmdName, cmdObject) {
        if (typeof cmdName !== 'string') throw new Error('cmdName is not a string');
        if ((cmdObject instanceof Object) !== true) new Error('cmdObject is not an object');
        if (this.commands[cmdName] == undefined && !(cmdObject.desc && cmdObject.main)) throw new Error(`Not loading '${cmdName}' due to missing one or both required properties, desc and main.`);
        if (this.commands[cmdName]) throw new Error(`'${cmdName}' already exists in the command holder.`);

        this.commands[cmdName] = cmdObject;
        return this.commands[cmdName];
    }

    removeCommand(cmdName) {
        if (typeof cmdName !== 'string') throw new Error('cmdName is not a string.');
        if (!this.commands[cmdName]) throw new Error(`'${cmdName}' does not exist in the command holder.`);
        if (this.commands[cmdName].fixed) throw new Error(`'${cmdName}' cannot be removed.`);
        
        delete this.commands[cmdName];
        return cmdName;
    }

    reloadCommand(cmdName, cmdObject) {
        if (!this.commands[cmdName]) throw new Error(`Command '${cmdName}' does not exist in the command holder.`);
        if (!cmdObject.desc || !cmdObject.main) throw new Error('One or both required properties of cmdObject are missing, desc and main.');

        delete this.commands[cmdName];
        this.commands[cmdName] = cmdObject;
        return cmdName;
    }

    getCommand(cmdName) {
        return this.commands[cmdName] || null;
    }

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

    forEach(callback) {
        if (!callback || typeof callback !== 'function') throw new Error('callback is not a function');
        
        for (let cmd in this.commands) {
            callback(cmd, this.commands[cmd]);
        }
    }

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
const Promise = require("bluebird");

const commands = {};

function addCommand(cmdName, cmdObject) {
    return new Promise((resolve, reject) => {
        if (typeof cmdName !== "string") reject(new Error("cmdName is not a string"));
        if ((cmdObject instanceof Object) !== true) reject(new Error("cmdObject is not an object"));

        if (commands[cmdName] == undefined) {
            commands[cmdName] = cmdObject;
            resolve(commands[cmdName]);
        } else {
            reject(new Error(`"${cmdName}" already exists in the command object.`));
        }
    });
}

function removeCommand(cmdName) {
    return new Promise((resolve, reject) => {
        if (typeof cmdName !== "string") reject(new Error("cmdName is not a string."));
        if (!commands[cmdName]) reject(new Error(`"${cmdName}" does not exist in the command object.`));
        if (commands[cmdName].fixed) reject(new Error(`"${cmdName}" cannot be removed.`));

        delete commands[cmdName];
        resolve(cmdName);
    });
}

exports.commands = commands;
exports.addCommand = addCommand;
exports.removeCommand = removeCommand;
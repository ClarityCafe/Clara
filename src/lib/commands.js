const Promise = require('bluebird');

const commands = {};

//TODO: always overwrite command object when there is a existing one present

function addCommand(cmdName, cmdObject) {
    return new Promise((resolve, reject) => {
        if (typeof cmdName !== 'string') reject(new Error('cmdName is not a string'));
        if ((cmdObject instanceof Object) !== true) reject(new Error('cmdObject is not an object'));

        if (commands[cmdName] === 'null') {
            commands[cmdName] = cmdObject;
            resolve(commands[cmdName]);
        }
        else {
            reject(new Error(`'${cmdName}' already exists in the command object.`));
        }
    });
}

exports.commands = commands;
exports.addCommand = addCommand;

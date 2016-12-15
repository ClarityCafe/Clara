const chalk = require('chalk');

function info(message) {
    console.log(`${chalk.bgGreen('info')} ${chalk.green(message)}`);
}

function cmd(message) {
    console.log(`${chalk.bgMagenta('cmd')} ${chalk.magenta(message)}`);
}

function warn(message) {
    console.log(`${chalk.bgYellow('warn')} ${chalk.yellow(message)}`);
}

function error(message) {
    console.error(`${chalk.bgRed('error')} ${chalk.red(message)}`);
}

function custom(colour, name, message) {
    if (!chalk[colour]) throw new Error('colour is not a valid chalk colour');
    console.log(`${chalk['bg' + colour.toLowerCase().charAt(0).toUpperCase() + colour.toLowerCase().slice(1)](name)} ${chalk[colour](message)}`);
}

function customError(name, message) {
    console.error(`${chalk.bgRed(name)} ${chalk.red(message)}`);
}

exports.info = info;
exports.cmd = cmd;
exports.warn = warn;
exports.error = error;
exports.custom = custom;
exports.customError = customError;
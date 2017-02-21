const chalk = require('chalk');

// * logging Optional Info
// * @prop {String} message your message

function info(message) {
    console.log(`${chalk.bgGreen('info')} ${chalk.green(message)}`);
}
// * Internal Logger.
// * @prop {String} message your message
function cmd(message) {
    console.log(`${chalk.bgMagenta('cmd')} ${chalk.magenta(message)}`);
}
// * used for non-fatal errors
// * @prop {String} message your message
function warn(message) {
    console.log(`${chalk.bgYellow('warn')} ${chalk.yellow(message)}`);
}
// * used for fatal errors
// * @prop {String} message your message
function error(message) {
    console.error(`${chalk.bgRed('error')} ${chalk.red(message)}`);
}
// * custom logging using chalk colours
// * @prop {String} colour defines color. Uses Chalk colors
// * @prop {String} name custom name for logging info
// * @prop {string} message your message.
function custom(colour, name, message) {
    if (!chalk[colour]) throw new Error('colour is not a valid chalk colour');
    console.log(`${chalk['bg' + colour.toLowerCase().charAt(0).toUpperCase() + colour.toLowerCase().slice(1)](name)} ${chalk[colour](message)}`);
}
// * custom error logging with name
// * @prop {String} name the name for the error to log
// * @prop {String} message your message
function customError(name, message) {
    console.error(`${chalk.bgRed(name)} ${chalk.red(message)}`);
}

exports.info = info;
exports.cmd = cmd;
exports.warn = warn;
exports.error = error;
exports.custom = custom;
exports.customError = customError;
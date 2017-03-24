/*
 * Clara - logger module
 *
 * Contributed by Ovyerus
 */

const chalk = require('chalk');

/**
 * Generic infomation logging.
 * @arg {String} message Message to log to console.
 */
function info(message) {
    console.log(`${chalk.bgGreen('info')} ${chalk.green(message)}`);
}

/**
 * Internal logging for command running.
 * @arg {String} message Message to log to console.
 */
function cmd(message) {
    console.log(`${chalk.bgMagenta('cmd')} ${chalk.magenta(message)}`);
}

/**
 * Generic warning. Use if wishing to report a non fatal error, but still probably shouldn't be happening.
 * @arg {String} message Message to log to console.
 */
function warn(message) {
    console.log(`${chalk.bgYellow('warn')} ${chalk.yellow(message)}`);
}

/**
 * Generic error logging.
 * @arg {String} message Message to log to console.
 */
function error(message) {
    console.error(`${chalk.bgRed('error')} ${chalk.red(message)}`);
}

/**
 * Generic logging with custom colours.
 * @arg {String} colour Chalk colour to use.
 * @arg {String} name Text to display in a coloured box before the message.
 * @arg {String} message Message to log to console.
 */
function custom(colour, name, message) {
    if (!chalk[colour]) throw new Error('colour is not a valid chalk colour');
    console.log(`${chalk['bg' + colour.toLowerCase().charAt(0).toUpperCase() + colour.toLowerCase().slice(1)](name)} ${chalk[colour](message)}`); // eslint-disable-line prefer-template
}

/**
 * Error logging with custom names.
 * @arg {String} name Text to display in a coloured box before the error.
 * @arg {String} message Message to log to console.
 */
function customError(name, message) {
    console.error(`${chalk.bgRed(name)} ${chalk.red(message)}`);
}

module.exports = {info, cmd, warn, error, custom, customError};
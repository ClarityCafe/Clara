/*
 * Clara - logger module
 *
 * Contributed by Ovyerus and Capuccino.
 */

const chalk = require('chalk');

/**
 * A logger class with 6 types of logging
 * mainly info, error and warning with also support for custom errors and custom logging
 * 
 */
class Logger {
    //needs an empty constructor so we can invoke a "new" statement
    constructor() {

    }

    /**
     * Generic Info Logging. 
     * @param {String} message the message you want to print out.
     * @returns {String} accompanied with green colour
     */


    info(message) {
        return console.log(`${chalk.bgGreen('info')} ${chalk.green(message)}`);
    }


    /**
     * Generic Warnings. Used for non-fatal errors.
     * @param {String} message the message you want to print out.
     * @returns {String} accompanied with yellow colour 
     */


    warn(message) {
        return console.log(`${chalk.bgYellow('warn')} ${chalk.yellow(message)}`);
    }


    /**
     * Generic Error logging.
     * @param {String} message the message you want to print out
     * @returns {String} accompanied with red color.
     */


    error(message) {
        return console.log(`${chalk.bgRed('err')} ${chalk.red(message)}`);
    }


    /**
     * Customized logging using custom colours (within chalk range)
     * @param {String} colour the colour to use. Must be a valid chalk colour.
     * @param {String} name the text to display in the box.
     * @param {String} message the message you want to print out
     * @returns {String} accompanied with a custom colour.
     */


    custom(colour, name, message) {
        if (!chalk[colour]) throw new Error('colour is not a valid chalk colour.');
        return console.log(`${chalk['bg' + colour.toLowerCase().charAt(0).toUpperCase() + colour.toLowerCase().slice(1)](name)} ${chalk[colour](message)}`);
    }


    /**
     * Customized Error logging
     * @param {String} name Text to display in the coloured box.
     * @param {String} message the text you want to print out.
     * @returns {String} accompanied with a custom name in the error box.
     */


    customError(name, message) {
        return console.error(`${chalk.bgRed(name)} ${chalk.red(message)}`);
    }
}

module.exports = Logger;
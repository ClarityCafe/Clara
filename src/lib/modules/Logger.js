/**
 * @file Custom logging methods.
 * @author Capuccino
 * @author Ovyerus
 */

const fs = require('fs');
const path = require('path');

/**
 * Class for various logging methods.
 */
class Logger {
    /**
     * Generic information logger.
     * 
     * @static
     * @param {String} msg Message to log.
     */
    static info(msg) {
        console.log(`\x1b[37;42minfo\x1b[32;49m ${msg}\x1b[0m`);
    }

    /**
     * Internal command logger.
     * 
     * @static
     * @param {String} msg Message to log.
     */
    static cmd(msg) {
        console.log(`\x1b[37;45mcmd\x1b[35;49m ${msg}\x1b[0m`);
    }

    /**
     * Warning logger.
     * Intended for not-100%-breaking errors, but you should still know about it.
     * 
     * @static
     * @param {String} msg Message to log.
     */
    static warn(msg) {
        console.log(`\x1b[37;43mwarn\x1b[33;49m ${msg}\x1b[0m`);
    }

    /**
     * Error logger.
     * 
     * @static
     * @param {String} msg Message to log.
     */
    static error(msg) {
        console.error(`\x1b[37;41merror\x1b[31;49m ${msg}\x1b[0m`);
    }

    /**
     * Generic information logger with custom tag, and blue colour.
     * 
     * @static
     * @param {String} tag Tag for the logged message.
     * @param {String} msg Message to log.
     */
    static custom(tag, msg) {
        console.log(`\x1b[37;44m${tag}\x1b[34;49m ${msg}\x1b[0m`);
    }

    /**
     * Error logger with custom tag.
     * 
     * @static
     * @param {String} tag Tag for the logged message.
     * @param {String} msg Message to log.
     */
    static customError(tag, msg) {
        console.log(`\x1b[37;41m${tag}\x1b[31;49m ${msg}\x1b[0m`);
    }
}

module.exports = Logger;
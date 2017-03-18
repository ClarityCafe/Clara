/*
 * Clara - utility module
 *
 * Contributed by Capuccino and Ovyerus
 */

const fs = require('fs');
const Eris = require('eris');
const config = require(`${__baseDir}/config.json`);

/**
 * Convert millisecond time into a more human-readable format.
 * @arg {Number} ms Milliseconds to convert.
 * @returns {String} Formatted string with days, hours, minutes and seconds.
 */
function msToTime(ms) {
    var time = ms / 1000;
    var seconds = time % 60;
    time /= 60;
    var minutes = time % 60;
    time /= 60;
    var hours = time % 24;
    time /= 24;
    var days = time;

    seconds = Math.floor(seconds);
    minutes = Math.floor(minutes);
    hours = Math.floor(hours);
    days = Math.floor(days);

    seconds.toString().length === 1 ? seconds = '0' + seconds.toString() : seconds = seconds.toString(); // eslint-disable-line prefer-template
    minutes.toString().length === 1 ? minutes = '0' + minutes.toString() : minutes = minutes.toString(); // eslint-disable-line prefer-template
    hours.toString().length === 1 ? hours = '0' + hours.toString() : hours = hours.toString(); // eslint-disable-line prefer-template

    return `${days} days, ${hours}:${minutes}:${seconds}`;
}

/**
 * Easily format user names and discriminators.
 * @arg {Eris.User|Eris.Member} user The user to format.
 * @arg {Boolean} [noDiscrim=false] Whether or not to include the user's discriminator.
 * @returns {String} The users formatted name in the format 'name#discriminator'. Will have users nickname if a member is passed in as the user.
 */
function formatUsername(user, noDiscrim=false) {
    return user instanceof Eris.Member ? `${user.nick ? user.nick : user.user.username}${noDiscrim ? '' : `#${user.user.discriminator}`}` : `${user.username}${noDiscrim ? '' : `#${user.discriminator}`}`;
}

/**
 * Check if the user has bot perms.
 * @param {String} userID ID of the user to check.
 * @returns {Boolean}
 */

function checkBotPerms(userID) {
    return userID === config.ownerID || JSON.parse(fs.readFileSync(`${__baseDir}/data/data.json`)).admins.indexOf(userID) !== -1;
}

/**
 * Check if the user is blacklisted.
 * @arg {String} userID ID of the user to check.
 * @returns {Boolean}
 */
function isBlacklisted(userID) {
    return JSON.parse(fs.readFileSync(`${__baseDir}/data/data.json`)).blacklist.indexOf(userID) !== -1;
}

module.exports = {msToTime, formatUsername, isBlacklisted, checkBotPerms};
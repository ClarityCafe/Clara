/**
 * @file Miscellaneous utility functions
 * @author Capuccino
 * @author Ovyerus 
 */
const Eris = require('eris');
 
/**
  * Class that handles miscellaneous utility functions
  */
class Utils {
    /**
      * Converts milliseconds to a more human-readable format.

      * @param {Number} ms Milliseconds to convert
      * @returns {String} Formatted string with days, hours, minutes and seconds.
      */
    static msToTime(ms) {
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
         
        return `${days} days, ${hours}:${minutes}:${seconds}`;
    }
     
    /**
     * Easily format user names and discriminators.
     * 
     * @param { Eris.User | Eris.Member} user the target user to format.
     * @param {Boolean} [noDiscrim=false] whether to not include or include the user's discriminator.
     * @returns {String} The users formatted name in the format 'user#0001' or likewise. Will use nickname if member is passed in as a user.
     */
    static formatUsername(user, noDiscrim = false) {
        return user instanceof Eris.Member ? `${user.nick ? user.nick : user.user.username}${noDiscrim ? '' : `#${user.user.discriminator}`}` : `${user.username}${noDiscrim ? '' : `#${user.discriminator}`}`;
    }

    /**
      * Output a random color (usually for embeds).

      * @returns {Number} A colour.
      */
    static randomColour() {
        let colours = [
            0x7289DA, // Discord Blurple
            0x99AAB5, // Discord Greyple
            0xF44336, // Red - Rest are Material Design colours from here on
            0xE91E63, // Pink
            0x9C27B0, // Purple
            0x673AB7, // Deep Purple
            0x3F51B5, // Indigo
            0x2196F3, // Blue
            0x03A9F4, // Light Blue
            0x00BCD4, // Cyan
            0x009688, // Teal
            0x4CAF50, // Green
            0x8BC34A, // Light Green
            0xCDDC39, // Lime
            0xFFEB3B, // Yellow
            0xFFC107, // Amber
            0xFF9800, // Orange
            0xFF5722, // Deep Orange
            0x607D8B // Blue Grey
        ];

        return colours[Math.floor(Math.random() * colours.length)];
    }

    /**
     * Generate's a human-readable byte count, scaled accordingly to the appropriate amount.
     * 
     * @param {Number} amt Amount to generate string from.
     * @returns {String} Formatted string.
     */
    static genBytes(amt) {    
        for (let i in this.endings) {
            if (amt / 1000 < 1 || this.endings[i] === this.endings.slice(-1)[0]) return amt.toFixed(2) + ` ${this.endings[i]}`;
            else amt /= 1000;
        }
    }

    static get endings() {
        return ['B', 'KB', 'MB', 'GB', 'TB'];
    }
}

module.exports = Utils;
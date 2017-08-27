/**
 * @file Miscellaneous utility functions
 * @author Capuccino
 * @author Ovyerus 
 */
 const Eris = require('eris');
 
 class Utils {
     /**
      * Converts milliseconds to a more human-readable format
      * @param {Number} ms Milliseconds to convert
      * @returns {String} Formatted string with days, hours, minutes and seconds.
      */
     static msToTime(ms) {
         var time = ms/1000;
         var seconds = time % 60;
         time /=60;
         var minutes = time % 60;
         time /= 60;
         var hours = time % 24;
         time /= 24;
         var days = time;
         
         seconds = Math.floor(seconds);
         minutes = Math.floor (minutes);
         hours = Math.floor(hours);
         days = Math.floor(days);
         
         return `${days} days, ${hours}:${minutes}:${seconds}`;
     }
     
    /**
     * Easily format user names and discriminators
     * @param { Eris.User | Eris.Member} user the target user to format.
     * @returns {String} The users formatted name in the format 'user#0001' or likewise. Will use nickname if member is passed in as a user.
     */
     static formatUsername(user, noDiscrim = false) {
         return user instanceof Eris.Member ? `${user.nick ? user.nick : user.user.username}${noDiscrim ? '' : `#${user.user.discriminator}`}` : `${user.username}${noDiscrim ? '' : `#${user.discriminator}`}`;
     }
 }
 
 module.exports = Utils;
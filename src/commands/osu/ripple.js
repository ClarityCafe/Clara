/*
 * Ripple Support for osu!Stats checking
 *
 * Contributed by Capuccino
 *
 * NOTE: we will use a modified version of Nodesu
 */
 
 exports.commands = [
    'osu.ripple',
    'ctb.ripple',
    'taiko.ripple'
 ];
 
 const Nodesu = require ('./ripple.lib/Client.js');
 const osu = new Nodesu.Client(config.RippleApiKey);
 
 exports.osu.ripple = {
    //TODO: add proper lib here lel
 };
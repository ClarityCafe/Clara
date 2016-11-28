/*
 * remote_process_ctrl.js - control pm2 from Discord
 * 
 * Contributed by Capuccino
 * NOTE: This is dedicated for PM2 and will ONLY work for PM2.
 */

const Promise = require('bluebird');
<<<<<<< 2d143ce7ce0edc13193ec91dee8932febc5e84fc
const ovy = require('child_process');
var process_react = "";
const bot = ovy.exec('pm2', [process_react,'bot']);
=======
const pm2 = require('pm2');
>>>>>>> commiting bc git is bich when rebasing :/

exports.command = [
    'pm2'
];

exports.pm2 = {
    desc: 'View the status of the PM2 session if any, among other things.',
    fullDesc: 'View the status of the PM2 session that the bot is running under, and shutdown/restart the bot.',
    adminOnly: true,
    usage: '[shutdown|restart]',
    main: (bot, ctx) => {
        
    }
}
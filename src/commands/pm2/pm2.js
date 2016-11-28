/*
 * remote_process_ctrl.js - control pm2 from Discord
 * 
 * Contributed by Capuccino
 * NOTE: This is dedicated for PM2 and will ONLY work for PM2.
 */

const Promise = require('bluebird');
const pm2 = require('pm2');

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
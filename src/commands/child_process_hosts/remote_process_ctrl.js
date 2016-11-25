/* Basic Remote PM2 controller
 *  Contibuted by :
 * | Capuccino
 * 
 * NOTE: This is dedicated for PM2 and will ONLY work for PM2.
 *  
 */
exports.command = [
    "core_restart",
    "core_shutdown"
];

const Promise = require('bluebird');
const ovy = require('child_process');
const bot = ovy.exec('pm2', [`${process_react}`,'bot']);
exports.core_restart = {
    desc : "BOTDEVELOPER ONLY! Restarts the PM2 session of the bot",
    adminOnly : "true",
    main : (bot , ctx) => {
        return new Promise((resolve,reject) => {
            var process_react = "restart";
            //TODO: add a clock to delay the command for 3 seconds
            ctx.msg.channel.sendMessage("Shutting down....").then(() => resolve()).catch(err => reject([err]));
        })
    }
};

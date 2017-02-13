// * Simple Restart and Shutdown for Bot
// *
// * it ain't pretty, but it works
// * Contributed by Capuccino

exports.commands = [
    'restart',
    'shutdown'
];

const pm2 = require('pm2');
const cp = require('child_process');

// * This command is made exclusively for the public bot.


exports.restart = {
    desc: 'OWNER ONLY! Restarts the bot. This only works if bot is inside a PM2 controller',
    adminOnly: true,
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage('Okay, Restarting!').then(() => {
                cp.exec('pm2 restart owo-whats-this', (stdout) => {
                    logger.info(stdout);
                });
            }).catch(err => reject([err]));
        });
    }
};

exports.shutdown = {
    desc: 'OWNER ONLY! Kills the bot process',
    adminOnly: true,
    main : (bot,ctx) => {
        return new Promise((resolve,reject) => {
            ctx.msg.channel.createMessage('O-Okay... Shutting down...').then(() => {
                cp.exec('pm2 stop owo-whats-this', (stdout) => {
                    logger.info(stdout);
                });
            }).catch(err => reject([err]));
        });
    }
};
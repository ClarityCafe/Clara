/*
 * awau - awau  
 * 
 * 
 * Contribute dby Capuccino
 */

exports.commands = [
    'awau'
];

exports.awau = {
    desc: 'awau',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.createMessage({file: `${__baseDir}/res/awau/awau.png`, name: 'awau.png'}).then(resolve).catch(reject);
        });
    } 
};
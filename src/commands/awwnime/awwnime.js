/* 
 *  awwnime - Generates a random anime picture.
 * 
 * 
 *  Contributed by Capuccino
 */

exports.commands = [
    'awwnime'
];

const anime = require('random-anime-wallpapers');

exports.awwnime = {
    desc: 'Gets you a random anime picture outside of yorium.moe',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if(!ctx.args) {
                randomAnimeWallpapers().then(images => {
                    let animu = images[Math.floor(Math.random()*Object.id.length)];
                    ctx.msg.channel.createMessage('',{file: animu.full, name: animu.id}).then(resolve).catch(reject);
                }).catch(reject);
            }
        });
    }
};
// * IMG URL to ASCII
// *
// *  We Stole this from Mart
// * Contributed by Capuccino

exports.commands = [
    'ascii'
];

const OWO = require('owo.js');
const ascii = require('ascii-art');
const fs = require('fs');
const owo = new OWO(require(`${__baseDir}/config.json`).owoKey);

exports.ascii = {
    desc: 'turn a boring JPEG into a ASCII art',
    longDesc: 'turn a seemingly innocent JPEG/PNG to a ASCII Masterpiece',
    usage: '<image link>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix === 0) {
                ctx.msg.channel.createMessage('Onee-san, in able to use this, you must provide a URL Link!').then(() => reject([new Error('no URL specified')])).catch(err => ([err]));
            } else {
                ascii.image({
                    height: '768',
                    width: '1024',
                    filePath: `${ctx.suffix}`
                }).font('', 'doom', '', (ascii) => {
                    fs.mkdir('.ascii');
                    fs.writeFile(fs.resolve('.ascii') + 'ascii.txt', ascii);
                    owo.upload(fs.resolve('.ascii/ascii.txt')).then(data => {
                        ctx.msg.channel.createMessage(data).then(() => resolve()).catch(err => ([err]));
                    }).catch(err => ([err]));
                });
            }
        });
    }
};
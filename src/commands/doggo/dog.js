// * random.dog generator
// *
// * Minus the cats
// * Contributed by Capuccino

exports.commands = [
    'woof'
];

const request = require('request');
const Promise = require('bluebird');

exports.woof = {
    desc: `It's like nyaa, only it's dogs`,
    longDesc: 'prints out a random dog image from random.dog',
    main : (bot,ctx) => {
        return new Promise ((resolve,reject) => {
            request('http://random.dog', (err,res,body) => {
                if (err) {
                    reject([err]);
                } else if (res.statusCode !== 200) {
                    reject ([new Error(`Unexpected Response Code from random.dog (Code ${res.statusCode})`)]);
                } else {
                    var pupper = JSON.parse(body).file;
                    ctx.msg.channel.createMessage(pupper).then(() => resolve()).catch(err => ([err]));
                }
            });
        });
    }

};

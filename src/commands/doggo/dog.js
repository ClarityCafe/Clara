/*
 * dog.js - Show dogs from random.dog
 * 
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

const got = require('got');

exports.commands = [
    'woof'
];

exports.woof = {
    desc: `It's like nyaa, only it's dogs`,
    longDesc: 'Prints out a random dog image from random.dog',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            got('http://random.dog/woof').then(res => {
                return ctx.createMessage(`http://random.dog/${res.body}`);
            }).then(resolve).catch(reject);
        });
    }
};
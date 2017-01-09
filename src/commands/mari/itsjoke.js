/* It's Joke!
 *
 * Contributed by Ohara Mari.
 * 
 * Don't ask why is this a thing.
 * 
 */

const Promise = require('bluebird');
const fs = require('fs');

exports.command = [
    'itsjoke'
];

<<<<<<< HEAD
const fs = require('fs');
const Promise = require('bluebird');

=======
>>>>>>> b3f7bf06631ca2776351ada74f01b9eff844e5ee
exports.itsjoke = {
    desc: "it's Joke!",
    longDesc: "it's Joke!",
    usage: "<It's Joke!>",
    main: (bot, ctx) => {
        return new Promise((reject, resolve) => {
<<<<<<< HEAD
            ctx.msg.channel.createMessage({file: fs.readFileSync('../res/528.jpg'), name: 'joke.jpg'}).then(() => resolve()).catch(err => reject([err]));
=======
              ctx.msg.channel.createMessage({file: fs.readFileSync('../res/528.jpg'), name: 'joke.jpg'}).then(() => resolve()).catch(err => reject([err]));
>>>>>>> b3f7bf06631ca2776351ada74f01b9eff844e5ee
        });
    }
};

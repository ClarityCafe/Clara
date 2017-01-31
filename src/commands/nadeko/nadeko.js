// * A Kinky Nadeko Command to piss off Kwoth
// *
// *
// * Contributed by Capuccino (because ovy is not home)

exports.commands = [
    'nadeko'
];

const Promise = require('bluebird');

var emote = [
    ':joy:',
    ':unamused:'
];

exports.nadeko = {
    desc : 'who did it?',
    longDesc: 'owo whats this?',
    main : (bot , ctx) => {
        return new Promise ((resolve , reject) => {
        // why did I do this *facepalm*
            ctx.msg.channel.createMessage(`${ctx.msg.author.mention} did it ${emote[Math.floor(Math.Random() * emote.length)]} :gun:`).then(() => resolve()).catch(err => ([err]));
        });
    }
};
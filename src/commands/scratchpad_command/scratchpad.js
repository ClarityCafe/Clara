// * datchatbot Scratchpad Command
// * Experimental, Do not release with Nodetori
// *
// *
// * by Capuccino

exports.commands = [
    'scratch' 
];

const chatbot = require('datchatbot');
const ayana = new chatbot.Client('', 'kotori');

exports.scratch = {
    desc: 'Experimental Module. Bot Creators only',
    longDesc: 'This is an experimental module. Bot Creators only',
    usage : '<message>',
    main: (bot,ctx) => {
        //we're reusing the same condition if the suffix length is 0
        if (ctx.suffix.length === 0) {
            ctx.msg.channel.createMessage('Hm?').then(()=> resolve()).catch(err => ([err]));
        } else {
            ayana.talk(ctx.suffix).then(()=> {
                //TODO: find out how to query a response from the chatbot
                ctx.msg.channel.createMessage(/* left empty since we don't know how to query the response*/).then(()=> resolve).catch(err => ([err]));
            }).catch(err => ([err]));
        }
    }
};
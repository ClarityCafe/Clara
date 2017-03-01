// * A kinky 8 ball command
// *
// * Contributed by Capuccino


exports.commands = [
    'ball'
];

//a variable of all memes
var responses = [
    'Albeit Not So Good',
    'I Doubt it',
    'You may rely on it',
    'No Doubt!',
    'Yes',
    'No',
    `I didn't quite get that, ask again.`,
    `I can't answer that right now....`,
    `I don't know how to respond to that...`,
    'Meh.'
];

exports.ball = {
    desc: 'Make the bot decide for you or do some things',
    longDesc: "'tis an 8ball command. Nothing new",
    usage: '<Question?>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Ask somethng first.').then(resolve).catch(reject);
            } else if (ctx.suffix) {
                var response = responses[Math.floor(Math.random() * responses.length)];
                ctx.msg.channel.createMessage(response).then(resolve).catch(reject);
            }
        });
    }
};
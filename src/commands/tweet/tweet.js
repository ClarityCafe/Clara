/**
 * @file random.birb.pw command
 * @author Capuccino 
 */

exports.commands = [
    'tweet'
];

exports.tweet = {
    desc: 'Return a random image from random.birb.pw',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.channel.sendTyping();
            got('https://random.birb.pw/tweet').then(res => {
                return ctx.createMessage({embed: {
                    title: 'tweet-title',
                    image: {url: `https://random.birb.pw/img/${res.body}`},
                    footer: {text: 'tweet-credits'}
                }});
            }).then(resolve).catch(reject);
        });
    }
};
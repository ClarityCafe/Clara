/* tweet.js - random birb
 * 
 * 
 * Contributed by Capuccino 
 */

exports.commands = [
    'tweet'
];

exports.tweet = {
    desc: 'Return a random image from random.birb.pw',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            got('https://random.birb.pw/tweet.json/').then(res => {
                const chun = JSON.parse(res.body).file;
                ctx.createMessage({embed: {
                    title: 'What a cute little birby!',
                    image: {url: `https://random.birb.pw/img/${chun}`},
                    footer: `Powered by birb.pw, queried last ${new Date()}`
                }});
            }).catch(reject);
        });
    }
};
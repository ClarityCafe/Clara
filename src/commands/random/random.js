/**
 * @file Random Cat, dog and birb posters
 * @author Capuccino
 */

exports.loadAsSubcommands = true;

exports.commands = [
    'chirp',
    'woof',
    'meow'
];

exports.main = {
    desc: 'Spews out a random image of a birb, a dog or a cat',
    usage: '<woof | meow | chirp>'
};

exports.chirp = {
    desc: 'Random bird images.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.channel.sendTyping();
            got('https://random.birb.pw/tweet').then(res => {
                ctx.createMessage({embed: {
                    title: 'What a cute little birby!',
                    image: {url: `https://random.birb.pw/img/${res.body}`},
                    footer: {text: 'powered by random.birb.pw'}
                }});
            }).then(resolve).catch(reject);
        });
    }
};

exports.meow = {
    desc: 'Random cat images.',
    main(bot, ctx) {
        ctx.channel.sendTyping();
        return new Promise((resolve, reject) => {
            got('http://random.cat/meow').then(res => {
                let kitty = JSON.parse(res.body).file;
                ctx.createMessage({embed: {
                    title: 'Nyaaa~',
                    image: {url: kitty},
                    footer: {text: 'Powered by random.cat'}
                }});
            }).then(resolve).catch(reject);
        });
    }
};
 
exports.woof = {
    desc: 'Random dog images.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.channel.sendTyping();
            got('http://random.dog/woof').then(res => {
                ctx.createMessage({embed: {
                    title: 'Have a random doggo!',
                    image: {url: `http://random.dog/${res.body}`},
                    footer: {text: 'Powered by random.dog'}
                }});
            }).then(resolve).catch(reject);
        });
    }
};
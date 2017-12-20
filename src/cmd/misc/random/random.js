/**
 * @file Random cat, dog and birb posters
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
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let res = await got('https://random.birb.pw/tweet');

        await ctx.createMessage({embed: {
            title: 'What a cute little birby!',
            image: {url: `https://random.birb.pw/img/${res.body}`},
            footer: {text: 'Powered by random.birb.pw'}
        }});
    }
};

exports.meow = {
    desc: 'Random cat images.',
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let res = await got('http://random.cat/meow');
        res = JSON.parse(res.body).file;

        await ctx.createMessage({embed: {
            title: 'Nyaaa~',
            image: {url: res},
            footer: {text: 'Powered by random.cat'}
        }});
    }
};
 
exports.woof = {
    desc: 'Random dog images.',
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let res = await got('http://random.dog/woof');

        await ctx.createMessage({embed: {
            title: 'Have a random doggo!',
            image: {url: `http://random.dog/${res.body}`},
            footer: {text: 'Powered by random.dog'}
        }});
    }
};
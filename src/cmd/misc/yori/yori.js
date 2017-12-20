/**
 * @file Random anime image command.
 * @author Capuccino
 * @author Ovyerus
 * API and service provided by Yorium (yorium.moe)
 */

const cheerio = require('cheerio');

const DIR_REGEX = /.+\//;
const IMG_REGEX = /.+\.(?:png|jpg)/;
const BASE_URL = 'http://i.yorium.moe/albums/';
const IGNORE = require('./ignores.json');

exports.commands = [
    'yori'
];

exports.yori = {
    desc: 'Get a random anime picture.',
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let res = await got(BASE_URL);
        let $ = cheerio.load(res.body);
        let albums =$('a').text().trim().substring(16).trim().split(' ').filter(alb =>  DIR_REGEX.test(alb)).filter(alb => !IGNORE.includes(alb));
        let album = albums[Math.floor(Math.random() * albums.length)];

        res = await got(BASE_URL + album);
        $ = cheerio.load(res.body);
        let imgs = $('a').text().trim().substring(16).trim().split(' ').filter(i => IMG_REGEX.test(i));
        let img = imgs[Math.floor(Math.random() * albums.length)];

        await ctx.createMessage(BASE_URL + album + img);
    }
};
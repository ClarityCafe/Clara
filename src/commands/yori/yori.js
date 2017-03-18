/*
 * yori.js - Random anime image command.
 *
 * Contributed by Capuccino, Ovyerus.
 */

const cheerio = require('cheerio');
const request = require('request');

const dirRegex = /.+\//;
const imgRegex = /.+\.(?:png|jpg)/;
const baseUrl = 'http://i.yorium.moe/albums/';
const ignore = require('./ignores.json');

exports.commands = [
    'yori'
];

exports.yori = {
    desc: 'Get a random anime picture.',
    longDesc: 'Scrapes i.yorium.moe for a random anime picture.',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.sendTyping();
            request(baseUrl, (err, res, body) => {
                if (err) {
                    reject(err);
                } else if (res.statusCode !== 200) {
                    reject(new Error(`Invalid status code: ${res.statusCode}`));
                } else {
                    var $ = cheerio.load(body);
                    var albums = $('a').text().trim().substring('Parent Directory'.length).trim().split(' ').filter(alb => {
                        return dirRegex.test(alb);
                    }).filter(alb => {
                        return ignore.indexOf(alb) === -1;
                    });
                    var album = albums[Math.floor(Math.random() * albums.length)];
                    request(baseUrl + album, (e, r, b) => {
                        if (e) {
                            reject(e);
                        } else if (r.statusCode !== 200) {
                            reject(new Error(`Invalid status code: ${r.statusCode}`));
                        } else {
                            $ = cheerio.load(b);
                            var imgs = $('a').text().trim().substring('Parent Directory'.length).trim().split(' ').filter(i => {
                                return imgRegex.test(i);
                            });
                            var img = imgs[Math.floor(Math.random() * albums.length)];
                            ctx.msg.channel.createMessage(baseUrl + album + img).then(resolve).catch(reject);
                        }
                    });
                }
            });
        });
    }
};
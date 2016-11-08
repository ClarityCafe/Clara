/*
*  anime - return a search query from MAL
*  Contributed by Capuccino
*  owo-whats-this Core Command Module
*/

exports.commands = [
    "anime",
    "userlist"
];

const xml = require('xml2js');
const request = require('request');

exports.anime = {
    name: "anime",
    desc: " return a name of the anime from MyAnimeList",
    usage: "<Anime Name>",
    main: (bot, ctx) => {
        var query = ctx.suffix;
        request(`https://myanimelist.net /api/anime|manga/search.xml?q=${query} `, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                var title = xml.parseString(xml, { tagNameProcessors: [title] }, () => {
                  //insert Putin Code here.
                })
            }
        })
    }
}
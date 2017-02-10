/*
 *  anime.js - Search MyAnimeList for manga and anime
 * 
 *  Contributed by Capuccino and Ovyerus
 */


const mal = require('malapi').Anime;
const color = require('dominant-color');
const request = require('request');
const fs = require('fs');

exports.commands = [
    'anime'
];

function animeBlock(animu, color) {
    return {embed: {
        title: animu.title,
        url: animu.detailsLink,
        thumbnail: {url: animu.image},
        color: parseInt(color, 16),
        fields: [
            {name: 'ID', value: animu.id, inline: true},
            {name: 'Japanese', value: animu.alternativeTitles.japanese.join(', ').substring(9).trim(), inline: true},
            {name: 'English', value: animu.alternativeTitles.english ? animu.alternativeTitles.english.join(', ').substring(8).trim() : 'None', inline: true},
            {name: 'Synonyms', value: animu.alternativeTitles.synoynms ? animu.alternativeTitles.synoynms.join(',').substring(9).trim() : 'None', inline: true},
            {name: 'Genres', value: animu.genres.join(', '), inline: true},
            {name: 'Type', value: animu.type, inline: true},
            {name: 'Episodes', value: animu.episodes, inline: true},
            {name: 'Status', value: animu.status, inline: true},
            {name: 'Aired', value: animu.aired, inline: true},
            {name: 'Classification', value: animu.classification, inline: true},
            {name: animu.studios.length === 1 ? 'Studio' : 'Studios', value: animu.studios.join(', '), inline: true},
            {name: 'Score', value: animu.statistics.score.value, inline: true},
            {name: 'Popularity',  value: animu.statistics.popularity, inline: true},
            {name: 'Ranking', value: animu.statistics.ranking, inline: true}
        ]
    }}
}

exports.anime = {
    desc: 'Searches MyAnimeList for an anime.',
    fullDesc: 'Searches MyAnimeList for an anime either by name, id or url, automatically detecting it.',
    usage: '<anime name|id|url>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.msg.channel.createMessage('Please give me something to search with.').then(() => {
                    reject([new Error('No arguments given.')]);
                }).catch(err => reject([err]));
            } else {
                ctx.msg.channel.sendTyping();
                if (/^\d+$/.test(ctx.suffix)) {
                    mal.fromId(Number(ctx.suffix)).then(animu => {
                        var savePath = `${__baseDir}/cache/${animu.image.split('/')[animu.image.split('/').length - 1]}`;
                        request(animu.image).pipe(fs.createWriteStream(savePath)).on('close', () => {
                            color(savePath, (err, color) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    fs.unlink(savePath, () => {
                                        ctx.msg.channel.createMessage(animeBlock(animu, color)).then(() => resolve()).catch(err => reject([err]));
                                    });
                                }
                            });
                        });
                    }).catch(reject);
                } else if (/^https?:\/\/myanimelist\.net\/anime\/\d+\/.+$/.test(ctx.suffix)) {
                    mal.fromUrl(ctx.suffix).then(animu => {
                        var savePath = `${__baseDir}/cache/${animu.image.split('/')[animu.image.split('/').length - 1]}`;
                        request(animu.image).pipe(fs.createWriteStream(savePath)).on('close', () => {
                            color(savePath, (err, color) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    fs.unlink(savePath, () => {
                                        ctx.msg.channel.createMessage(animeBlock(animu, color)).then(() => resolve()).catch(err => reject([err]));
                                    });
                                }
                            });
                        });
                    }).catch(reject);
                } else {
                    mal.fromName(ctx.suffix).then(animu => {
                        var savePath = `${__baseDir}/cache/${animu.image.split('/')[animu.image.split('/').length - 1]}`;
                        request(animu.image).pipe(fs.createWriteStream(savePath)).on('close', () => {
                            color(savePath, (err, color) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    fs.unlink(savePath, () => {
                                        ctx.msg.channel.createMessage(animeBlock(animu, color)).then(() => resolve()).catch(err => reject([err]));
                                    });
                                }
                            });
                        });
                    }).catch(reject);
                }
            }
        });
    }
}
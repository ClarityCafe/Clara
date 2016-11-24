/*
 *  anime.js - Search MyAnimeList for manga and anime
 * 
 *  Contributed by Capuccino and Ovyerus
 */

const Promise = require('bluebird');
const mal = require('malapi').Anime;

exports.commands = [
    'anime'
];

function animeBlock(animu) {
    var animuTxt = `MyAnimeList results for **${animu.title}**\n`;
    animuTxt += '```prolog\n';
    animuTxt += `ID: ${animu.id}\n`;
    animuTxt += `Japanese: '${animu.alternativeTitles.japanese[0].replace('Japanese:', '').trim()}'\n`;
    animuTxt += `English: '${animu.alternativeTitles.english[0].replace('English:', '').trim()}'\n`;
    animuTxt += `Synonyms: '${animu.alternativeTitles.synoynms.join(', ').replace('Synonyms:', '').trim()}'\n`;
    animuTxt += `Genres: '${animu.genres.join(', ')}'\n`;
    animuTxt += `Type: '${animu.type}'\n`;
    animuTxt += `Episodes: ${animu.episodes}\n`;
    animuTxt += `Status: '${animu.status}'\n`;
    animuTxt += `Aired: '${animu.aired}'\n`;
    animuTxt += `Classification: '${animu.classification}'\n`;
    animuTxt += `${animu.studios.length === 1 ? 'Studio' : 'Studios'}: '${animu.studios.join(', ')}'\n`;
    animuTxt += `Score: ${animu.statistics.score.value}\n`;
    animuTxt += `Popularity: ${animu.statistics.popularity}\n`;
    animuTxt += `Ranking: ${animu.statistics.ranking}\n`;
    animuTxt += '```';
    animuTxt += `<${animu.detailsLink}>`;
    return animuTxt;
}

exports.anime = {
    desc: 'Searches MyAnimeList for an anime.',
    fullDesc: 'Searches MyAnimeList for an anime either by name, id or url, automatically detecting it.',
    usage: '<anime name|id|url>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.msg.channel.sendMessage('Please give me something to search with.').then(() => {
                    reject([new Error('No arguments given.')]);
                }).catch(err => reject([err]));
            } else {
                if (/^\d+$/.test(ctx.suffix)) {
                    mal.fromId(Number(ctx.suffix)).then(animu => {
                        ctx.msg.channel.sendMessage(animeBlock(animu)).then(() => resolve()).catch(err => reject([err]));
                    }).catch(reject);
                } else if (/^https?:\/\/myanimelist\.net\/anime\/\d+\/.+$/.test(ctx.suffix)) {
                    mal.fromUrl(ctx.suffix).then(animu => {
                        ctx.msg.channel.sendMessage(animeBlock(animu)).then(() => resolve()).catch(err => reject([err]));
                    }).catch(reject);
                } else {
                    mal.fromName(ctx.suffix).then(animu => {
                        ctx.msg.channel.sendMessage(animeBlock(animu)).then(() => resolve()).catch(err => reject([err]));
                    }).catch(reject);
                }
            }
        });
    }
}
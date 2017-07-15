/**
 * @file Search MyAnimeList for anime
 * @author Capuccino
 * @author Ovyerus
 */

/* eslint-env node */

const mal = require('malapi').Anime;

exports.commands = [
    'anime'
];

exports.anime = {
    desc: 'Searches MyAnimeList for an anime.',
    fullDesc: 'Searches MyAnimeList for an anime either by name, id or url, automatically detecting it.',
    usage: '<anime name|id|url>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.createMessage('anime-noArgs').then(resolve).catch(reject);
            } else {
                ctx.channel.sendTyping();
                if (/^\d+$/.test(ctx.suffix)) {
                    mal.fromId(Number(ctx.suffix)).then(animu => {
                        return ctx.createMessage(animeBlock(animu));
                    }).then(resolve).then(resolve).catch(err => {
                        if (err.message === "Cannot read property 'id' of undefined") {
                            return ctx.createMessage('notFound'); // valve pls fix
                        } else {
                            reject();
                        }
                    }).then(r => {if (r) resolve();}).catch(reject);
                } else if (/^https?:\/\/myanimelist\.net\/anime\/\d+\/.+$/.test(ctx.suffix)) {
                    mal.fromUrl(ctx.suffix).then(animu => {
                        return ctx.createMessage(animeBlock(animu));
                    }).then(resolve).then(resolve).catch(err => {
                        if (err.message === "Cannot read property 'id' of undefined") {
                            return ctx.createMessage('notFound'); // valve pls fix
                        } else {
                            reject();
                        }
                    }).then(r => {if (r) resolve();}).catch(reject);
                } else {
                    mal.fromName(ctx.suffix).then(animu => {
                        return ctx.createMessage(animeBlock(animu));
                    }).then(resolve).catch(err => {
                        if (err.message === "Cannot read property 'id' of undefined") {
                            return ctx.createMessage('notFound'); // valve pls fix
                        } else {
                            reject();
                        }
                    }).then(r => {if (r) resolve();}).catch(reject);
                }
            }
        });
    }
};

function animeBlock(animu) {
    return {embed: {
        title: animu.title,
        url: animu.detailsLink,
        thumbnail: {url: animu.image},
        fields: [
            {name: 'id', value: animu.id, inline: true},
            {name: 'anime-japanese', value: animu.alternativeTitles.japanese.join(', ').substring(9).trim(), inline: true},
            {name: 'anime-english', value: animu.alternativeTitles.english ? animu.alternativeTitles.english.join(', ').substring(8).trim() : 'none', inline: true},
            {name: 'anime-synonyms', value: animu.alternativeTitles.synoynms ? animu.alternativeTitles.synoynms.join(',').substring(9).trim() : 'none', inline: true},
            {name: 'anime-genres', value: animu.genres.join(', '), inline: true},
            {name: 'anime-type', value: animu.type, inline: true},
            {name: 'anime-episodes', value: animu.episodes, inline: true},
            {name: 'anime-status', value: animu.status, inline: true},
            {name: 'anime-aired', value: animu.aired, inline: true},
            {name: 'anime-classification', value: animu.classification, inline: true},
            {name: animu.studios.length === 1 ? 'anime-studio' : 'anime-studios', value: animu.studios.join(', '), inline: true},
            {name: 'anime-score', value: animu.statistics.score.value, inline: true},
            {name: 'anime-popularity',  value: animu.statistics.popularity, inline: true},
            {name: 'anime-ranking', value: animu.statistics.ranking, inline: true}
        ]
    }};
}
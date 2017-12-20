/**
 * @file Search MyAnimeList for anime
 * @author Capuccino
 * @author Ovyerus
 */

const mal = require('malapi').Anime;

exports.commands = [
    'anime'
];

exports.anime = {
    desc: 'Searches MyAnimeList for an anime.',
    usage: '<anime name|id|url>',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('anime-noArgs');

        await ctx.channel.sendTyping();

        let animu;

        if (/^\d+$/.test(ctx.suffix)) animu = await mal.fromId(Number(ctx.suffix));
        else if (/^https?:\/\/myanimelist\.net\/anime\/\d+\/.+$/.test(ctx.suffix)) animu = await mal.fromUrl(ctx.suffix);
        else animu = await mal.fromName(ctx.suffix);

        if (!animu) return await ctx.createMessage('notFound');

        await ctx.createMessage(animeBlock(animu));
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
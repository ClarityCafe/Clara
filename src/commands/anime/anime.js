/*
 *  anime.js - Search MyAnimeList for manga and anime
 * 
 *  Contributed by Capuccino and Ovyerus
 */

const Promise = require("bluebird");
const mal = require("malapi").Anime;
const logger = require(`${_baseDir}/lib/logger.js`);

exports.commands = [
    "anime"
];

function animeBlock(animu) {
    var animuTxt = `MyAnimeList results for **${animu.title}**\n`;
    animuTxt += "```prolog\n";
    animuTxt += `ID: ${animu.id}\n`;
    animuTxt += `Japanese: "${animu.alternativeTitles.japanese[0].replace("Japanese:", "").trim()}"\n`;
    animuTxt += `English: "${animu.alternativeTitles.english[0].replace("English:", "").trim()}"\n`;
    animuTxt += `Synonyms: "${animu.alternativeTitles.synoynms.join(", ").replace("Synonyms:", "").trim()}"\n`;
    animuTxt += `Genres: "${animu.genres.join(", ")}"\n`;
    animuTxt += `Type: "${animu.type}"\n`;
    animuTxt += `Episodes: ${animu.episodes}\n`;
    animuTxt += `Status: "${animu.status}"\n`;
    animuTxt += `Aired: "${animu.aired}"\n`;
    animuTxt += `Classification: "${animu.classification}"\n`;
    animuTxt += `${animu.studios.length === 1 ? "Studio" : "Studios"}: "${animu.studios.join(", ")}"\n`;
    animuTxt += `Score: ${animu.statistics.score.value}\n`;
    animuTxt += `Popularity: ${animu.statistics.popularity}\n`;
    animuTxt += `Ranking: ${animu.statistics.ranking}\n`;
    animuTxt += "```";
    animuTxt += `<${animu.detailsLink}>`;
    return animuTxt;
}

exports.anime = {
    desc: "Searches MyAnimeList for an anime.",
    fullDesc: "Searches MyAnimeList for an anime either by name, id or url, automatically detecting it.",
    usage: "<anime name|id|url>",
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.msg.channel.sendMessage("Please give me something to search with.").then(() => {
                    reject([new Error("No arguments given.")]);
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

/*
Anime {
    title: "Byousoku 5 Centimeter",
    id: "1689",
    image: "https://myanimelist.cdn-dena.com/images/anime/6/73426.jpg",
    detailsLink: "https://myanimelist.net/anime/1689/Byousoku_5_Centimeter",
    episodesLink: "https://myanimelist.net/anime/1689/Byousoku_5_Centimeter/episode",
    alternativeTitles: {
        japanese: ["Japanese: 秒速５センチメートル"],
        english: ["English: 5 Centimeters Per Second"],
        synoynms: ["Synonyms: Five Centimeters Per Second",
            " Byousoku 5 Centimeter - a chain of short stories about their distance",
            " 5 Centimetres Per Second",
            " 5 cm per second"
        ]
    },
    type: "Movie",
    episodes: "3",
    status: "Finished Airing",
    aired: "Feb 16, 2007 to Mar 3, 2007",
    genres: ["Drama", "Romance", "Slice of Life"],
    classification: "PG-13 - Teens 13 or older",
    statistics: {
        score: {
            value: "8.11",
            count: "201,962"
        },
        popularity: "#87",
        members: "317,986",
        favorites: "6,545",
        ranking: "#406"
    },
    synopsis: "Takaki Toono and Akari Shinohara, two very close friends and classmates, are torn apart when Akari\"s family is transferred t
    another region of Japan due to her family\ "s job. Despite separation, they continue to keep in touch through mail. When Takaki finds out 
    hat his family is also moving,
    he decides to meet with Akari one last time.\r\ n\ r\ nAs years pass by,
    they
    continue down their own paths,
    t
    eir distance slowly growing wider and their contact with one another fades.Yet,
    they keep remembering one another and the times they have
    shared together,
    wondering
    if they will have the chance to meet once again.\r\ n\ r\ n[Written by MAL Rewrite]
    ",                             
    studios: ["CoMix Wave Films"],
    adaptations: [{
        type: "Adaptation",
        name: [Object]
    }, {
        type: "Summary",
        name: [Object]
    }],
    characters: [{
        name: "Toono, Takaki",
        role: "Main",
        actor: "Mizuhashi, Kenji",
        language: "Japanese"
    }, {
        name: "Sumida, Kanae",
        role: "Main",
        actor: "Hanamura, Satomi",
        language: "Japanese"
    }, {
        name: "Shinohara, Akari",
        role: "Main",
        actor: "Onoue, AyakaKondo, Yoshimi",
        language: "JapaneseJapanese"
    }, {
        name: "Sumida, Sister",
        role: "Supporting",
        actor: "Mizuno, Risa",
        language: "Japanese"
    }],
    staff: [{
        name: "Chung, Jin Ho",
        role: [Object]
    }, {
        name: "Shinkai, Makoto",
        role: [Object]
    }, {
        name: "Foster, Steven",
        role: [Object]
    }, {
        name: "Yamazaki, Masayoshi",
        role: [Object]
    }]
}
*/
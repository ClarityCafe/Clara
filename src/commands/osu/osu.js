/*
 * osu.js - osu! stats command.
 * 
 * Contributed by Capuccino and Ovyerus.
 */

const config = require(`${__baseDir}/config.json`);
const osu = require('osu')(config.osuApiKey);
const iso3166 = require('iso-3166-1-alpha-2');

var commaRegex = /\B(?=(\d{3})+(?!\d))/g; // Thank you Brayzure uwu

function osuBlock(user) {
    return {embed: {
        title: `osu! stats for **${user.username}**`,
        url: `https://osu.ppy.sh/u/${user.user_id}`,
        thumbnail: {url: `http://a.ppy.sh/${user.user_id}`},
        color: 0xFD7BB5,
        fields: [
            {name: 'ID', value: user.user_id, inline: true},
            {name: 'Country', value: `${iso3166.getCountry(user.country)} :flag_${user.country.toLowerCase()}:`, inline: true},
            {name: 'Country Rank', value: user.pp_country_rank.replace(commaRegex, ','), inline: true},
            {name: 'Beatmaps Played', value: user.playcount ? user.playcount.replace(commaRegex, ',') : 'none', inline: true},
            {name: '300s Scored', value: user.count300 ? user.count300.replace(commaRegex, ',') : 'none', inline: true},
            {name: '100s Scored', value: user.count100 ? user.count100.replace(commaRegex, ',') : 'none', inline: true},
            {name: '50s Scored', value: user.count50 ? user.count50.replace(commaRegex, ',') : 'none', inline: true},
            {name: 'Ranked Score', value: user.ranked_score ? user.ranked_score.replace(commaRegex, ',') : 'none', inline: true},
            {name: 'Total Score', value: user.total_score ? user.total_score.replace(commaRegex, ',') : 'none', inline: true},
            {name: 'PP', value: user.pp_raw ? user.pp_raw.replace(commaRegex, ',') : 'none', inline: true},
            {name: 'Level', value: user.level ? Number(user.level).toFixed(1).toString().replace(commaRegex, ',') : 'none', inline: true},
            {name: 'Rank', value: user.pp_rank ? user.pp_rank.replace(commaRegex, ',') : 'none', inline: true},
            {name: 'Accuracy', value: user.accuracy ? Number(user.accuracy).toFixed(2).toString('utf8') : 'none', inline: true},
            {name: 'SS Count', value: user.count_rank_ss ? user.count_rank_ss.replace(commaRegex, ',') : 'none', inline: true},
            {name: 'S Count', value: user.count_rank_s ? user.count_rank_s.replace(commaRegex, ',') : 'none', inline: true},
            {name: 'A Count', value: user.count_rank_a ? user.count_rank_a.replace(commaRegex, ',') : 'none', inline: true}
        ]
    }};
}

exports.commands = [
    'osu',
    'mania',
    'taiko',
    'ctb'
];

exports.osu = {
    desc: "Retrive stats for osu!'s standard mode for a user.",
    fullDesc: "Uses the osu! API to get information for osu!'s standard mode for a user.",
    usage: '<osu! username/id>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Please give me a name to search with.').then(() => {
                    reject([new Error('No arguments were given.')]);
                }).catch(err => reject([err]));
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix}, res => {
                    var user = res[0];
                    if (user == undefined || user.user_id == undefined) {
                        ctx.msg.channel.createMessage('A user with that name or ID could not be found.').then(() => {
                            reject([new Error('User was not found.')]);
                        }).catch(err => reject([err]));
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user)).then(() => {
                            resolve();
                        }).catch(err => reject([err]));
                    }
                });
            }
        });
    }
};

exports.ctb = {
    desc: "Retrive stats for osu!'s Catch The Beat mode for a user.",
    fullDesc: "Uses the osu! API to get information for osu!'s Catch The Beat mode for a user.",
    usage: '<osu! username/id>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Please give me a name to search with.').then(() => {
                    reject([new Error('No arguments were given.')]);
                }).catch(err => reject([err]));
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 2}, res => {
                    var user = res[0];
                    if (user == undefined || user.user_id == undefined) {
                        ctx.msg.channel.createMessage('A user with that name or ID could not be found.').then(() => {
                            reject([new Error('User was not found.')]);
                        }).catch(err => reject([err]));
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user)).then(() => {
                            resolve();
                        }).catch(err => reject([err]));
                    }
                });
            }
        });
    }
};

exports.mania = {
    desc: "Retrive stats for osu!'s osu!mania mode for a user.",
    fullDesc: "Uses the osu! API to get information for osu!'s osu!mania mode for a user.",
    usage: '<osu! username/id>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Please give me a name to search with.').then(() => {
                    reject([new Error('No arguments were given.')]);
                }).catch(err => reject([err]));
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 3}, res => {
                    var user = res[0];
                    if (user == undefined || user.user_id == undefined) {
                        ctx.msg.channel.createMessage('A user with that name or ID could not be found.').then(() => {
                            reject([new Error('User was not found.')]);
                        }).catch(err => reject([err]));
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user)).then(() => {
                            resolve();
                        }).catch(err => reject([err]));
                    }
                });
            }
        });
    }
};

exports.taiko = {
    desc: "Retrive stats for osu!'s Taiko mode for a user.",
    fullDesc: "Uses the osu! API to get information for osu!'s Taiko mode for a user.",
    usage: '<osu! username/id>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Please give me a name to search with.').then(() => {
                    reject([new Error('No arguments were given.')]);
                }).catch(err => reject([err]));
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 1}, res => {
                    var user = res[0];
                    if (user == undefined || user.user_id == undefined) {
                        ctx.msg.channel.createMessage('A user with that name or ID could not be found.').then(() => {
                            reject([new Error('User was not found.')]);
                        }).catch(err => reject([err]));
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user)).then(() => {
                            resolve();
                        }).catch(err => reject([err]));
                    }
                });
            }
        });
    }
};
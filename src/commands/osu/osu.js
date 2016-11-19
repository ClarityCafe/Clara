/*
 * osu.js - osu! stats command.
 * 
 * Contributed by Capuccino and Ovyerus.
 */

const config = require(`${_baseDir}/config.json`);
const osu = require('osu')(config.osuApiKey);
const iso3166 = require('iso-3166-1-alpha-2');
const request = require('request');

var commaRegex = /\B(?=(\d{3})+(?!\d))/g; // Thank you Brayzure uwu

exports.commands = [
    "osu",
    "mania",
    "taiko",
    "ctb"
];

//TODO: Embeds

exports.osu = {
    desc: "Retrive stats for osu!'s standard mode for a user.",
    fullDesc: "Uses the osu! API to get information for osu!'s standard mode for a user.",
    usage: '<osu! username/id>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                ctx.msg.channel.sendMessage('Please give me a name to search with.').then(() => {
                    reject([new Error('No arguments were given.')]);
                }).catch(err => reject([err]));
            } else {
                osu.get_user({u: ctx.args[0]}, res => {
                    var user = res[0];
                    if (user.user_id == undefined) {
                        ctx.msg.channel.sendMessage(`there was no user matching "${ctx.args}".`).then(() => {
                            reject([new Error('User was not found.')]);
                        }).catch(err => reject([err]));
                    } else {
                        var osuser = `**Showing osu! results for ${user.username}**\n`;
                        osuser += '```prolog\n';
                        osuser += `             ID: ${user.user_id}\n`;
                        osuser += `        Country: '${iso3166.getCountry(user.country)}'\n`;
                        osuser += `   Country Rank: ${user.pp_country_rank.replace(commaRegex, ',')}\n`;
                        osuser += `Beatmaps Played: ${user.playcount ? user.playcount.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    300s Scored: ${user.count300 ? user.count300.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    100s Scored: ${user.count100 ? user.count100.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `     50s Scored: ${user.count50 ? user.count50.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `   Ranked Score: ${user.ranked_score ? user.ranked_score.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    Total Score: ${user.total_score ? user.total_score.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `             PP: ${user.pp_raw ? user.pp_raw.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `          Level: ${user.level ? Number(user.level).toFixed(1).toString().replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `           Rank: ${user.pp_rank ? user.pp_rank.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `       Accuracy: ${user.accuracy ? Number(user.accuracy).toFixed(2) : 'none'}\n`;
                        osuser += `       SS Count: ${user.count_rank_ss ? user.count_rank_ss.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `        S Count: ${user.count_rank_s ? user.count_rank_s.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `        A Count: ${user.count_rank_a ? user.count_rank_a.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += '```';
                        osuser += `http://a.ppy.sh/${user.user_id}`;
                        ctx.msg.channel.sendMessage(osuser).then(() => {
                            resolve();
                        }).catch(err => reject([err]));
                    }
                });
            }
        });
    }
}

exports.ctb = {
    desc: "Retrive stats for osu!'s Catch The Beat mode for a user.",
    fullDesc: "Uses the osu! API to get information for osu!'s Catch The Beat mode for a user.",
    usage: '<osu! username/id>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                ctx.msg.channel.sendMessage('Please give me a name to search with.').then(() => {
                    reject([new Error('No arguments were given.')]);
                }).catch(err => reject([err]));
            } else {
                osu.get_user({u: ctx.args[0], m: 2}, res => {
                    var user = res[0];
                    if (user.user_id == undefined) {
                        ctx.msg.channel.sendMessage(`there was no user matching "${ctx.args}".`).then(() => {
                            reject([new Error('User was not found.')]);
                        }).catch(err => reject([err]));
                    } else {
                        var osuser = `**Showing osu! CtB results for ${user.username}**\n`;
                        osuser += '```prolog\n';
                        osuser += `             ID: ${user.user_id}\n`;
                        osuser += `        Country: '${iso3166.getCountry(user.country)}'\n`;
                        osuser += `   Country Rank: ${user.pp_country_rank.replace(commaRegex, ',')}\n`;
                        osuser += `Beatmaps Played: ${user.playcount ? user.playcount.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    300s Scored: ${user.count300 ? user.count300.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    100s Scored: ${user.count100 ? user.count100.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `     50s Scored: ${user.count50 ? user.count50.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `   Ranked Score: ${user.ranked_score ? user.ranked_score.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    Total Score: ${user.total_score ? user.total_score.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `             PP: ${user.pp_raw ? user.pp_raw.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `          Level: ${user.level ? Number(user.level).toFixed(1).toString().replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `           Rank: ${user.pp_rank ? user.pp_rank.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `       Accuracy: ${user.accuracy ? Number(user.accuracy).toFixed(2) : 'none'}\n`;
                        osuser += `       SS Count: ${user.count_rank_ss ? user.count_rank_ss.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `        S Count: ${user.count_rank_s ? user.count_rank_s.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `        A Count: ${user.count_rank_a ? user.count_rank_a.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += '```';
                        ctx.msg.channel.sendMessage(osuser).then(() => {
                            resolve();
                        }).catch(err => reject([err]));
                    }
                });
            }
        });
    }
}

exports.mania = {
    desc: "Retrive stats for osu!'s osu!mania mode for a user.",
    fullDesc: "Uses the osu! API to get information for osu!'s osu!mania mode for a user.",
    usage: '<osu! username/id>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                ctx.msg.channel.sendMessage('Please give me a name to search with.').then(() => {
                    reject([new Error('No arguments were given.')]);
                }).catch(err => reject([err]));
            } else {
                osu.get_user({u: ctx.args[0], m: 2}, res => {
                    var user = res[0];
                    if (user.user_id == undefined) {
                        ctx.msg.channel.sendMessage(`there was no user matching "${ctx.args}".`).then(() => {
                            reject([new Error('User was not found.')]);
                        }).catch(err => reject([err]));
                    } else {
                        var osuser = `**Showing osu!mainia results for ${user.username}**\n`;
                        osuser += '```prolog\n';
                        osuser += `             ID: ${user.user_id}\n`;
                        osuser += `        Country: '${iso3166.getCountry(user.country)}'\n`;
                        osuser += `   Country Rank: ${user.pp_country_rank.replace(commaRegex, ',')}\n`;
                        osuser += `Beatmaps Played: ${user.playcount ? user.playcount.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    300s Scored: ${user.count300 ? user.count300.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    100s Scored: ${user.count100 ? user.count100.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `     50s Scored: ${user.count50 ? user.count50.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `   Ranked Score: ${user.ranked_score ? user.ranked_score.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    Total Score: ${user.total_score ? user.total_score.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `             PP: ${user.pp_raw ? user.pp_raw.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `          Level: ${user.level ? Number(user.level).toFixed(1).toString().replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `           Rank: ${user.pp_rank ? user.pp_rank.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `       Accuracy: ${user.accuracy ? Number(user.accuracy).toFixed(2) : 'none'}\n`;
                        osuser += `       SS Count: ${user.count_rank_ss ? user.count_rank_ss.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `        S Count: ${user.count_rank_s ? user.count_rank_s.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `        A Count: ${user.count_rank_a ? user.count_rank_a.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += '```';
                        ctx.msg.channel.sendMessage(osuser).then(() => {
                            resolve();
                        }).catch(err => reject([err]));
                    }
                });
            }
        });
    }
}

exports.taiko = {
    desc: "Retrive stats for osu!'s Taiko mode for a user.",
    fullDesc: "Uses the osu! API to get information for osu!'s Taiko mode for a user.",
    usage: '<osu! username/id>',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                ctx.msg.channel.sendMessage('Please give me a name to search with.').then(() => {
                    reject([new Error('No arguments were given.')]);
                }).catch(err => reject([err]));
            } else {
                osu.get_user({u: ctx.args[0], m: 1}, res => {
                    var user = res[0];
                    if (user.user_id == undefined) {
                        ctx.msg.channel.sendMessage(`there was no user matching "${ctx.args}".`).then(() => {
                            reject([new Error('User was not found.')]);
                        }).catch(err => reject([err]));
                    } else {
                        var osuser = `**Showing osu! Taiko results for ${user.username}**\n`;
                        osuser += '```prolog\n';
                        osuser += `             ID: ${user.user_id}\n`;
                        osuser += `        Country: '${iso3166.getCountry(user.country)}'\n`;
                        osuser += `   Country Rank: ${user.pp_country_rank.replace(commaRegex, ',')}\n`;
                        osuser += `Beatmaps Played: ${user.playcount ? user.playcount.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    300s Scored: ${user.count300 ? user.count300.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    100s Scored: ${user.count100 ? user.count100.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `     50s Scored: ${user.count50 ? user.count50.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `   Ranked Score: ${user.ranked_score ? user.ranked_score.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `    Total Score: ${user.total_score ? user.total_score.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `             PP: ${user.pp_raw ? user.pp_raw.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `          Level: ${user.level ? Number(user.level).toFixed(1).toString().replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `           Rank: ${user.pp_rank ? user.pp_rank.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `       Accuracy: ${user.accuracy ? Number(user.accuracy).toFixed(2) : 'none'}\n`;
                        osuser += `       SS Count: ${user.count_rank_ss ? user.count_rank_ss.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `        S Count: ${user.count_rank_s ? user.count_rank_s.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += `        A Count: ${user.count_rank_a ? user.count_rank_a.replace(commaRegex, ',') : 'none'}\n`;
                        osuser += '```';
                        ctx.msg.channel.sendMessage(osuser).then(() => {
                            resolve();
                        }).catch(err => reject([err]));
                    }
                });
            }
        });
    }
}
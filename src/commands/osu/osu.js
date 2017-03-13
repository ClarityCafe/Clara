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
            {name: localeManager.t('id', 'en-UK'), value: user.user_id, inline: true},
            {name: localeManager.t('osu-country', 'en-UK'), value: `${iso3166.getCountry(user.country)} :flag_${user.country.toLowerCase()}:`, inline: true},
            {name: localeManager.t('osu-countryRank', 'en-UK'), value: user.pp_country_rank.replace(commaRegex, ','), inline: true},
            {name: localeManager.t('osu-playCount', 'en-UK'), value: user.playcount ? user.playcount.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-300s', 'en-UK'), value: user.count300 ? user.count300.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-100s', 'en-UK'), value: user.count100 ? user.count100.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-50s', 'en-UK'), value: user.count50 ? user.count50.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-rankedScore', 'en-UK'), value: user.ranked_score ? user.ranked_score.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-totalScore', 'en-UK'), value: user.total_score ? user.total_score.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-pp', 'en-UK'), value: user.pp_raw ? user.pp_raw.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-level', 'en-UK'), value: user.level ? Number(user.level).toFixed(1).toString().replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-rank', 'en-UK'), value: user.pp_rank ? user.pp_rank.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-accuracy', 'en-UK'), value: user.accuracy ? Number(user.accuracy).toFixed(2).toString('utf8') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-ss', 'en-UK'), value: user.count_rank_ss ? user.count_rank_ss.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-s', 'en-UK'), value: user.count_rank_s ? user.count_rank_s.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true},
            {name: localeManager.t('osu-a', 'en-UK'), value: user.count_rank_a ? user.count_rank_a.replace(commaRegex, ',') : localeManager.t('osu-none', 'en-UK'), inline: true}
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
                ctx.msg.channel.createMessage(localeManager.t('osu-noName', 'en-UK')).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix}, res => {
                    var user = res[0];
                    if (!user || !user.user_id) {
                        ctx.msg.channel.createMessage(localeManager.t('osu-noRes', 'en-UK')).then(resolve).catch(reject);
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user)).then(resolve).catch(reject);
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
                ctx.msg.channel.createMessage(localeManager.t('osu-noName', 'en-UK')).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 2}, res => {
                    var user = res[0];
                    if (!user || !user.user_id) {
                        ctx.msg.channel.createMessage(localeManager.t('osu-noRes', 'en-UK')).then(resolve).catch(reject);
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user)).then(resolve).catch(reject);
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
                ctx.msg.channel.createMessage(localeManager.t('osu-noName', 'en-UK')).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 3}, res => {
                    var user = res[0];
                    if (!user || !user.user_id) {
                        ctx.msg.channel.createMessage(localeManager.t('osu-noRes', 'en-UK')).then(resolve).catch(reject);
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user)).then(resolve).catch(reject);
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
                ctx.msg.channel.createMessage(localeManager.t('osu-noName', 'en-UK')).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 1}, res => {
                    var user = res[0];
                    if (!user || !user.user_id) {
                        ctx.msg.channel.createMessage(localeManager.t('osu-noRes', 'en-UK')).then(resolve).catch(reject);
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user)).then(resolve).catch(reject);
                    }
                });
            }
        });
    }
};
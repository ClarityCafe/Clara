/*
 * osu.js - osu! stats command.
 * 
 * Contributed by Capuccino and Ovyerus.
 */

const config = require(`${__baseDir}/config.json`);
const osu = require('osu')(config.osuApiKey);
const iso3166 = require('iso-3166-1-alpha-2');

const commaRegex = /\B(?=(\d{3})+(?!\d))/g; // Thank you Brayzure uwu

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
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage(localeManager.t('osu-noName', settings.locale)).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix}, res => {
                    var user = res[0];
                    if (!user || !user.user_id) {
                        ctx.msg.channel.createMessage(localeManager.t('osu-noRes', settings.locale)).then(resolve).catch(reject);
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user, ctx.settings)).then(resolve).catch(reject);
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
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage(localeManager.t('osu-noName', settings.locale)).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 2}, res => {
                    var user = res[0];
                    if (!user || !user.user_id) {
                        ctx.msg.channel.createMessage(localeManager.t('osu-noRes', settings.locale)).then(resolve).catch(reject);
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user, ctx.settings)).then(resolve).catch(reject);
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
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage(localeManager.t('osu-noName', settings.locale)).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 3}, res => {
                    var user = res[0];
                    if (!user || !user.user_id) {
                        ctx.msg.channel.createMessage(localeManager.t('osu-noRes', settings.locale)).then(resolve).catch(reject);
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user, ctx.settings)).then(resolve).catch(reject);
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
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage(localeManager.t('osu-noName', settings.locale)).then(resolve).catch(reject);
            } else {
                ctx.msg.channel.sendTyping();
                osu.get_user({u: ctx.suffix, m: 1}, res => {
                    var user = res[0];
                    if (!user || !user.user_id) {
                        ctx.msg.channel.createMessage(localeManager.t('osu-noRes', settings.locale)).then(resolve).catch(reject);
                    } else {
                        ctx.msg.channel.createMessage(osuBlock(user, ctx.settings)).then(resolve).catch(reject);
                    }
                });
            }
        });
    }
};

function osuBlock(user, settings) {
    return {embed: {
        title: `osu! stats for **${user.username}**`,
        url: `https://osu.ppy.sh/u/${user.user_id}`,
        thumbnail: {url: `http://a.ppy.sh/${user.user_id}`},
        color: 0xFD7BB5,
        fields: [
            {name: localeManager.t('id', settings.locale), value: user.user_id, inline: true},
            {name: localeManager.t('osu-country', settings.locale), value: `${iso3166.getCountry(user.country)} :flag_${user.country.toLowerCase()}:`, inline: true},
            {name: localeManager.t('osu-countryRank', settings.locale), value: user.pp_country_rank.replace(commaRegex, ','), inline: true},
            {name: localeManager.t('osu-playCount', settings.locale), value: user.playcount ? user.playcount.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-300s', settings.locale), value: user.count300 ? user.count300.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-100s', settings.locale), value: user.count100 ? user.count100.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-50s', settings.locale), value: user.count50 ? user.count50.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-rankedScore', settings.locale), value: user.ranked_score ? user.ranked_score.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-totalScore', settings.locale), value: user.total_score ? user.total_score.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-pp', settings.locale), value: user.pp_raw ? user.pp_raw.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-level', settings.locale), value: user.level ? Number(user.level).toFixed(1).toString().replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-rank', settings.locale), value: user.pp_rank ? user.pp_rank.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-accuracy', settings.locale), value: user.accuracy ? Number(user.accuracy).toFixed(2).toString('utf8') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-ss', settings.locale), value: user.count_rank_ss ? user.count_rank_ss.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-s', settings.locale), value: user.count_rank_s ? user.count_rank_s.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-a', settings.locale), value: user.count_rank_a ? user.count_rank_a.replace(commaRegex, ',') : localeManager.t('none', settings.locale), inline: true}
        ]
    }};
}
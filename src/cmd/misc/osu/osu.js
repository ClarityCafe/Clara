/**
 * @file osu! stats command.
 * @author Capuccino
 * @author Ovyerus
 */

/* eslint-env node */

const Osu = require('osu');
const iso3166 = require('iso-3166-1-alpha-2');
const Ratelimiter = require(`${__baseDir}/modules/Ratelimiter`);

const CommaRegex = /\B(?=(\d{3})+(?!\d))/g; // Thank you Brayzure uwu
const B1nzy = new Ratelimiter(240, 60000); // 240 uses per minute

let osu;

exports.loadAsSubcommands = true;

exports.commands = [
    'ctb',
    'mania',
    'taiko'
];

exports.init = bot => {
    osu = Osu(bot.config.osuApiKey);
};

exports.main = {
    desc: "Retrive stats for osu!'s standard mode for a user.",
    usage: '<osu! username/id>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.createMessage(localeManager.t('osu-noName', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                ctx.channel.sendTyping();

                if (B1nzy.uses === B1nzy.totalUses) {
                    ctx.createMessage('osu-ratelimited').then(resolve).catch(reject);
                } else {
                    osu.get_user({u: ctx.suffix}, res => {
                        let user = res[0];

                        if (!user || !user.user_id) {
                            ctx.createMessage(localeManager.t('osu-noRes', ctx.settings.locale)).then(resolve).catch(reject);
                        } else {
                            ctx.createMessage(osuBlock(user, ctx.settings)).then(() => {
                                B1nzy.use();
                            }).then(resolve).catch(reject);
                        }
                    });
                }
            }
        });
    }
};

exports.taiko = {
    desc: "Retrive stats for osu!'s Taiko mode for a user.",
    usage: '<osu! username/id>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.createMessage(localeManager.t('osu-noName', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                ctx.channel.sendTyping();

                if (B1nzy.uses === B1nzy.totalUses) {
                    ctx.createMessage('osu-ratelimited').then(resolve).catch(reject);
                } else {                
                    osu.get_user({u: ctx.suffix, m: 3}, res => {
                        let user = res[0];

                        if (!user || !user.user_id) {
                            ctx.createMessage(localeManager.t('osu-noRes', ctx.settings.locale)).then(resolve).catch(reject);
                        } else {
                            ctx.createMessage(osuBlock(user, ctx.settings)).then(() => {
                                B1nzy.use();
                            }).then(resolve).catch(reject);
                        }
                    });
                }
            }
        });
    }
};

exports.ctb = {
    desc: "Retrive stats for osu!'s Catch The Beat mode for a user.",
    usage: '<osu! username/id>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.createMessage(localeManager.t('osu-noName', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                ctx.channel.sendTyping();

                if (B1nzy.uses === B1nzy.totalUses) {
                    ctx.createMessage('osu-ratelimited').then(resolve).catch(reject);
                } else {                
                    osu.get_user({u: ctx.suffix, m: 2}, res => {
                        let user = res[0];

                        if (!user || !user.user_id) {
                            ctx.createMessage(localeManager.t('osu-noRes', ctx.settings.locale)).then(resolve).catch(reject);
                        } else {
                            ctx.createMessage(osuBlock(user, ctx.settings)).then(() => {
                                B1nzy.use();
                            }).then(resolve).catch(reject);
                        }
                    });
                }
            }
        });
    }
};

exports.mania = {
    desc: "Retrive stats for osu!'s osu!mania mode for a user.",
    usage: '<osu! username/id>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.createMessage(localeManager.t('osu-noName', ctx.settings.locale)).then(resolve).catch(reject);
            } else {
                ctx.channel.sendTyping();

                if (B1nzy.uses === B1nzy.totalUses) {
                    ctx.createMessage('osu-ratelimited').then(resolve).catch(reject);
                } else {                
                    osu.get_user({u: ctx.suffix, m: 3}, res => {
                        let user = res[0];

                        if (!user || !user.user_id) {
                            ctx.createMessage(localeManager.t('osu-noRes', ctx.settings.locale)).then(resolve).catch(reject);
                        } else {
                            ctx.createMessage(osuBlock(user, ctx.settings)).then(() => {
                                B1nzy.use();
                            }).then(resolve).catch(reject);
                        }
                    });
                }
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
            {name: localeManager.t('osu-countryRank', settings.locale), value: user.pp_country_rank.replace(CommaRegex, ','), inline: true},
            {name: localeManager.t('osu-playCount', settings.locale), value: user.playcount ? user.playcount.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-300s', settings.locale), value: user.count300 ? user.count300.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-100s', settings.locale), value: user.count100 ? user.count100.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-50s', settings.locale), value: user.count50 ? user.count50.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-rankedScore', settings.locale), value: user.ranked_score ? user.ranked_score.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-totalScore', settings.locale), value: user.total_score ? user.total_score.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-pp', settings.locale), value: user.pp_raw ? user.pp_raw.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-level', settings.locale), value: user.level ? Number(user.level).toFixed(1).toString().replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-rank', settings.locale), value: user.pp_rank ? user.pp_rank.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-accuracy', settings.locale), value: user.accuracy ? Number(user.accuracy).toFixed(2).toString('utf8') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-ss', settings.locale), value: user.count_rank_ss ? user.count_rank_ss.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-s', settings.locale), value: user.count_rank_s ? user.count_rank_s.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true},
            {name: localeManager.t('osu-a', settings.locale), value: user.count_rank_a ? user.count_rank_a.replace(CommaRegex, ',') : localeManager.t('none', settings.locale), inline: true}
        ]
    }};
}
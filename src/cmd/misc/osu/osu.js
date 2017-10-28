/**
 * @file osu! stats command.
 * @author Capuccino
 * @author Ovyerus
 */

const Osu = require('osu');
const iso3166 = require('iso-3166-1-alpha-2');
const Ratelimiter = require(`${mainDir}/lib/modules/Ratelimiter`);

const CommaRegex = /\B(?=(\d{3})+(?!\d))/g; // Thank you Brayzure uwu
const LIMITER = new Ratelimiter(240, 60000); // 240 uses per minute

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
    async main(bot, ctx) {
        if (ctx.suffix.length === 0) return await ctx.createMessage('osu-noName');
        if (LIMITER.ratelimited) return await ctx.createMessage('osu-ratelimited');

        await ctx.channel.sendTyping();

        let user = await osu.get_user({u: ctx.suffix});
        user = user[0];

        if (!user || !user.user_id) return await ctx.createMessage('osu-noRes');

        await ctx.createMessage(osuBlock(bot, user));
        LIMITER.use();
    }
};

exports.taiko = {
    desc: "Retrive stats for osu!'s Taiko mode for a user.",
    usage: '<osu! username/id>',
    async main(bot, ctx) {
        if (ctx.suffix.length === 0) return await ctx.createMessage('osu-noName');
        if (LIMITER.ratelimited) return await ctx.createMessage('osu-ratelimited');

        await ctx.channel.sendTyping();

        let user = await osu.get_user({u: ctx.suffix, m: 1});
        user = user[0];

        if (!user || !user.user_id) return await ctx.createMessage('osu-noRes');

        await ctx.createMessage(osuBlock(bot, user));
        LIMITER.use();
    }
};

exports.ctb = {
    desc: "Retrive stats for osu!'s Catch The Beat mode for a user.",
    usage: '<osu! username/id>',
    async main(bot, ctx) {
        if (ctx.suffix.length === 0) return await ctx.createMessage('osu-noName');
        if (LIMITER.ratelimited) return await ctx.createMessage('osu-ratelimited');

        await ctx.channel.sendTyping();

        let user = await osu.get_user({u: ctx.suffix, m: 2});
        user = user[0];

        if (!user || !user.user_id) return await ctx.createMessage('osu-noRes');

        await ctx.createMessage(osuBlock(bot, user));
        LIMITER.use();
    }
};

exports.mania = {
    desc: "Retrive stats for osu!'s osu!mania mode for a user.",
    usage: '<osu! username/id>',
    async main(bot, ctx) {
        if (ctx.suffix.length === 0) return await ctx.createMessage('osu-noName');
        if (LIMITER.ratelimited) return await ctx.createMessage('osu-ratelimited');

        await ctx.channel.sendTyping();

        let user = await osu.get_user({u: ctx.suffix, m: 3});
        user = user[0];

        if (!user || !user.user_id) return await ctx.createMessage('osu-noRes');

        await ctx.createMessage(osuBlock(bot, user));
        LIMITER.use();
    }
};

function osuBlock(bot, user) {
    return {embed: {
        title: `osu! stats for **${user.username}**`,
        url: `https://osu.ppy.sh/u/${user.user_id}`,
        thumbnail: {url: `http://a.ppy.sh/${user.user_id}`},
        color: 0xFD7BB5,
        fields: [
            {
                name: 'id',
                value: user.user_id,
                inline: true
            },
            {
                name: 'osu-country',
                value: `${iso3166.getCountry(user.country)} :flag_${user.country.toLowerCase()}:`,
                inline: true
            },
            {
                name: 'osu-countryRank',
                value: user.pp_country_rank.replace(CommaRegex, ','),
                inline: true
            },
            {
                name: 'osu-playCount',
                value: user.playcount ? user.playcount.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-300s',
                value: user.count300 ? user.count300.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-100s',
                value: user.count100 ? user.count100.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-50s',
                value: user.count50 ? user.count50.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-rankedScore',
                value: user.ranked_score ? user.ranked_score.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-totalScore',
                value: user.total_score ? user.total_score.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-pp',
                value: user.pp_raw ? user.pp_raw.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-level',
                value: user.level ? Number(user.level).toFixed(1).toString().replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-rank',
                value: user.pp_rank ? user.pp_rank.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-accuracy',
                value: user.accuracy ? Number(user.accuracy).toFixed(2).toString('utf8') : 'none',
                inline: true
            },
            {
                name: 'osu-ss',
                value: user.count_rank_ss ? user.count_rank_ss.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-s',
                value: user.count_rank_s ? user.count_rank_s.replace(CommaRegex, ',') : 'none',
                inline: true
            },
            {
                name: 'osu-a',
                value: user.count_rank_a ? user.count_rank_a.replace(CommaRegex, ',') : 'none',
                inline: true
            }
        ]
    }};
}
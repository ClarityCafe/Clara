/**
 * @file Search anime pictures from ibsear.ch. No NSFW.
 * @author Ovyerus
 */

const got = require('got');
const moment = require('moment');

const DEFAULT_QUERY = 'catgirl'; // Default: 'catgirl'
const QUERY_LIMIT = 75; // Default: 75

exports.commands = [
    'ibsearch'
];

exports.ibsearch = {
    desc: 'Search ibsear.ch for anime pics.', 
    usage: '[tags]',
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let query;

        if (ctx.suffix) query = `?q=${encodeURIComponent(ctx.suffix.toLowerCase()).replace('%20', '+')}&`;
        else query = `?q=${DEFAULT_QUERY ? `${encodeURIComponent(DEFAULT_QUERY.toLowerCase()).replace('%20', '+')}&` : ''}`;

        query += `limit=${QUERY_LIMIT}`;
        let res = await got(`https://ibsear.ch/api/v1/images.json${query}`, {
            headers: {
                'X-IbSearch-Key': bot.config.ibKey,
                'User-Agent': 'Clara/0.4.0'
            }
        });
        res = JSON.parse(res.body);

        if (!res.length) return await ctx.createMessage('notFound');

        let item = res[Math.floor(Math.random() * res.length)];
        let url = `https://${item.server}.ibsear.ch/resize/${item.path}?width=500&height=500`;

        return await ctx.createMessage({embed: {
            title: 'ib-source',
            url: `https://ibsear.ch/images/${item.id}`,
            image: {url},
            footer: {text: 'ib-indexTime'},
            fields: [
                {
                    name: 'ib-info',
                    value: `${item.width}x${item.width} - ${utils.genBytes(Number(item.size))}`
                }, {
                    name: 'ib-tags',
                    value: item.tags.replace(/_/g, '\_').slice(0, 1500) // eslint-disable-line
                }
            ]
        }}, null, 'channel', {
            date: moment.unix(item.found).format('dddd Do MMMM Y'),
            time: moment.unix(item.found).format('HH:mm:ss A')
        });
    }
};
/*
 * info.js - Various information of the bot.
 *
 * Contributed by Ovyerus
 */

/* eslint-env node */

const got = require('got');
const prettyBytes = require('pretty-bytes');
const moment = require('moment');


const defaultQuery = 'catgirl'; // Default: 'catgirl'
const queryLimit = 75; // Default: 75

exports.commands = [
    'ibsearch'
];

exports.ibsearch = {
    desc: 'Search ibsear.ch for anime pics.',
    fullDesc: 'Searches ibsear.ch for the specified tags. If no arguments, returns random picture. SFW only.',
    usage: '[tags]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                let info = {};
                ctx.channel.sendTyping();
                
                got(`https://ibsear.ch/api/v1/images.json?${defaultQuery ? `q=${encodeURIComponent(defaultQuery.toLowerCase()).replace('&20', '+')}&` : ''}limit=${queryLimit}`, {
                    headers: {
                        'X-IbSearch-Key': bot.config.ibKey,
                        'User-Agent': 'Clara/0.3.0'
                    }
                }).then(res => {
                    let results = JSON.parse(res.body);
                    if (results.length === 0) return ctx.createMessage('No results found.');
                    
                    let item = info.item = results[Math.floor(Math.random() * results.length)];
                    info.url = `https://${item.server}.ibsear.ch/resize/${item.path}?width=500&height=500`;
                    
                    return null;
                }).then(() => {
                    let {item, url} = info;
                    return ctx.createMessage({embed: {
                        title: 'Image Source',
                        url: `https://ibsear.ch/images/${item.id}`,
                        image: {url},
                        color: utils.randomColour(),
                        footer: {text: `Time First Indexed by IbSearch: ${moment.unix(item.found).format('dddd Do MMMM Y')} at ${moment.unix(item.found).format('HH:mm:ss A')}`},
                        fields: [
                            {name: 'Image Information', value: `${item.width}x${item.width} - ${prettyBytes(Number(item.size))}`},
                            {name: 'Tags', value: item.tags.replace(/_/g, '\_')}
                        ]
                    }});
                }).then(resolve).catch(reject);
            } else {
                let query = encodeURIComponent(ctx.suffix.toLowerCase()).replace('%20', '+');
                let info = {};
                ctx.channel.sendTyping();
                
                got(`https://ibsear.ch/api/v1/images.json?${query}limit=${queryLimit}`, {
                    headers: {
                        'X-IbSearch-Key': bot.config.ibKey,
                        'User-Agent': 'Clara/0.3.0'
                    }
                }).then(res => {
                    let results = JSON.parse(res.body);
                    if (results.length === 0) return ctx.createMessage('No results found.');
                    
                    let item = info.item = results[Math.floor(Math.random() * results.length)];
                    info.url = `https://${item.server}.ibsear.ch/resize/${item.path}?width=500&height=500`;

                    return null;
                }).then(() => {
                    let {item, url} = info;
                    return ctx.createMessage({embed: {
                        title: 'Image Source',
                        url: `https://ibsear.ch/images/${item.id}`,
                        image: {url},
                        color: utils.randomColour(),
                        footer: {text: `Time First Indexed by IbSearch: ${moment.unix(item.found).format('dddd Do MMMM Y')} at ${moment.unix(item.found).format('HH:mm:ss A')}`},
                        fields: [
                            {name: 'Image Information', value: `${item.width}x${item.width} - ${prettyBytes(Number(item.size))}`},
                            {name: 'Tags', value: item.tags.replace(/_/g, '\_')}
                        ]
                    }});
                }).then(resolve).catch(reject);
            }
        });
    }
};
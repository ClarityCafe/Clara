/*
 * info.js - Various information of the bot.
 *
 * Contributed by Ovyerus
 */


const request = require('request');
const color = require('dominant-color');
const prettyBytes = require('pretty-bytes');
const moment = require('moment');
const fs = require('fs');
const ibKey = require(`${__baseDir}/config.json`).ibKey;

const defaultQuery = 'foxgirl';
const queryLimit = 75; // Default: 75

exports.commands = [
    'ibsearch'
];

exports.ibsearch = {
    desc: 'Search ibsear.ch for anime pics.',
    fullDesc: 'Searches ibsear.ch for the specified tags. If no arguments, returns random picture. SFW only.',
    usage: '[tags]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (!ctx.suffix) {
                ctx.msg.channel.sendTyping();
                request({
                    url: `https://ibsear.ch/api/v1/images.json?${defaultQuery ? `q=${encodeURIComponent(defaultQuery.toLowerCase()).replace('&20', '+')}&` : ''}limit=${queryLimit}`,
                    method: 'GET',
                    headers: {
                        'X-IbSearch-Key': ibKey,
                        'User-Agent': 'Clara/0.1.1'
                    }
                }, (err, res, body) => {
                    if (err) {
                        reject(err);
                    } else if (res.statusCode !== 200) {
                        reject(new Error(`Invalid status code for ibsear.ch: ${res.statusCode}`));
                    } else {
                        var results = JSON.parse(body);
                        if (results.length === 0) {
                            ctx.msg.channel.createMessage('No results found.').then(resolve).catch(reject);
                        } else {
                            var item = results[Math.floor(Math.random() * results.length)];
                            var imgURL = `https://${item.server}.ibsear.ch/resize/${item.path}?width=${Number(item.width) > 1000 ? Math.floor(Number(item.width) / 2) : item.width}&height=${Number(item.width) > 1000 ? Math.floor(Number(item.height) / 2) : item.height}`;
                            var saveName = `${__baseDir}/cache/${item.path.split('/')[item.path.split('/').length - 1]}`;
                            request(imgURL).pipe(fs.createWriteStream(saveName)).on('close', () => {
                                color(saveName, (err, color) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        fs.unlink(saveName, () => {
                                            ctx.msg.channel.createMessage({embed: {
                                                title: 'Image Source',
                                                url: `https://ibsear.ch/images/${item.id}`,
                                                image: {url: imgURL},
                                                color: parseInt(color, 16),
                                                fields: [
                                                    {name: 'Image Information', value: `${item.width}x${item.height} ${prettyBytes(Number(item.size))}`},
                                                    {name: 'Tags', value: item.tags.replace(/_/g, '\_')}
                                                ],
                                                footer: {text: `Time First Indexed by IbSearch: ${moment.unix(item.found).format('dddd Do MMMM Y')} at ${moment.unix(item.found).format('HH:mm:ss A')}`}
                                            }}).then(resolve).catch(reject);
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            } else {
                let query = encodeURIComponent(ctx.suffix.toLowerCase()).replace('%20', '+');
                ctx.msg.channel.sendTyping();
                request({
                    url: `https://ibsear.ch/api/v1/images.json?q=${query}&limit=${queryLimit}`,
                    method: 'GET',
                    headers: {
                        'X-IbSearch-Key': ibKey,
                        'User-Agent': 'Clara/0.1.1'
                    }
                }, (err, res, body) => {
                    if (err) {
                        reject(err);
                    } else if (res.statusCode !== 200) {
                        reject(new Error(`Invalid status code for ibsear.ch: ${res.statusCode}`));
                    } else {
                        var results = JSON.parse(body);
                        if (results.length === 0) {
                            ctx.msg.channel.createMessage('No results found.').then(resolve).catch(reject);
                        } else {
                            var item = results[Math.floor(Math.random() * results.length)];
                            var imgURL = `https://${item.server}.ibsear.ch/resize/${item.path}?width=${Number(item.width) > 1000 ? Math.floor(Number(item.width) / 2) : item.width}&height=${Number(item.width) > 1000 ? Math.floor(Number(item.height) / 2) : item.height}`;
                            var saveName = `${__baseDir}/cache/${item.path.split('/')[item.path.split('/').length - 1]}`;
                            request(imgURL).pipe(fs.createWriteStream(saveName)).on('close', () => {
                                color(saveName, (err, color) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        fs.unlink(saveName, () => {
                                            ctx.msg.channel.createMessage({embed: {
                                                title: 'Image Source',
                                                url: `https://ibsear.ch/images/${item.id}`,
                                                image: {url: imgURL},
                                                color: parseInt(color, 16),
                                                fields: [
                                                    {name: 'Image Information', value: `${item.width}x${item.height} ${prettyBytes(Number(item.size))}`},
                                                    {name: 'Tags', value: item.tags.replace(/_/g, '\_')}
                                                ],
                                                footer: {text: `Time First Indexed by IbSearch: ${moment.unix(item.found).format('dddd Do MMMM Y')} at ${moment.unix(item.found).format('HH:mm:ss A')}`}
                                            }}).then(resolve).catch(reject);
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            }
        });
    }
};
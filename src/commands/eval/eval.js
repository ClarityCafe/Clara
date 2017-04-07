/*
 * eval.js - Evaluate JavaScript code in Discord.
 *
 * Contributed by Ovyerus.
 */

/* eslint-disable no-unused-vars */
const Eris = require('eris');
const util = require('util');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const got = require('got');
const PassThrough = require('stream').PassThrough;
const utils = require(`${__baseDir}/modules/utils`);
/* eslint-enable */

const FailCol = 0xF44336;
const SuccessCol = 0x8BC34A;
const ReplaceRegex = {};

exports.init = bot => {
    ReplaceRegex.token = new RegExp(`${bot.token}`, 'gi');
    Object.keys(bot.config).filter(key => /(key|token)/i.test(key)).forEach(key => {
        ReplaceRegex[key] = new RegExp(bot.config[key], 'gi');
    });
};

exports.commands = [
    'eval'
];

exports.eval = {
    desc: 'Evaluate code in Discord.',
    fullDesc: 'Used to evaluate JavaScript code in Discord. Mostly for debug purposes.',
    owner: true,
    usage: '<code>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.createMessage('Please give arguments to evaluate.').then(resolve).catch(reject);
            } else {
                let {args, cmd, suffix, cleansuffix, settings, guildBot, channel, guild} = ctx; // eslint-disable-line
                try {
                    let returned = eval(ctx.suffix);
                    let str = util.inspect(returned, {depth: 1});
                    str = str.replace(ReplaceRegex.token, '(token)');

                    let embed = {
                        title: 'Evaluation Results',
                        color: SuccessCol,
                        fields: [
                            {name: 'Input', value: generateCodeblock(ctx.suffix)},
                            {name: 'Output', value: generateCodeblock(str)}
                        ]
                    };

                    if (returned instanceof Promise) embed.fields[1].value = generateCodeblock('[object Promise]');

                    if (str.length < 1000) {
                        sendEval(bot, ctx, embed, returned).then(resolve).catch(reject);
                    } else {
                        bot.hastePost(str).then(key => {
                            let url = `https://hastebin.com/${key}.js`;
                            embed.fields[1].value = `Output is too long to display nicely.\nOutput has been uploaded [here](${url})`;

                            return sendEval(bot, ctx, embed, returned);
                        }).then(resolve).catch(reject);
                    }
                } catch(err) {
                    logger.error(err.stack || err);
                    let embed = {
                        title: 'Evaluation Results',
                        color: FailCol,
                        fields: [
                            {name: 'Input', value: generateCodeblock(ctx.suffix)},
                            {name: 'Error', value: generateCodeblock(err)}
                        ]
                    };

                    ctx.createMessage({embed}).then(resolve).catch(reject);
                }
            }
        });
    }
};

function generateCodeblock(text) {
    return `\`\`\`js\n${text}\n\`\`\``;
}

function sendEval(bot, ctx, embed, returned) {
    return new Promise((resolve, reject) => {
        let outer;
        ctx.createMessage({embed}).then(m => {
            outer = m;
            if (returned instanceof Promise) {
                return returned;
            } else {
                return null;
            }
        }).then(res => {
            if (!res) {
                resolve();
                return null;
            } else {
                let strN;
                if (res instanceof PassThrough && res.requestUrl) {
                    strN = res.headers['content-type'].split(';')[0] === 'application/json' ? util.inspect(JSON.parse(res.body), {depth: 1}) : res.body;
                } else {
                    strN = util.inspect(res, {depth: 1});
                }
                strN = strN.replace(ReplaceRegex.token, '(token)');

                if (strN.length >= 1000) {
                    return bot.hastePost(strN);
                } else {
                    return outer.edit({embed: {
                        title: 'Evaluation Results',
                        color: SuccessCol,
                        fields: [
                            {name: 'Input', value: generateCodeblock(ctx.suffix)},
                            {name: 'Output', value: generateCodeblock(strN)}
                        ]
                    }});
                }
            }
        }).then(res => {
            if (!res || res instanceof Eris.Message) return null;

            let url = `https://hastebin.com/${res}.js`;

            return outer.edit({embed: {
                title: 'Evaluation Results',
                color: SuccessCol,
                fields: [
                    {name: 'Input', value: generateCodeblock(ctx.suffix)},
                    {name: 'Output', value: `Output is too long to display nicely.\nOutput has been uploaded [here](${url})`}
                ]
            }});
        }).then(resolve).catch(err => {
            if (err.req && err.req._headers.host === 'discordapp.com' && err.resp && err.resp.statusCode !== 404) {
                reject(err);
                return null;
            } else {
                logger.error(err.stack || err);
                return outer.edit({embed: {
                    title: 'Evaluation Results',
                    color: FailCol,
                    fields: [
                        {name: 'Input', value: generateCodeblock(ctx.suffix)},
                        {name: 'Error', value: generateCodeblock(err)}
                    ]
                }});
            }
        }).then(res => {if (res) resolve(res);});
    });
}
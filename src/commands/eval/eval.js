/*
 * eval.js - Evaluate JavaScript code in Discord.
 *
 * Contributed by Ovyerus.
 */

/* eslint-env node*/

/* eslint-disable no-unused-vars */
const Eris = require('eris');
const util = require('util');
const utils = require(`${__baseDir}/modules/utils.js`);
const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const got = require('got');
const PassThrough = require('stream').PassThrough;
/* eslint-enable */

const FAILCOL = 0xF44336;
const SUCCESSCOL = 0x8BC34A;

exports.commands = [
    'eval'
];

exports.eval = {
    desc: 'Evaluate code in Discord.',
    fullDesc: 'Used to evaluate JavaScript code in Discord. Mostly for debug purposes.',
    adminOnly: true,
    usage: '<code>',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Please give arguments to evaluate.').then(resolve).catch(reject);
            } else {
                let {msg, args, cmd, suffix, cleanSuffix, guildBot, settings} = ctx; // eslint-disable-line
                try {
                    let returned = eval(ctx.suffix);
                    let str = util.inspect(returned, {depth: 1});
                    str = str.replace(new RegExp(bot.token, 'gi'), '(token)');

                    let embed = {
                        title: 'Evaluation Results',
                        color: SUCCESSCOL,
                        fields: [
                            {name: 'Input', value: generateCodeblock(ctx.suffix)},
                            {name: 'Output', value: generateCodeblock(str)}
                        ]
                    };

                    if (returned instanceof Promise) embed.fields[1].value = generateCodeblock('[object Promise]');


                    if (str.length < 1000) {
                        sendEval(bot, ctx, embed, returned).then(resolve).catch(reject);
                    } else {
                        got('https://hastebin.com/documents', {
                            method: 'POST',
                            body: str
                        }).then(res => {
                            let key = JSON.parse(res.body).key;
                            let url = `https://hastebin.com/${key}.js`;
                            embed.fields[1].value = `Output is too long to display nicely.\nOutput has been uploaded [here](${url})`;

                            return sendEval(bot, ctx, embed, returned);
                        }).then(resolve).catch(reject);
                    }
                } catch(err) {
                    let embed = {
                        title: 'Evaluation Results',
                        color: FAILCOL,
                        fields: [
                            {name: 'Input', value: generateCodeblock(ctx.suffix)},
                            {name: 'Error', value: generateCodeblock(err)}
                        ]
                    };

                    ctx.msg.channel.createMessage({embed}).then(resolve).catch(reject);
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
        ctx.msg.channel.createMessage({embed}).then(m => {
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
                strN = strN.replace(new RegExp(bot.token, 'gi'), '(token)');

                if (strN.length >= 1000) {
                    return got('https://hastebin.com/documents', {
                        method: 'POST',
                        body: strN
                    });
                } else {
                    return outer.edit({embed: {
                        title: 'Evaluation Results',
                        color: SUCCESSCOL,
                        fields: [
                            {name: 'Input', value: generateCodeblock(ctx.suffix)},
                            {name: 'Output', value: generateCodeblock(strN)}
                        ]
                    }});
                }
            }
        }).then(res => {
            if (!res || res instanceof Eris.Message) return null;

            let key = JSON.parse(res.body).key;
            let url = `https://hastebin.com/${key}.js`;

            return outer.edit({embed: {
                title: 'Evaluation Results',
                color: SUCCESSCOL,
                fields: [
                    {name: 'Input', value: generateCodeblock(ctx.suffix)},
                    {name: 'Output', value: `Output is too long to display nicely.\nOutput has been uploaded [here](${url})`}
                ]
            }});
        }).then(resolve).catch(err => {
            if (err.req && err.req._headers.host === 'discordapp.com') {
                reject(err);
                return null;
            } else {
                return outer.edit({embed: {
                    title: 'Evaluation Results',
                    color: FAILCOL,
                    fields: [
                        {name: 'Input', value: generateCodeblock(ctx.suffix)},
                        {name: 'Error', value: generateCodeblock(err)}
                    ]
                }});
            }
        });
    });
}
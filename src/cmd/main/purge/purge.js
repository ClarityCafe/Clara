/**
 * @file Commands to delete messages via different filters
 * @author Ovyerus
 * (totally not ripped out of knife-bot)
 */

const safe = require('safe-regex');

const INCORRECT_USE = 0xF21904;
const IMAGE_REGEX = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:png|jpe?g|gifv?|webp|bmp|tiff|jfif))(?:\?([^#]*))?(?:#(.*))?/gi;

exports.loadAsSubcommands = true;
exports.commands = [
    'all',
    'author',
    'bots',
    'including',
    'embeds',
    'codeblocks',
    'attachments',
    'images',
    'regex',
    'reactions'
];

exports.main = {
    desc: 'Purge messages in a channel. This only works for messages younger than two weeks.',
    usage: '<type> [amount]',
    aliases: ['prune'],
    permissions: {both: 'manageMessages'},
    async main(bot, ctx) {
        let num = Number(ctx.args[0]);

        if (!isNaN(num) && num <= 100 && num >= 1) await exports.all.main(bot, ctx);
        else {
            await ctx.createMessage({embed: {
                title: 'incorrectUsage',
                description: '**purge [1-100]\n'
                + 'purge all [1-100]\n'
                + 'purge author <author> [1-100]\n'
                + 'purge bots [1-100]\n'
                + 'purge including <word(s)> [1-100]\n'
                + 'purge embeds [1-100]\n'
                + 'purge codeblocks [1-100]\n'
                + 'purge attachments [1-100]\n'
                + 'purge images [1-100]\n'
                + 'purge regex <regex> [1-100]**\n'
                + '**purge reactions [1-250]**',
                color: INCORRECT_USE,
                footer: {text: 'purge-footnote'}
            }});
        }
    }
};

exports.all = {
    desc: 'Purges all types of messages.',
    usage: '[1-100]',
    async main(bot, ctx) {
        let num = Number(ctx.args[0]);

        if (isNaN(num)) {
            await purge(ctx, null, 'purge-messages');
        } else if (num <= 100 && num >= 1) {
            let amt = await ctx.channel.purge(num);
            let m = await ctx.createMessage('purge-messages', null, 'channel', {amt});

            await deleteDelay(m);
        } else await tooSpicy(ctx);
    }
};

exports.author = {
    desc: 'Purges all messages from a specific user.',
    usage: '<user> [1-100]',
    async main(bot, ctx) {
        if (!ctx.args[0]) {
            return await ctx.createMessage({embed: {
                title: 'incorrectUsage',
                description: '**purge author <author ID|author mention> [1-100]**',
                color: INCORRECT_USE
            }});
        }

        let user = await bot.lookups.memberLookup(ctx, ctx.args[0], false);
            
        if (!user) return await ctx.createMessage('userNotfound');

        let num = Number(ctx.args[1]);

        if (isNaN(num)) {
            await purge(ctx, m => m.author.id === user.id, 'purge-messages');
        } else if (num <= 100 && num >= 1) {
            let i = 0;
            await purge(ctx, m => m.author.id === user.id && ++i <= num, 'purge-messages');
        } else await tooSpicy(ctx);
    }
};

exports.bots = {
    desc: 'Purges all messages from bots.',
    usage: '[1-100]',
    async main(bot, ctx) {
        let num = Number(ctx.args[0]);

        if (isNaN(num)) {
            await purge(ctx, m => m.author.bot, 'purge-bots');
        } else if (num <= 100 && num >= 100) {
            let i = 0;
            await purge(ctx, m => m.author.bot && ++i <= num, 'purge-bots');
        } else await tooSpicy(ctx);
    }
};

exports.including = {
    desc: 'Purges all messages including a specific word or phrase.',
    usage: '<content> [1-100]',
    async main(bot, ctx) {
        if (!ctx.args[0]) {
            return await ctx.createMessage({embed: {
                title: 'Incorrect Usage',
                description: '**purge including <word(s)> [1-100]**',
                color: INCORRECT_USE
            }});
        }

        let num = Number(ctx.args[1]);
        let inc = ctx.args[0].toLowerCase();

        if (isNaN(num)) {
            await purge(ctx, m => m.content.toLowerCase().includes(inc), 'purge-messages');
        } else if (num <= 100 && num >= 1) {
            let i = 0;
            await purge(ctx, m => m.content.toLowerCase().includes(inc) && ++i <= num, 'purge-messages');
        } else await tooSpicy(ctx);
    }
};

exports.embeds = {
    desc: 'Purge all messages containing an embed.',
    usage: '[1-100]',
    async main(bot, ctx) {
        let num = Number(ctx.args[0]);

        if (isNaN(num)) {
            await purge(ctx, m => m.embeds.length > 0, 'purge-embeds');
        } else if (num <= 100 && num >= 1) {
            let i = 0;
            await purge(ctx, m => m.embeds.length > 0 && ++i <= num, 'purge-embeds');
        } else await tooSpicy(ctx);
    }
};

exports.codeblocks = {
    desc: 'Purge messages containing a code block.',
    usage: '[1-100]',
    aliases: ['code', 'blocks'],
    async main(bot, ctx) {
        let num = Number(ctx.args[0]);

        if (isNaN(num)) {
            await purge(ctx, codeblockFilter, 'purge-codeblocks');
        } else if (num <= 100 && num >= 1) {
            let i = 0;
            await purge(ctx, m => codeblockFilter(m) && ++i <= num, 'purge-codeblocks');
        } else await tooSpicy(ctx);
    }
};

exports.attachments = {
    desc: 'Purge messages with attachments.',
    usage: '[1-100]',
    async main(bot, ctx) {
        let num = Number(ctx.args[0]);

        if (isNaN(num)) {
            await purge(ctx, m => m.attachments.length > 0, 'purge-attachments');
        } else if (num <= 100 && num >= 1) {
            let i = 0;
            await purge(ctx, m => m.attachments.length > 0 && ++i <= num, 'purge-attachments');
        } else await tooSpicy(ctx);
    }
};

exports.images = {
    desc: 'Purge messages containing an image.',
    usage: '[1-100]',
    async main(bot, ctx) {
        let num = Number(ctx.args[0]);

        if (isNaN(num)) {
            await purge(ctx, imageFilter, 'purge-images');
        } else if (num <= 100 && num >= 1) {
            let i = 0;
            await purge(ctx, m => imageFilter(m) && ++i <= num, 'purge-images');
        } else await tooSpicy(ctx);
    }
};

exports.regex = {
    desc: 'Purge messages that match a regex.',
    usage: '<regex> [1-100]',
    async main(bot, ctx) {
        if (!ctx.args[0]) {
            return await ctx.createMessage({embed: {
                title: 'Incorrect Usage',
                description: '**purge regex <regex> [1-100]**',
                color: INCORRECT_USE
            }});
        }

        let purgeRegex;

        if (safe(ctx.args[0])) purgeRegex = new RegExp(ctx.args[0], 'mi');
        else return await ctx.createMessage('Invalid or unsafe regex.');

        let num = Number(ctx.args[1]);

        if (isNaN(num)) {
            await purge(ctx, m => purgeRegex.test(m.content), 'Purged **amt** message(s).');
        } else if (num <= 100 && num >= 1) {
            let i = 0;
            await purge(ctx, m => purgeRegex.test(m.content) && ++i <= num, 'Purged **amt** message(s).');
        } else await tooSpicy(ctx);
    }
};

exports.reactions = {
    desc: 'Remove all reactions from messages.',
    usage: '[1-250]',
    aliases: ['finebros'],
    async main(bot, ctx) {
        let num = Number(ctx.args[0]);

        if (isNaN(num)) {
            let msgs = await ctx.channel.getMessages(250);
            msgs = msgs.filter(m => Object.keys(m.reactions).length > 0);
            let _msgs = [];

            for (let m of msgs) _msgs.push(m.removeReactions());

            await Promise.all(_msgs);

            let m = await ctx.createMessage('purge-reactions', null, 'channel', {
                amt: msgs.length
            });

            await deleteDelay(m);
        } else if (num <= 250 && num >= 1) {
            let i = 0;
            let msgs = await ctx.channel.getMessages(250);
            msgs = msgs.filter(m => Object.keys(m.reactions).length > 0 && ++i <= num);
            let _msgs = [];

            for (let m of msgs) _msgs.push(m.removeReactions());

            await Promise.all(_msgs);

            let m = await ctx.createMessage('purge-reactions', null, 'channel', {
                amt: i
            });

            await deleteDelay(m);
        } else await ctx.createMessage('purge-notInLimit250');
    }
};

function deleteDelay(msg) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(msg.delete());
        }, 1000);
    });
}

async function tooSpicy(ctx) {
    await ctx.createMessage('purge-notInLimit');
}

async function purge(ctx, filter, msg) {
    let canPurge = await checkAges(ctx, 100);

    if (canPurge) {
        let amt = await ctx.channel.purge(100, filter);
        let m = await ctx.createMessage(msg, null, 'channel', {amt});

        await deleteDelay(m);
    } else {
        await ctx.createMessage('purge-olderThan2Weeks');
    }
}

async function checkAges(ctx, i) {
    let msgs = await ctx.channel.getMessages(i);
    msgs = msgs.filter(m => Date.now() - m.timestamp >= 1000 * 60 * 60 * 24 * 7 * 2); // Filter messages that are younger than two weeks

    return msgs.length === 0;
}

function codeblockFilter(msg) {
    let split = msg.content.split('```');
    if (split.length >= 3) return true;
    return false;
}

function imageFilter(msg) {
    if (msg.attachments.length > 0) {
        return msg.attachments.filter(a => a.height).length > 0;
    } else if (msg.embeds.length > 0) {
        return msg.embeds.filter(e => e.type === 'image').length > 0;
    } else {
        return IMAGE_REGEX.test(msg.content);
    }
}
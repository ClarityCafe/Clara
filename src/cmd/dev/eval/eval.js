/** 
 * @file Improved eval command using V8 VMs to try and hide sensitive data.
 * @author Ovyerus
 */

const vm = require('vm');
const util = require('util');
const {Stream} = require('stream');

const FAIL_COL = 0xF44336;
const SUCCESS_COL = 0x8BC34A;
const PENDING_COL = 0xFFEB3B;
const CODE_TEMPLATE = `
(async () => {
    {{code}}
})().then(__vmDone__, __vmErr__);
`;

// Object to use as a context for the VM.
let sandbox = {
    Eris: require('eris'),
    util,
    fs: require('fs'),
    cp: require('child_process'),
    path: require('path'),
    got: require('got'),
    require
};

exports.commands = ['eval'];

exports.init = bot => {
    // Creates a Proxy around the bot object, in order to help protect token and config.
    sandbox.bot = new Proxy(bot, {
        get(target, prop) {
            if (prop === 'token') return '<token hidden>';
            else if (prop === 'config') {
                let clone = Object.assign({}, target.config);
                clone.general.token = '<token hidden>';
                clone.general.redisURL = '<url hidden>';

                delete clone.tokens;
                delete clone.botlistTokens;

                return clone;
            } else return target[prop];
        }
    });
};

exports.eval = {
    desc: 'Run JS code.',
    owner: true,
    usage: '<code>',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('Please give some code to run.');

        let {args, cmd, suffix, cleanSuffix, settings, guildBot, channel, guild, author} = ctx;
        let addReturn = !/^(return|throw)/.test(ctx.suffix.split(/;|\n/).map(v => v.trim()).slice(-1));
        let fullCode = CODE_TEMPLATE.replace('{{code}}', addReturn ? 'return ' + ctx.suffix : ctx.suffix);

        // This is where stuff gets really weird.
        // This merges the sandbox template above with some variables from the context object.
        // Then it wraps that into a Proxy to prevent the needed variables from being overriden (that is __vmDone__ and __vmErr__).
        let vmSandbox = new Proxy(Object.assign({}, sandbox, {args, cmd, suffix, cleanSuffix, settings, guildBot, channel, guild, author}, {
            async __vmDone__(val) {
                await handleResult(val, ctx, bot);
            },

            async __vmErr__(err) {
                await handleResult(err && err.message ? err.message : err, ctx, bot, true);
            }
        }), {
            set(target, prop, val) {
                if (['__vmDone__', '__vmErr__'].includes(prop)) throw new Error(`Cannot override ${prop}.`);
                else target[prop] = val;
        
                return true;
            }
        });

        // Runs the users' code in a VM, with the context specified above.
        vm.runInContext(fullCode, vm.createContext(vmSandbox));
    }
};

function genCodeblock(text) {
    return `\`\`\`js\n${text}\n\`\`\``;
}

async function handleResult(val, ctx, bot, isErr=false) {
    if (val instanceof Stream && val.body) val = val.body;

    let str = typeof val !== 'string' ? util.inspect(val, {depth: 1}) : val;
    let oldVal = val;

    let embed = {
        title: 'Eval Result',
        color: SUCCESS_COL,
        fields: [
            {name: 'Input', value: genCodeblock(ctx.suffix)},
            {name: 'Success', value: genCodeblock(str)}
        ]
    };

    if (val && val.then) {
        embed.fields[1].name = 'Pending';
        embed.fields[1].value = 'Pending Promise...';
        embed.color = PENDING_COL;
    } else if (str.length >= 1000) {
        let key = await bot.hastePost(str);
        let url = `https://hastebin.com/${key}.js`;
        embed.fields[1].value = `Output is too long to display nicely.\nOutput has been uploaded [here](${url})`;
    }

    if (isErr) {
        embed.fields[1].name = 'Error';
        embed.color = FAIL_COL;
    }

    let m = await ctx.createMessage({embed});

    // Handle nested promises/thenables.
    while (val && val.then) {
        try {
            val = await val;
        } catch(err) {
            val = err;
            isErr = true;

            break;
        }
    }

    if (val === oldVal) return;

    

    str = util.inspect(val, {depth: 1});

    if (isErr) {
        embed.fields[1].name = 'Error';
        embed.fields[1].value = val && val.message ? val.message : val;
        embed.color = FAIL_COL; 
    } else if (str.length >= 1000) {
        let key = await bot.hastePost(str);
        let url = `https://hastebin.com/${key}.js`;
        embed.fields[1].value = `Output is too long to display nicely.\nOutput has been uploaded [here](${url})`;
    } else embed.fiels[1].value = str;

    if (!isErr) {
        embed.fields[1].name = 'Success';
        embed.color = SUCCESS_COL;
    }

    await m.edit({embed});
}
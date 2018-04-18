/**
 * @file Weeb.sh image commands.
 * @author Ovyerus
 */

const Wolken = require('wolken');
let handler;
let globTypes;

exports.commands = [];
exports.loadAsSubcommands = true;

exports.init = async bot => {
    handler = new Wolken(bot.config.tokens.weebsh);
    let types = await handler.getTypes();
    globTypes = types;

    for (let type of types) {
        exports.commands.push(type);
        exports[type] = {
            desc: `Shows a random ${type} image.`,
            usage: '[target]',
            async main(bot, ctx) {
                await ctx.channel.sendTyping();

                let img = await handler.getRandom({type, allowNSFW: ctx.channel.nsfw});
                let embed = {
                    description: ctx.suffix ? `weebsh-${type}` : '',
                    image: {url: img.url},
                    footer: {text: 'Powered by weeb.sh.'}
                };

                await ctx.createMessage({embed}, null, 'channel', {
                    target: ctx.cleanSuffix,
                    author: ctx.author.mention
                });
            }
        };
    }
};

exports.main = {
    desc: 'Image commands from weeb.sh.',
    usage: '<action> [target]',
    async main(bot, ctx) {
        let embed = {
            title: 'Current Actions',
            description: globTypes.join(', ')
        };

        return await ctx.createMessage({embed});
    }
};
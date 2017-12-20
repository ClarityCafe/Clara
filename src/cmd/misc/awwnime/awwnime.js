/**
 * @file Gets a random anime picture.
 * @author Capuccino
 * @author Ovyerus
 */

exports.commands = [
    'awwnime'
];

exports.awwnime = {
    desc: 'Gets you a random anime picture outside of yorium.moe',
    usage: '[query]',
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let query = ctx.suffix ? `?q=${encodeURIComponent(ctx.suffix).replace(/%20/g, '+')}` : '';
        let res = JSON.parse((await got(`https://raw-api.now.sh/${query}`)).body);
        let image = res[Math.floor(Math.random() * res.length)];
        
        if (!image) await ctx.createMessage('notFound');
        else await ctx.createMessage(image.full);
    }
};
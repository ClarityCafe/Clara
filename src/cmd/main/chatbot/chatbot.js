/**
 * @file Chatbot using AIML.
 * @author Capuccino
 * @author Ovyerus
 */

const burly = require('burlyy');
const natsuki = new burly({
    name: 'Natsuki'
});

exports.commands = ['chat'];

exports.init = () => {
    natsuki.loadDir(`${mainDir}/assets/chatbot`);
};

exports.chat = {
    desc: 'Talk to the bot',
    usage: '<message>',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('chatbot-noArgs');

        await ctx.channel.sendTyping();

        let res = await natsuki.talk(ctx.cleanSuffix);

        await ctx.createMesage(res);
    }
};
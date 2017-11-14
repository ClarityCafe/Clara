/**
 * @file Chatbot using AIML.
 * @author Capuccino
 * @author Ovyerus
 */

const burly = require('burlyy');
let natsuki;

exports.commands = ['chat'];

exports.init = () => {
    natsuki = new burly({
       defaultResponse: null,
       name:'Natsuki'
    });
    natsuki.loadDir(`${mainDir}/assets/chatbot`);
};

exports.chat = {
    desc: 'Talk to the bot',
    usage: '<message>',
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let res = await natsuki.talk(ctx.cleanSuffix);

        await ctx.createMesage(res);
    }
};
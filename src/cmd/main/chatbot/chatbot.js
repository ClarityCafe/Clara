/**
 * @file Chatbot using AIML.
 * @author Capuccino
 * @author Ovyerus
 */

const burly = require('burlyy');
const fs = require('fs');
let natsuki;

exports.commands = ['chat'];

exports.init = () => {
    let files = fs.readdirSync(`${mainDir}/assets/chatbot/`).map(v => `${mainDir}/assets/chatbot/${v}`);
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
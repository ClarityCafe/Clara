/**
 * @file Chatbot using AIML.
 * @author Capuccino
 * @author Ovyerus
 */

const aiml = require('aiml-high');
const fs = require('fs');
let natsuki;

aiml.prototype.findAnswerAsync = Promise.promisify(aiml.prototype.findAnswer);

exports.commands = ['chat'];

exports.init = () => {
    let files = fs.readdirSync(`${mainDir}/assets/chatbot/`).map(v => `${mainDir}/assets/chatbot/${v}`);
    natsuki = new aiml({name:"Clara"});
    natsuki.loadFiles(files);
}

exports.chat = {
    desc: 'Talk to the bot',
    usage: '<message>',
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let res = await natsuki.findAnswerAsync(ctx.cleanSuffix);
        await ctx.createMesage(res);
    }
};
/**
 * @file Chatbot using AIML.
 * @author Capuccino
 * @author Ovyerus
 */

const aiml = require('aiml-high');
const fs = require('fs');
let natsuki;

Promise.promisify(aiml.findAnswer);

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

        await natsuki.findAnswer(ctx.cleanSuffix).then(res => {
            await ctx.createMessage(res);
        });
    }
};
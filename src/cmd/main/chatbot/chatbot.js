/**
 * @file Chatbot using AIML.
 * @author Capuccino
 * @author Ovyerus
 */

const aiml = require('aiml');
let natsuki;

const parseDir = Promise.promisify(aiml.parseDir);
Promise.promisifyAll(aiml.AiEngine);

exports.commands = ['chat'];

exports.init = () => {
    parseDir(`${mainDir}/assets/chatbot`).then(topics => {
        natsuki = new aiml.AiEngine('Natsuki', topics, {name: 'Protag-chan'});
    });
}

exports.chat = {
    desc: 'Talk to the bot',
    usage: '<message>',
    async main(bot, ctx) {
        await ctx.channel.sendTyping();

        let res = await natsuki.reply({name: ctx.author}, ctx.cleanSuffix);

        await ctx.createMessage(res);
    }
};
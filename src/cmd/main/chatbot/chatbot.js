/**
 * @file Chatbot made using markov chains.
 * @author Ovyerus
 */
const aiml = require('aiml');

//Promsifier
Promise.promisifyAll(aiml.parseDir);

exports.commands = [
    'chat'
];

exports.chat = {
    desc: 'Talk to the bot',
    usage: '<message>',
    main(bot, ctx) {
        aiml.parseDir(`${mainDir}/assets/chatbot/`).then((err, topics) => {
            //im sorry
            const natsuki = new aiml.AiEngine('Natsuki', topics, {name: 'Protag-chan'});
            natsuki.reply({name: ctx.author}, ctx.suffix, res => {
                await ctx.createMessage(res);
            })
        })
    }
}
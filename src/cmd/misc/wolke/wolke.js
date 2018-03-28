/**
 * @file Wolke
 * @author Capuccino
 */
const Wolken = require('wolken');

exports.commands = ['wolke'];

exports.loadAsSubCommands = true;

exports.main = {
    desc: 'Display images from Weeb.sh',
    async main(bot, ctx) {
        return new Error('You implement this you piece of shit.');
        /** @todo Actually implement this */
        await ctx.createMessage('Not Implemented');
    }
}

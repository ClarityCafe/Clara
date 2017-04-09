/* jsong.js - encode a image in JSON format or the other way around
 * 
 *  Contributed by Capuccino
 */

exports.commands = [
    'encode',
    'decode'
];

const jsong = require('jsng');
const utils = require(`${__baseDir}/modules/utils`);

exports.loadAsSubCommands = true;

exports.main = {
    desc: 'Encode a Image into JSON-G',
    usage: '[<encode|decode> <URL | Image>]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            ctx.createMessage({embed: {
                title: 'Image to JSON encoder/decoder',
                description: 'To use this command, you either need to specify a URL or use this as a caption for your image.',
                color: utils.randomColour()
            }}).then(resolve).catch(reject);
        });
    }
};

exports.encode = {

};
/* marry.js - Marry your imaginary waifu or someone
 * 
 * 
 *  Contributed by Capuccino
 */

exports.commands = [
    'marry'
];

exports.marry = {
    desc: 'Marry Someone',
    longDesc: 'Marry your imagfinary waifu or a member in the guild.',
    usage: '<Mention | Name> ',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.args) {
                ctx.msg.channel.createMessage('Mention or cite your partner\'s name.');
            } else if (ctx.args[0].mentions.id === ctx.msg.author.id) {
                ctx.msg.channel.createMessage('Hey! You\'re not allowed to marry yourself.');
            } else {
                // we'll add somth here later
            }
        });
    }
};
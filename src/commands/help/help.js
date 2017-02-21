/*
 * help.js - Display information for all avaliable commands.
 * 
 * Contributed by Capuccino and Ovyerus.
 */



exports.commands = [
    'help'
];

exports.help = {
    desc: 'The help command.',
    fullDesc: 'Displays information for all the avaliable commands in the bot. If an argument is given, displays additional information on that command.',
    usage: '[command]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                let embedTemplate = {title: `${bot.user.username} Help`, description: `**Main Prefix:** ${bot.config.mainPrefix}`, color: 2201331};
                let cmdFields = [];

                for (let cmd in bot.commands) {
                    let cmnd = bot.commands[cmd];
                    cmdFields.push({name: cmd, value: `${cmnd.usage ? `${cmnd.usage} - ` : ''}${cmnd.desc}`});
                }

                ctx.msg.channel.createMessage('Sending the help message to your DMs').then(() => {
                    return ctx.msg.author.getDMChannel();
                }).then(dm => {
                    let fieldCollect = [];
                    let msgs = [];
                    for (let i in cmdFields) {
                        fieldCollect.push(cmdFields[i]);
                        if ((Number(i) % 24 === 0 && Number(i) !== 0) || Number(i) === cmdFields.length - 1) {
                            let embed = embedTemplate;
                            embed.fields = fieldCollect;
                            fieldCollect = [];
                            msgs.push(dm.createMessage({embed}));
                        }
                    }
                    return Promise.all(msgs);
                }).then(resolve).catch(reject);
            } else {
                if (!bot.commands[ctx.args[0]]) {
                    ctx.msg.channel.createMessage('That command does not exist. Make sure to check your spelling.').then(resolve).catch(reject);
                } else {
                    let cmd = bot.commands[ctx.args[0]];
                    let embed = {title: ctx.args[0], description: `${cmd.usage ? `\`${cmd.usage}\` - `: ''}**${cmd.longDesc ? cmd.longDesc : cmd.desc}**`, color: 2201331};
                    ctx.msg.channel.createMessage({embed}).then(resolve).catch(reject);
                }
            }
        });
    }
};

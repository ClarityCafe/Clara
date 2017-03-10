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
    fixed: true,
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.args.length === 0) {
                let embedTemplate = {title: `${bot.user.username} Help`, description: `**Main Prefix:** ${bot.config.mainPrefix}`, color: 2201331};
                let cmdFields = [];

                bot.commands.forEach((cmd, cmnd) => {
                    cmdFields.push({name: cmd, value: `${cmnd.usage ? `${cmnd.usage} - ` : ''}${cmnd.desc}${cmnd.example ? `\n**Example:** \`${bot.config.mainPrefix}${cmd} ${cmnd.example}\`` : ''}`});
                });

                ctx.msg.channel.createMessage(localeManager.t('helps-sending', 'en-UK')).then(() => {
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
                if (!bot.commands.getCommand(ctx.args[0])) {
                    ctx.msg.channel.createMessage(localeManager.t('help-noCmd', 'en-UK')).then(resolve).catch(reject);
                } else {
                    let cmd = bot.commands.getCommand(ctx.args[0]);
                    let embed = {title: ctx.args[0], description: `${cmd.usage ? `\`${cmd.usage}\` - `: ''}**${cmd.longDesc ? cmd.longDesc : cmd.desc}**${cmd.example ? `\n**Example:** \`${bot.config.mainPrefix}${ctx.args[0]} ${cmd.example}\``: ''}`, color: 2201331};
                    ctx.msg.channel.createMessage({embed}).then(resolve).catch(reject);
                }
            }
        });
    }
};
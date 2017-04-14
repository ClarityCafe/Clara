/*
 * help.js - Display information for all avaliable commands.
 *
 * Contributed by Capuccino and Ovyerus.
 */

/* eslint-env node */


exports.commands = ['help'];

exports.help = {
    desc: 'Show bot help.',
    usage: '[command]',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            if (!ctx.args[0]) {
                let cmds = [];
                
                bot.commands.forEach((cmd, name) => {
                    cmds.push(`${bot.config.mainPrefix}${name}${cmd.usage ? ` ${cmd.usage}` : ''}`);
                });

                ctx.createMessage('Sending help to your DMs.').then(() => {
                    let cmdCollect = [];
                    let msgs = [];
                    let colour = utils.randomColour();

                    for (let i in cmds) {
                        cmdCollect.push(cmds[i]);
                        if (i === '29' || Number(i) === cmds.length - 1) {
                            let embed = new embedTemplate(bot);
                            embed.color = colour;
                            if (cmdCollect.length > 15) {
                                embed.fields[0].value = `\`${cmdCollect.slice(0, 15).join('\n')}\``;
                                embed.fields[1] = {
                                    name: '\u200b',
                                    value: `\`${cmdCollect.slice(15, 30).join('\n')}\``,
                                    inline: true
                                };
                            } else {
                                embed.fields[0].value = `\`${cmdCollect.join('\n')}\``;
                            }

                            cmdCollect = [];
                            msgs.push(ctx.createMessage({embed}, null, 'author'));
                        }
                    }

                    return Promise.all(msgs);
                }).then(resolve).catch(reject);
            } else {
                if (!bot.commands.getCommand(ctx.args[0])) {
                    ctx.createMessage(`Command \`${ctx.args[0]}\` could not be found. Make sure to check your spelling.`);
                } else {
                    let cmd = bot.commands.getCommand(ctx.args[0]);
                    let embed = {
                        description: `\`${bot.config.mainPrefix}${ctx.args[0]}${cmd.usage ? ` ${cmd.usage}` : ''}\n\u200b - ${cmd.desc}\``
                    };

                    ctx.createMessage({embed}).then(resolve).catch(reject);
                }
            }
        });
    }
};

// TFW cant force JS to gimme a new object when referring to others
function embedTemplate(bot) {
    this.title = `${bot.user.username} Help`;
    this.description =`${bot.commands.length} Commands`;
    this.fields = [
        {name: '\u200b', inline: true}
    ];
    this.footer = {text: 'Powered by Clara'};
}
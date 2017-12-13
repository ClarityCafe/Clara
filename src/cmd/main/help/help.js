/**
 * @file Display information for all avaliable commands.
 * @author Capuccino
 * @author Ovyerus
 */

exports.commands = ['help'];

exports.help = {
    desc: 'Show bot help.',
    usage: '[command]',
    async main(bot, ctx) {
        if (!ctx.suffix) {
            let cmds = [];
            let cmdCollect = [];

            bot.commands.forEach((cmd, name) => {
                if ((cmd.owner || cmd.hidden) && bot.checkBotPerms(ctx.author.id)) cmds.push(`${bot.config.mainPrefix}${name}${cmd.usage ? ` ${cmd.usage}` : ''}`);
                else if (cmd.owner || cmd.hidden) return null;
                else cmds.push(`${bot.config.mainPrefix}${name}${cmd.usage ? ` ${cmd.usage}` : ''}`);
            });

            await ctx.createMessage('help-sending');

            for (let i in cmds) {
                cmdCollect.push(cmds[i]);

                if (i === '29' || Number(i) === cmds.length - 1) {
                    let embed = new embedTemplate(bot);

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

                    try {
                        await ctx.createMessage({embed}, null, 'author', {
                            amount: cmds.length
                        });
                    } catch(err) {
                        return await ctx.createMessage('help-cantSend');
                    }
                }
            }
        } else {
            if (!bot.commands.getCommand(ctx.args[0])) return await ctx.createMessage('help-noCommand');

            let cmd = bot.commands.getCommand(ctx.args[0]);
            let embed = {
                description: `\`${bot.config.mainPrefix}${ctx.args[0]}${cmd.usage ? ` ${cmd.usage}` : ''}\n\u200b - ${cmd.desc}\`\n\n`
            };

            if (cmd.subcommands) {
                for (let name in cmd.subcommands) {
                    let scmd = cmd.subcommands[name];

                    embed.description += `\`${bot.config.mainPrefix}${ctx.args[0]} ${name}${scmd.usage ? ` ${scmd.usage}` : ''}\n\u200b - ${scmd.desc}\`\n\n`;
                }
            }

            await ctx.createMessage({embed});
        }
    }
};

// TFW cant force JS to gimme a new object when referring to others
function embedTemplate(bot) {
    this.title = `${bot.user.username} Help`;
    this.description ='help-commandsAmount';
    this.fields = [
        {name: '\u200b', inline: true}
    ];
    this.footer = {text: 'Powered by Clara'};
}
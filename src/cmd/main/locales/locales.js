/**
 * @file Locale management
 * @author Ovyerus
 */

const LOCALE_REGEX = /[a-z]{2}-[A-Z]{2}/i;

exports.loadAsSubcommands = true;
exports.commands = [
    'set'
];

exports.main = {
    desc: 'Allows the setting of locales, either per-user or per-guild.',
    usage: '[set [guild] <locale>]',
    main(bot, ctx) {
        return ctx.createMessage({embed: localeBlock(bot, ctx.settings)}, null, 'channel', {
            userLocale: ctx.settings.user.locale,
            guildLocale: ctx.settings.guild.locale
        });
    }
};

exports.set = {
    desc: "Sets the guild's locale.",
    usage: '<locale>',
    async main(bot, ctx) {
        if (!ctx.args[0]) {
            return await ctx.createMessage({embed: localeBlock(bot, ctx.settings)}, null, 'channel', {
                userLocale: ctx.settings.user.locale,
                guildLocale: ctx.settings.guild.locale
            });
        }

        if (LOCALE_REGEX.test(ctx.args[0])) return await changeLocale(bot, ctx);

        if (ctx.args[0].toLowerCase() === 'guild' && LOCALE_REGEX.test(ctx.args[1])) {
            if (!ctx.member.permission.has('manageGuild')) {
                return await ctx.createMessage('user-noPerm', null, 'channel', {
                    perm: 'Manage Guild'
                });
            }

            return await changeLocale(bot, ctx, true);
        }

        return await ctx.createMessage({embed: localeBlock(bot, ctx.settings)}, null, 'channel', {
            userLocale: ctx.settings.user.locale,
            guildLocale: ctx.settings.guild.locale
        });
    }
};

function localeBlock(bot, settings) {
    let embed = {
        title: 'locales-infoHeader',
        description: '',
        fields: []
    };

    Object.keys(bot.localeManager.locales).forEach(v => embed.description += `\n${v} - **${bot.localeManager.locales[v].locales[v]} [${bot.localeManager.locales[settings.locale].locales[v]}]**`);
    
    embed.description += '\n\u200b';

    embed.fields.push({
        name: 'locales-userLocale',
        value: 'locales-guildLocale'
    });

    embed.fields.push({
        name: 'exampleUsage',
        value: '`locales set en-UK`\n`locales set guild en-UK`'
    });

    return embed;
}

async function changeLocale(bot, ctx, guild) {
    let real;

    if (!guild) {
        for (let locale in bot.localeManager.locales) {
            if (ctx.args[0].toLowerCase() === locale.toLowerCase()) {
                real = true;
                break;
            }
        }

        let userChoice = ctx.args[0].split('-')[0].toLowerCase() + '-' + ctx.args[0].split('-')[1].toUpperCase();

        if (!real) {
            return await ctx.createMessage('locales-invalidLocale', null, 'channel', {
                locale: userChoice
            });
        }

        await bot.db[ctx.author.id].locale.set(userChoice);
        return await ctx.createMessage(bot.localeManager.t('locales-userLocaleUpdated', userChoice, {
            locale: userChoice
        }));
    }

    for (let locale in bot.localeManager.locales) {
        if (ctx.args[1].toLowerCase() === locale.toLowerCase()) {
            real = true;
            break;
        }
    }

    let userChoice = ctx.args[1].split('-')[0].toLowerCase() + '-' + ctx.args[1].split('-')[1].toUpperCase();

    if (!real) {
        return await ctx.createMessage('locales-invalidLocale', null, 'channel', {
            locale: userChoice
        });
    }

    await bot.db[ctx.guild.id].locale.set(userChoice);
    return await ctx.createMessage(bot.localeManager.t('locales-guildLocaleUpdated', userChoice, {
        locale: userChoice
    }));
}
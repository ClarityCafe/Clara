/*
 * locales.js - Locale management
 * 
 * Contributed by Ovyerus
 */

var exposed;

exports.commands = [
    'locales'
];

exports.locales = {
    desc: 'Manage locales.',
    longDesc: '',
    usage: '[set [guild] <locale>]',
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            if (ctx.args.length < 2) {
                ctx.msg.channel.createMessage({embed: localeBlock(ctx.settings)}).then(resolve).catch(reject);
            } else if (ctx.args.length === 2 && ctx.args[1] === 'guild') {
                ctx.msg.channel.createMessage({embed: localeBlock(ctx.settings)}).then(resolve).catch(reject);
            } else if (ctx.args.length === 2 && /[a-z]{2}-[A-Z]{2}/i.test(ctx.args[1])) {
                exposed = bot;
                changeLocale(ctx).then(resolve).catch(reject);
            } else if (ctx.args.length === 3 && ctx.args[1] === 'guild' && /[a-z]{2}-[A-Z]{2}/i.test(ctx.args[2])) {
                if (!ctx.msg.member.permission.has('manageGuild')) {
                    ctx.msg.channel.createMessage(localeManager.t('user-noPerm', 'en-UK', {perm: 'Manage guild'})).then(resolve).catch(reject);
                } else {
                    changeLocale(ctx, true).then(resolve).catch(reject);
                }
            } else {
                ctx.msg.channel.createMessage({embed: localeBlock(ctx.settings)}).then(resolve).catch(reject);
            }
        });
    }
};

function localeBlock(settings) {
    let embed = {title: localeManager.t('locales-infoHeader', settings.locale), description: '', fields: []};
    Object.keys(localeManager.locales).forEach(v => embed.description += `\n${v} - **${localeManager.locales[v].locales[v]} [${localeManager.locales[settings.locale].locales[v]}]**`);
    embed.description += '\n\u200b';

    embed.fields.push({name: localeManager.t('locales-userLocale', settings.locale, {locale: settings.user.locale}), value: `${localeManager.t('locales-guildLocale', settings.locale, {locale: settings.guild.locale})}\n\u200b`});
    embed.fields.push({name: localeManager.t('locales-exampleUsage', settings.locale), value: '`locales set en-UK`\n`locales set guild en-UK`'});
    return embed;
}

function changeLocale(ctx, guild) {
    return new Promise((resolve, reject) => {
        let bot = exposed;
        let real;
        if (!guild) {
            for (let locale in localeManager.locales) {
                if (ctx.args[1].toLowerCase() === locale.toLowerCase()) {
                    real = true;
                    break;
                }
            }

            let userChoice = ctx.args[1].split('-')[0].toLowerCase() + '-' + ctx.args[1].split('-')[1].toUpperCase();
            if (!real) {
                ctx.msg.channel.createMessage(localeManager.t('locales-invalidLocale', settings.locale, {locale: userChoice})).then(resolve).catch(reject);
            } else {
                bot.setUserSettings(ctx.msg.author.id, {locale: userChoice}).then(() => {
                    return ctx.msg.channel.createMessage(localeManager.t('locales-userLocaleUpdated', settings.locale, {locale: userChoice}));
                }).then(resolve).catch(reject);
            }
        } else {
            for (let locale in localeManager.locales) {
                if (ctx.args[1].toLowerCase() === locale.toLowerCase()) {
                    real = true;
                    break;
                }
            }

            let userChoice = ctx.args[1].split('-')[0].toLowerCase() + '-' + ctx.args[1].split('-')[1].toUpperCase();
            if (!real) {
                ctx.msg.channel.createMessage(localeManager.t('locales-invalidLocale', settings.locale, {locale: userChoice})).then(resolve).catch(reject);
            } else {
                bot.setGuildSettings(ctx.msg.channel.guild.id, {locale: userChoice}).then(() => {
                    return ctx.msg.channel.createMessage(localeManager.t('locales-guildLocaleUpdated', settings.locale, {locale: userChoice}));
                }).then(resolve).catch(reject);
            }
        }
    });
}
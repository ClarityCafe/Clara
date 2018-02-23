/**
 * @file Dynamic command loading, unloading and reloading.
 * @author Ovyerus
 */

const fs = require('fs');

exports.loadAsSubcommands = true;

exports.commands = [
    'load',
    'unload',
    'reload'
];

exports.main = {
    desc: 'Command for managing command modules.',
    longDesc: 'Manages command modules for the bots. If no arguments, lists currently loaded modules, else runs the specified subcommand if possible.',
    usage: '[load|unload|reload]',
    owner: true,
    async main(bot, ctx) {
        let embed = {
            title: 'Currently enabled command modules',
            description: `Showing **${bot.commandFolders.length}** command modules.`,
            fields: [
                {name: 'Loaded Modules', value: Object.keys(bot.commands.modules).map(mod => `\`${mod}\``).join(', ')},
                {name: 'Unloaded Modules', value: bot.unloadedModules.map(mod => `\`${mod}\``).join(', ') || 'None'}
            ]
        };

        await ctx.createMessage({embed});
    }
};

exports.load = {
    desc: 'Loads a command module.',
    usage: '<module>',
    async main(bot, ctx) {
        if (!ctx.args[0]) return await ctx.createMessage('No module given to load.');
        if (bot.commands.checkModule(ctx.args[0])) return await ctx.createMessage(`Module **${ctx.args[0]}** is already loaded.`);

        let folders = bot.commandFolders.map(f => f.split('/').slice(-1)[0]);

        if (!folders.includes(ctx.args[0])) return await ctx.channel.createMessage(`Module **${ctx.args[0]}** does not exist.`);

        let pkg = JSON.parse(fs.readFileSync(bot.commandFolders[folders.indexOf(ctx.args[0])] + '/command.json'));
        let mod = `${bot.commandFolders[folders.indexOf(ctx.args[0])]}/${pkg.main}`;

        if (Array.isArray(pkg.requiredTokens)) {
            let missingTokens = pkg.requiredTokens.filter(tkn => !bot.config.tokens[tkn]);

            if (missingTokens.length) return await ctx.createMessage(`Will not load **${ctx.args[0]}** due to missing tokens: \`${missingTokens.join(', ')}\``);
        }

        bot.commands.loadModule(mod);
        await bot.removeUnloadedModule(ctx.args[0]);

        await ctx.createMessage(`Loaded module **${ctx.args[0]}**`);
    }
};

exports.unload = {
    desc: 'Unloads a command module.',
    usage: '<module>',
    async main(bot, ctx) {
        if (!ctx.args[0]) return await ctx.createMessage('No module given to unload.');
        if (!bot.commands.checkModule(ctx.args[0])) return await ctx.createMessage(`Module **${ctx.args[0]}** is not loaded or does not exist.`);

        let folders = bot.commandFolders.map(f => f.split('/').slice(-1)[0]);
        let pkg = JSON.parse(fs.readFileSync(bot.commandFolders[folders.indexOf(ctx.args[0])] + '/command.json'));
        let mod = `${bot.commandFolders[folders.indexOf(ctx.args[0])]}/${pkg.main}`;

        bot.commands.unloadModule(mod);
        delete require.cache[require.resolve(mod)];

        await bot.addUnloadedModule(ctx.args[0]);
        await ctx.channel.createMessage(`Unloaded module **${ctx.args[0]}**`);
    }
};

exports.reload = {
    desc: 'Reloads a command module.',
    usage: '<module>',
    async main(bot, ctx) {
        if (!ctx.args[0]) return await ctx.createMessage('No module given to reload.');
        if (!bot.commands.checkModule(ctx.args[0])) return await exports.load.main(bot, ctx);

        let folders = bot.commandFolders.map(f => f.split('/').slice(-1)[0]);
        let pkg = JSON.parse(fs.readFileSync(bot.commandFolders[folders.indexOf(ctx.args[0])] + '/command.json'));
        let mod = `${bot.commandFolders[folders.indexOf(ctx.args[0])]}/${pkg.main}`;

        bot.commands.reloadModule(mod);

        await ctx.createMessage(`Reloaded module **${ctx.args[0]}**`);
    }
};
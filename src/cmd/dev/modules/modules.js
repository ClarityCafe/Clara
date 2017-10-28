/**
 * @file Dynamic command module loading, unloading and reloading.
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
    desc: 'Command for managing modules.',
    longDesc: 'Manages command modules for the bots. If no arguments, lists currently loaded modules, else runs the specified subcommand if possible.',
    usage: '[load|unload|reload]',
    owner: true,
    async main(bot, ctx) {
        let unloadedMods = JSON.parse(fs.readFileSync(`${mainDir}/data/unloadedCommands.json`));
        let embed = {
            title: 'Current Modules',
            description: `Showing **${bot.commandFolders.length}** command modules.`,
            fields: [
                {name: 'Loaded Modules', value: []},
                {name: 'Unloaded Modules', value: []}
            ]
        };

        Object.keys(bot.commands.modules).filter(m => !m.endsWith('-fixed')).forEach(mod => {
            embed.fields[0].value.push(`\`${mod}\``);
        });

        unloadedMods.forEach(mod =>  {
            embed.fields[1].value.push(`\`${mod.split('/').slice(-1)[0]}\``);
        });

        embed.fields[0].value = embed.fields[0].value.join(', ');
        embed.fields[1].value = embed.fields[1].value.join(', ') || 'None';

        await ctx.createMessage({embed});
    }
};

exports.load = {
    desc: 'Load a module.',
    usage: '<module>',
    async main(bot, ctx) {
        if (!ctx.args[0]) return await ctx.createMessage('No module given to load.');
        if (bot.commands.checkModule(ctx.args[0])) return await ctx.createMessage(`Module **${ctx.args[0]}** is already loaded.`);

        let folders = bot.commandFolders.map(f => f.split('/').slice(-1)[0]);

        if (!folders.includes(ctx.args[0])) return await ctx.channel.createMessage(`Module **${ctx.args[0]}** does not exist.`);

        let pkg = JSON.parse(fs.readFileSync(bot.commandFolders[folders.indexOf(ctx.args[0])] + '/package.json'));
        let mod = `${bot.commandFolders[folders.indexOf(ctx.args[0])]}/${pkg.main}`;

        bot.commands.loadModule(mod);

        let unloadedMods = JSON.parse(fs.readFileSync(`${mainDir}/data/unloadedCommands.json`));
        let sliced = unloadedMods.map(f => f.split('/').slice(-1)[0]);

        if (!sliced.includes(ctx.args[0])) {
            unloadedMods.splice(sliced.indexOf(ctx.args[0]), 1);
            fs.writeFileSync(`${mainDir}/data/unloadedCommands.json`, JSON.stringify(unloadedMods));
        }

        await ctx.createMessage(`Loaded module **${ctx.args[0]}**`);
    }
};

exports.unload = {
    desc: 'Unload a module.',
    usage: '<module>',
    async main(bot, ctx) {
        if (!ctx.args[0]) return await ctx.createMessage('No module given to unload.');
        if (!bot.commands.checkModule(ctx.args[0])) return await ctx.createMessage(`Module **${ctx.args[0]}** is not loaded or does not exist.`);

        let folders = bot.commandFolders.map(f => f.split('/').slice(-1)[0]);
        let pkg = JSON.parse(fs.readFileSync(bot.commandFolders[folders.indexOf(ctx.args[0])] + '/package.json'));
        let mod = `${bot.commandFolders[folders.indexOf(ctx.args[0])]}/${pkg.main}`;

        bot.commands.unloadModule(mod);
        delete require.cache[require.resolve(mod)];

        let unloadedMods = JSON.parse(fs.readFileSync(`${mainDir}/data/unloadedCommands.json`));

        unloadedMods.push(mod.split('/').slice(0, -1).join('/'));
        fs.writeFileSync(`${mainDir}/data/unloadedCommands.json`, JSON.stringify(unloadedMods));

        await ctx.channel.createMessage(`Unloaded module **${ctx.args[0]}**`);
    }
};

exports.reload = {
    desc: 'Reload a module.',
    usage: '<module>',
    async main(bot, ctx) {
        if (!ctx.args[0]) return await ctx.createMessage('No module given to reload.');
        if (!bot.commands.checkModule(ctx.args[0])) return await exports.load.main(bot, ctx);

        let folders = bot.commandFolders.map(f => f.split('/').slice(-1)[0]);
        let pkg = JSON.parse(fs.readFileSync(bot.commandFolders[folders.indexOf(ctx.args[0])] + '/package.json'));
        let mod = `${bot.commandFolders[folders.indexOf(ctx.args[0])]}/${pkg.main}`;

        bot.commands.reloadModule(mod);

        await ctx.createMessage(`Reloaded module **${ctx.args[0]}**`);
    }
};
/**
 * @file Manage roles that users can get for themselves.
 * @author Ovyerus
 */

exports.loadAsSubcommands = true;
exports.commands = [
    'list',
    'add',
    'delete',
    'limit',
    'get',
    'remove'
];

exports.main = {
    desc: 'Manage self-assignable ranks.'
};

exports.list = {
    desc: 'List all ranks that are available to get.',
    async main(bot, ctx) {
        let roles = ctx.settings.guild.ranks.roles.map(r => {
            let role = ctx.guild.roles.get(r);
            return role ? `${role.name}${ctx.member.roles.includes(r) ? ' **(Received)**' : ''}` : 'Deleted Role';
        }).join('\n') || 'None';

        await ctx.createMessage({embed: {
            title: 'Available Ranks',
            description: roles
        }});
    }
};

exports.add = {
    desc: 'Adds a role to be used as a rank.',
    usage: '<name> [colour [hoist]]',
    permissions: {both: 'manageRoles'},
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('Please tell me what role to add as a rank.');

        let name;
        let color = 0;
        let hoist = false;

        if (ctx.args.length === 1) name = ctx.suffix;
        else if (ctx.args.length === 2 && !/^#?[A-Z0-9]{6}$/i.test(ctx.args[1])) name = ctx.suffix;
        else if (ctx.args.length === 2) {
            name = ctx.args[0];
            color = parseInt(ctx.args[1].replace('#', ''), 16);
        } else {
            [color, hoist] = ctx.args.slice(-2);
            name = ctx.args.slice(0, -2).join(' ');

            if (!/^#?[A-Z0-9]{6}$/i.test(color)) {
                name += ` ${color}`;
                color = null;
            } else color = parseInt(ctx.args[1].replace('#', ''), 16);

            if (!isBool(hoist) && color == null) {
                name += ` ${hoist}`;
                hoist = null;
            } else if (!isBool(hoist)) hoist = null;
            else hoist = convertBool(hoist);
        }

        let role = await bot.lookups.roleLookup(ctx, name, false);

        // Silently create the role if it doesn't exist
        if (!role) {
            role = await ctx.guild.createRole({
                name,
                color,
                hoist
            });
        } else if (ctx.settings.guild.ranks.roles.includes(role.id)) return await ctx.createMessage('That role is already set as a rank.');

        await bot.db[ctx.guild.id].ranks.roles.push(role.id);
        await ctx.createMessage(`Added role **${role.name}** as a rank.`);
    }
};

exports.delete = {
    desc: 'Stops a role from being able to be used as a rank.',
    usage: '<rank name>',
    async main(bot, ctx) {
        if (!ctx.settings.guild.ranks.roles.length) return await ctx.createMessage('There are no ranks to delete.');
        if (!ctx.suffix) return await ctx.createMessage('Please say a rank to delete.');

        if (!isNaN(ctx.suffix) && ctx.setting.guild.ranks.roles.includes(ctx.suffix)) {
            await bot.db[ctx.guild.id].ranks.roles.remove(role.id);
            return await ctx.createMessage(`Removed **Deleted role** (${ctx.suffix}) as a rank.`);
        }

        let roles = ctx.guild.roles.filter(r => ctx.settings.guild.ranks.roles.includes(r.id));
        roles = roles.filter(r => r.name.toLowerCase().includes(ctx.suffix.toLowerCase()) || r.id.includes(ctx.suffix));
        let role;

        if (!roles.length) return await ctx.createMessage('There are no ranks that exist with that name.');
        else if (roles.length === 1) role = roles[0];
        else role = await bot.lookups._prompt(ctx, ctx.suffix, roles, 'roles');

        if (!role) return;

        await bot.db[ctx.guild.id].ranks.roles.remove(role.id);
        await ctx.createMessage(`Removed **${role.name}** (${role.id}) as a rank.`);
    }
};

exports.limit = {
    desc: 'Change the amount of ranks someone can have at once.',
    usage: '[limit]',
    async main(bot, ctx) {
        if (!ctx.suffix) {
            if (!ctx.settings.guild.ranks.limit) return await ctx.createMessage('Users can have unlimited ranks.');
            else return await ctx.createMessage(`Users can have up to \`${ctx.settings.guild.ranks.limit}\` ranks.`);
        }

        if (isNaN(ctx.args[0])) return await ctx.createMessage('Please give me a number to set as the limit. If you want to disable it, give me `0`.');

        await bot.db[ctx.guild.id].ranks.limit.set(Math.abs(Number(ctx.args[0])));
        await ctx.createMessage(`Set rank limit to \`${ctx.args[0]}\`.`);
    }
};

exports.remove = {
    desc: 'Removes a rank.',
    usage: '<rank name>',
    async main(bot, ctx) {
        let {guild} = ctx.settings;

        if (!guild.ranks.users[ctx.author.id] || !guild.ranks.users[ctx.author.id].length) return await ctx.createMessage('You do not have any ranks.');
        if (!ctx.suffix) return await ctx.createMessage('Please say what rank you wish to remove.');

        let roles = ctx.guild.roles.filter(r => guild.ranks.roles.includes(r.id));
        roles = roles.filter(r => r.name.toLowerCase().includes(ctx.suffix.toLowerCase()) || r.id.includes(ctx.suffix));
        let role;

        if (!roles.length) return await ctx.createMessage('There are no ranks that exist with that name.');
        else if (roles.length === 1) role = roles[0];
        else role = await bot.lookups._prompt(ctx, ctx.suffix, roles, 'roles');

        if (!role) return;

        await ctx.member.removeRole(role.id, 'Self-serve rank system');

        if (guild.ranks.users[ctx.author.id]) await bot.db[ctx.guild.id].ranks.users[ctx.author.id].remove(role.id);

        await ctx.createMessage(`You no longer have the rank **${role.name}**.`);
    }
};

exports.get = {
    desc: 'Gets a rank.',
    usage: '<rank name>',
    async main(bot, ctx) {
        let {guild} = ctx.settings;

        if (!guild.ranks.roles.length) return await ctx.createMessage('There are no ranks you can receive.');
        if (!ctx.suffix) return await ctx.createMessage('Please say what rank you want.');
        if (guild.ranks.limit !== 0 && guild.ranks.users[ctx.author.id] &&
            guild.ranks.users[ctx.author.id].length >= guild.ranks.limit) return await ctx.createMessage(`You have reached the maximum limit of **${guild.ranks.limit}** ranks for this server.`);

        let roles = ctx.guild.roles.filter(r => guild.ranks.roles.includes(r.id));
        roles = roles.filter(r => r.name.toLowerCase().includes(ctx.suffix.toLowerCase()) || r.id.includes(ctx.suffix));
        let role;

        if (!roles.length) return await ctx.createMessage('There are no ranks that exist with that name.');
        else if (roles.length === 1) role = roles[0];
        else role = await bot.lookups._prompt(ctx, ctx.suffix, roles, 'roles');

        if (!role) return;

        await ctx.member.addRole(role.id, 'Self-serve rank system');

        if (!guild.ranks.users[ctx.author.id]) await bot.db[ctx.guild.id].ranks.users[ctx.author.id].set([role.id]);
        else await bot.db[ctx.guild.id].ranks.users[ctx.author.id].push(role.id);

        await ctx.createMessage(`You now have the rank **${role.name}**`);
    }
};

function isBool(str) {
    return ['yes', 'y', 'true', 't', '1', 'enable', 'on', 'affirmative', '+',
            'no', 'n', 'false', 'f', '0', 'disable', 'off', 'negative', '-'].includes(str.toLowerCase()); // eslint-disable-line
}

function convertBool(str) {
    if (['yes', 'y', 'true', 't', '1', 'enable', 'on', 'affirmative', '+'].includes(str.toLowerCase())) return true;
    if (['no', 'n', 'false', 'f', '0', 'disable', 'off', 'negative', '-'].includes(str.toLowerCase())) return false;
}
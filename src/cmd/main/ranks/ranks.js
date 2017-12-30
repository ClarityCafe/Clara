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
    'userlimit',
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
            title: 'ranks-listHeader',
            description: roles
        }});
    }
};

exports.add = {
    desc: 'Adds a role to be used as a rank.',
    usage: '<name> [colour [hoist]]',
    permissions: {both: 'manageRoles'},
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('ranks-addNoArgs');

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
        } else if (ctx.settings.guild.ranks.roles.includes(role.id)) return await ctx.createMessage('ranks-addAlreadySet');

        await bot.db[ctx.guild.id].ranks.roles.push(role.id);
        await ctx.createMessage('ranks-addDone', null, 'channel', {
            role: role.name
        });
    }
};

exports.delete = {
    desc: 'Stops a role from being able to be used as a rank.',
    usage: '<rank name>',
    async main(bot, ctx) {
        let {guild} = ctx.settings;

        if (!guild.ranks.roles.length) return await ctx.createMessage('ranks-deleteNoRanks');
        if (!ctx.suffix) return await ctx.createMessage('ranks-deleteNoArgs');

        if (!isNaN(ctx.suffix) && guild.ranks.roles.includes(ctx.suffix)) {
            await bot.db[ctx.guild.id].ranks.roles.remove(role.id);
            return await ctx.createMessage('ranks-deleteDeletedRole', null, 'channel', {
                id: ctx.suffix
            });
        }

        let roles = ctx.guild.roles.filter(r => guild.ranks.roles.includes(r.id));
        roles = roles.filter(r => r.name.toLowerCase().includes(ctx.suffix.toLowerCase()) || r.id.includes(ctx.suffix));
        let role;

        if (!roles.length) return await ctx.createMessage('ranks-nonExistant');
        else if (roles.length === 1) role = roles[0];
        else role = await bot.lookups._prompt(ctx, ctx.suffix, roles, 'roles');

        if (!role) return;
        if (guild.ranks.userlimits.hasOwnProperty(role.id)) await bot.db[ctx.guild.id].ranks.userlimits.delete(role.id);

        await bot.db[ctx.guild.id].ranks.roles.remove(role.id);
        await ctx.createMessage('ranks-deleteDone', null, 'channel', {
            role: role.name,
            id: role.id
        });
    }
};

exports.limit = {
    desc: 'Change the amount of ranks someone can have at once.',
    usage: '[limit]',
    async main(bot, ctx) {
        if (!ctx.suffix) {
            if (!ctx.settings.guild.ranks.limit) return await ctx.createMessage('ranks-limitUnlimited');

            return await ctx.createMessage('ranks-limitShowLimit', null, 'channel', {
                limit: ctx.settings.guild.ranks.limit
            });
        }

        if (isNaN(ctx.args[0])) return await ctx.createMessage('ranks-limitNotNumber');

        await bot.db[ctx.guild.id].ranks.limit.set(Math.abs(Number(ctx.args[0])));
        await ctx.createMessage('ranks-limitDone', null, 'channel', {
            limit: Math.abs(Number(ctx.args[0]))
        });
    }
};

exports.userlimit = {
    desc: 'Sets the maximum amount of users a rank can have.',
    usage: '<rank name> [limit]',
    async main(bot, ctx) {
        if (!ctx.suffix) return await ctx.createMessage('ranks-userlimitNoArgs');

        let role;

        if (ctx.args.length === 1 || isNaN(ctx.args.slice(-1)[0])) role = await bot.lookups.roleLookup(ctx, ctx.suffix);
        else role = await bot.lookups.roleLookup(ctx, ctx.args.slice(0, -1).join(' '));

        if (!role) return;
        if (!ctx.settings.guild.ranks.roles.includes(role.id)) {
            return await ctx.createMessage('ranks-userlimitRoleNotRank', null, 'channel', {
                role: role.name
            });
        }

        if (ctx.args.length === 1 || isNaN(ctx.args.slice(-1)[0])) {
            if (!ctx.settings.guild.ranks.userlimits[role.id]) return await ctx.createMessage('ranks-userlimitUnlimited', null, 'channel', {
                rank: role.name
            });

            return await ctx.createMessage('ranks-userlimitShowLimit', null, 'channel', {
                rank: role.name,
                limit: ctx.settings.guild.ranks.userlimits[role.id]
            });
        }

        await bot.db[ctx.guild.id].ranks.userlimits[role.id].set(Math.abs(Number(ctx.args.slice(-1)[0])));
        await ctx.createMessage('ranks-userlimitDone', null, 'channel', {
            rank: role.name,
            limit: Math.abs(Number(ctx.args.slice(-1)[0]))
        });
    }
};

exports.remove = {
    desc: 'Removes a rank.',
    usage: '<rank name>',
    async main(bot, ctx) {
        let {guild} = ctx.settings;

        if (!ctx.member.roles.filter(r => guild.ranks.roles.includes(r)).length) return await ctx.createMessage('ranks-removeNoRanks');
        if (!ctx.suffix) return await ctx.createMessage('ranks-removeNoArgs');

        let roles = ctx.guild.roles.filter(r => guild.ranks.roles.includes(r.id));
        roles = roles.filter(r => r.name.toLowerCase().includes(ctx.suffix.toLowerCase()) || r.id.includes(ctx.suffix));
        let role;

        if (!roles.length) return await ctx.createMessage('ranks-nonExistant');
        else if (roles.length === 1) role = roles[0];
        else role = await bot.lookups._prompt(ctx, ctx.suffix, roles, 'roles');

        if (!role) return;

        await ctx.member.removeRole(role.id, 'Self-serve rank system');
        await ctx.createMessage('ranks-removeDone', null, 'channel', {
            role: role.name
        });
    }
};

exports.get = {
    desc: 'Gets a rank.',
    usage: '<rank name>',
    async main(bot, ctx) {
        let {guild} = ctx.settings;

        if (!guild.ranks.roles.length) return await ctx.createMessage('ranks-getNoRanks');
        if (!ctx.suffix) return await ctx.createMessage('ranks-getNoArgs');
        if (guild.ranks.limit !== 0 && ctx.member.roles.filter(r => guild.ranks.includes(r)) >= guild.ranks.limit) {
            return await ctx.createMessage('ranks-getReachedLimit', null, 'channel', {
                limit: guild.ranks.limit
            });
        }

        let roles = ctx.guild.roles.filter(r => guild.ranks.roles.includes(r.id));
        roles = roles.filter(r => r.name.toLowerCase().includes(ctx.suffix.toLowerCase()) || r.id.includes(ctx.suffix));
        let role;

        if (!roles.length) return await ctx.createMessage('ranks-nonExistant');
        else if (roles.length === 1) role = roles[0];
        else role = await bot.lookups._prompt(ctx, ctx.suffix, roles, 'roles');

        if (!role) return;
        if (guild.ranks.userlimits[role.id] && ctx.guild.members.filter(m => m.roles.includes(role.id)).length >= guild.ranks.userlimits[role.id]) {
            return await ctx.createMessage('ranks-getRankUserlimitReached', null, 'channel', {
                rank: role.name,
                limit: guild.ranks.userlimits[role.id]
            });
        }

        await ctx.member.addRole(role.id, 'Self-serve rank system');

        await ctx.createMessage('ranks-getDone', null, 'channel', {
            role: role.name
        });
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
/**
 * @file Various helper methods for looking up different things different ways.
 * @author Ovyerus
 */

const Eris = require('eris');
const {Context} = require(`${__dirname}/CommandHolder`);

class Lookups {
    constructor(bot) {
        this.bot = bot;
    }

    async _prompt(ctx, what, whatArr, type) {
        let formatArr;

        if (type === 'members') {
            whatArr = whatArr.map(x => [x.username, x.discriminator, x.id]).slice(0, 10);
            formatArr = whatArr.map(x => `${whatArr.indexOf(x) + 1}. ${x[0]}#${x[1]}`);
        } else if (['channels', 'roles', 'guilds'].includes(type)) {
            whatArr = whatArr.map(x => [x.name, x.id]).slice(0, 10);
            formatArr = whatArr.map(x => `${whatArr.indexOf(x) + 1}. ${x[0]}`);
        } else throw new Error(`Type '${type}' is not supported.`);

        let msg;
        let delet = await ctx.createMessage({embed: {
            title: `${type[0].toUpperCase() + type.slice(1, -1)} Lookup`,
            description: `Multiple ${type} found matching \`${what}\`\n`
            + `Select the wanted ${type.slice(0, -1)} by typing their corresponding number.\n`
            + `If you cannot find the ${type.slice(0, -1)} you want, try refining your search.\n\n`
            + '```py\n'
            + formatArr.join('\n')
            + '\n```'
        }});

        try {
            msg = await this.bot.awaitMessage(ctx.channel.id, ctx.author.id);
        } catch(err) {
            await ctx.createMessage('Choice timed out.');
            return null;
        }

        let choice = Number(msg.content);

        if (isNaN(choice)) {
            await ctx.createMessage('Invalid response (not a number).');
            return null;
        }

        if (choice > whatArr.length || choice < 0) {
            await ctx.createMessage('Choice is either too large or too small.');
            return null;
        }

        if (type === 'members') choice = ctx.guild.members.get(whatArr[choice - 1][2]);
        else if (type === 'channels') choice = ctx.guild.channels.get(whatArr[choice - 1][1]);
        else if (type === 'roles') choice = ctx.guild.roles.get(whatArr[choice - 1][1]);
        else choice = this.bot.guilds.get(whatArr[choice - 1][1]);

        await delet.delete();
        return choice;
    }

    /**
     * Find a member by part of their name.
     * 
     * @param {Context} ctx Context to use.
     * @param {String} who User to try and find. Can be partial name.
     * @param {Boolean} [notFoundMsg=true] If `false`, suppresses the default not found message.
     * @returns {?Eris.Member} Found member. `null` if none found.
     */
    async memberLookup(ctx, who, notFoundMsg=true) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not a Context object.');
        if (typeof who !== 'string') throw new TypeError('who is not a string.');
        if (typeof notFoundMsg !== 'boolean') throw new TypeError('notFoundMsg is not a boolean.');

        let member;

        if (/^<@!?\d+>$/.test(who)) {
            let id = who.match(/^<@!?(\d+)>$/)[1];
            member = ctx.guild.members.get(id);
        } else {
            let members;

            if (!isNaN(who) && who.length !== 4) members = ctx.guild.members.filter(m => m.id.includes(who) || m.username.includes(who) || (m.nick && m.nick.includes(who)));
            else if (!isNaN(who) && who.length === 4) members = ctx.guild.members.filter(m => who === m.discriminator);
            else members = ctx.guild.members.filter(m => m.username.toLowerCase().includes(who.toLowerCase()) || (m.nick && m.nick.toLowerCase().includes(who.toLowerCase())));

            if (members.length > 1) member = await this._prompt(ctx, who, members, 'members');
            else if (members.length === 1) member = members[0];
            else {
                if (notFoundMsg) await ctx.createMessage('User not found.');
                member = null;
            }
        }

        return member;
    }

    /**
     * Find a channel by part of its name.
     * 
     * @param {Context} ctx Context to use.
     * @param {String} what Channel to try and find. Can be partial name.
     * @param {Boolean} [notFoundMsg=true] If `false`, suppresses the default not found message.
     * @returns {?Eris.GuildChannel} Found channel. `null` if none found.
     */
    async channelLookup(ctx, what, notFoundMsg=true) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not a Context object.');
        if (typeof what !== 'string') throw new TypeError('what is not a string.');
        if (typeof notFoundMsg !== 'boolean') throw new TypeError('notFoundMsg is not a boolean.');
        
        let channel;

        if (/^<#\d+>$/.test(what)) {
            let id = what.match(/^<#(\d+)>$/)[1];
            channel = ctx.guild.channels.get(id);
        } else {
            let channels = ctx.guild.channels.filter(c => !(c instanceof Eris.CategoryChannel));

            if (!isNaN(what)) channels = channels.filter(c => c.id.includes(what) || c.name.includes(what));
            else channels = channels.filter(c => c.name.toLowerCase().includes(what.toLowerCase()));

            if (channels.length > 1) channel = await this._prompt(ctx, what, channels, 'channels');
            else if (channels.length === 1) channel = channels[0];
            else {
                if (notFoundMsg) await ctx.createMessage('Channel not found.');
                channel = null;
            }
        }

        return channel;
    }

    /**
     * Find a role by part of its name.
     * 
     * @param {Context} ctx Context to use.
     * @param {String} what Role to try and find. Can be partial name.
     * @param {Boolean} [notFoundMsg=true] If `false`, suppresses the default not found message.
     * @returns {?Eris.Role} Found role. `null` if none found.
     */
    async roleLookup(ctx, what, notFoundMsg=true) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not a Context object.');
        if (typeof what !== 'string') throw new TypeError('what is not a string.');
        if (typeof notFoundMsg !== 'boolean') throw new TypeError('notFoundMsg is not a boolean.');
        
        let role;

        if (/^<@&\d+>$/.test(what)) {
            let id = what.match(/^<@&(\d+)>$/)[1];
            role = ctx.guild.roles.get(id);
        } else {
            let roles;

            if (!isNaN(what)) roles = ctx.guild.roles.filter(r => r.id.includes(what) || r.name.includes(what));
            else roles = ctx.guild.roles.filter(r => r.name.toLowerCase().includes(what.toLowerCase()));

            if (roles.length > 1) role = await this._prompt(ctx, what, roles, 'roles');
            else if (roles.length === 1) role = roles[0];
            else {
                if (notFoundMsg) await ctx.createMessage('Role not found.');
                role = null;
            }
        }

        return role;
    }

    /**
     * Find a guild by part of its name.
     * 
     * @param {Context} ctx Context to use.
     * @param {String} what Guild to try and find. Can be partial name.
     * @param {Boolean} [notFoundMsg=true] If `false`, suppresses the default not found message.
     * @returns {?Eris.Guild} Found guild. `null` if none found.
     */
    async guildLookup(ctx, what, notFoundMsg=true) {
        if (!(ctx instanceof Context)) throw new TypeError('ctx is not a Context object.');
        if (typeof what !== 'string') throw new TypeError('what is not a string.');
        if (typeof notFoundMsg !== 'boolean') throw new TypeError('notFoundMsg is not a boolean.');

        let guild, guilds;

        if (!isNaN(what)) guilds = this.bot.guilds.filter(g => g.id.includes(what) || g.name.includes(what));
        else guilds = this.bot.guilds.filter(g => g.name.toLowerCase().includes(what.toLowerCase()));

        if (guilds.length > 1) guild = await this._prompt(ctx, what, guilds, 'guilds');
        else if (guilds.length === 1) guild = guilds[0];
        else {
            if (notFoundMsg) await ctx.createMessage('Server not found.');
            guild = null;
        }

        return guild;
    }
}

module.exports = Lookups;
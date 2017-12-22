/**
 * @file Marry your imaginary waifu or someone
 * @author Capuccino
 * @author Ovyerus
 */

exports.commands = [
    'marry',
    'divorce',
    'marrycheck'
];

exports.marry = {
    desc: 'Marry someone.',
    usage: '<mention>',
    async main(bot, ctx) {
        if (ctx.settings.user.partner) return await ctx.createMessage('marry-alreadyWed', null, 'channel', {partner: utils.formatUsername(bot.users.get(ctx.settings.user.partner))});
        if (!ctx.suffix) return await ctx.createMessage('marry-noPartner');

        let user = await bot.lookups.memberLookup(ctx, ctx.suffix);

        if (!user) return;
        if (user.id === ctx.author.id) return await ctx.createMessage('marry-noSelfcest');
        if (user.id === bot.user.id) return await ctx.createMessage('marry-selfMentioned');
        if (await bot.db.has(user.id) && await bot.db[user.id].partner.get) {
            return await ctx.createMessage('marry-partnerIsMarried', null, 'channel', {
                author: ctx.author.mention,
                partner: utils.formatUsername(user)
            });
        }

        await ctx.createMessage('marry-prompt', null, 'channel', {
            author: ctx.author.mention,
            partner: user.mention
        });

        let msg;

        try {
            msg = await bot.awaitMessage(ctx.channel.id, user.id, () => true, 30000);
        } catch(err) {
            return await ctx.createMessage('marry-timeout', null, 'channel', {
                author: ctx.author.mention
            });
        }
            
        if (/^y(es)?$/i.test(msg.content)) {
            await bot.db[ctx.author.id].partner.set(user.id);
            await bot.db[user.id].partner.set(ctx.author.id);

            return await ctx.createMessage('marry-success', null, 'channel', {
                author: ctx.author.mention,
                partner: user.mention
            });
        }
        
        if (/^no?$/i.test(msg.content)) {
            return await ctx.createMessage('marry-decline', null, 'channel', {
                author: ctx.author.mention
            });
        }

        await ctx.createMessage('marry-invalidAnswer', null, 'channel', {
            partner: user.mention
        });
    }
};

exports.divorce = {
    desc: 'Divorce your partner.',
    usage: '<mention>',
    async main(bot, ctx) {
        if (!ctx.settings.user.partner) return await ctx.createMessage('divorce-noPartner');

        let user = bot.users.get(ctx.settings.user.partner);

        if (!user) {
            await bot.db[ctx.author.id].partner.set(null);
            await bot.db[ctx.settings.user.partner].partner.set(null);

            return await ctx.createMessage('divorce-success', null, 'channel', {
                author: ctx.author.mention,
                partner: `<@${ctx.settings.user.partner}>`
            });
        }

        await ctx.createMessage('divorce-prompt', null, 'channel', {
            author: ctx.author.mention,
            partner: user.mention
        });

        let msg;

        try {
            msg = await bot.awaitMessage(ctx.channel.id, user.id, () => true, 30000);
        } catch(err) {
            return await ctx.createMessage('marry-timeout', null, 'channel', {
                author: ctx.author.mention
            });
        }

        if (/^y(es)?$/i.test(msg.content)) {
            await bot.db[ctx.author.id].partner.set(null);
            await bot.db[user.id].partner.set(null);

            return await ctx.createMessage('divorce-success', null, 'channel', {
                author: ctx.author.mention,
                partner: user.mention
            });
        }
        
        if (/^no?$/i.test(msg.content)) {
            return await ctx.createMessage('divorce-fail', null, 'channel', {
                author: ctx.author.mention
            });
        }

        await ctx.createMessage('marry-invalidAnswer', null, 'channel', {
            partner: user.mention
        });

    }
};

exports.marrycheck = {
    desc: "Checks your, or someone else's, partner.",
    usage: '[user]',
    async main(bot, ctx) {
        if (ctx.suffix) {
            let user = await bot.lookups.memberLookup(ctx, ctx.suffix);

            if (!user) return;

            if (await bot.db.has(user.id) && await bot.db[user.id].partner.get) {
                let partner = bot.users.get(await bot.db[user.id].partner.get);

                return await ctx.createMessage('marrycheck-otherUser-hasPartner', null, 'channel', {
                    user: utils.formatUsername(user),
                    partner: utils.formatUsername(partner)
                });
            } else {
                return await ctx.createMessage('marrycheck-otherUser-noPartner', null, 'channel', {
                    user: utils.formatUsername(user)
                });
            }
        }

        if (ctx.settings.user.partner) {
            let partner = bot.users.get(ctx.settings.user.partner);

            return await ctx.createMessage('marrycheck-hasPartner', null, 'channel', {
                partner: utils.formatUsername(partner)
            });
        } else return await ctx.createMessage('marrycheck-noPartner');
    }
};
//* Userinfo - checks the user info
//* based from Spoopy's userinfo commands
//*
//* Contributed by Capuccino

exports.commands = [
    'userinfo'
];

const Promise = require('bluebird');

exports.userinfo = {
    desc: `check yours or someone's userinfo`,
    longDesc: `check someone's or your own userinfo`,
    usage : `<user mention>`,
    main : (bot,ctx) => {
        return new Promise((resolve,reject) => {
            if (ctx.msg.mentions === 0 ) {
                //if no Mention provided, get the author's Info
                var roleColour = ctx.msg.channel.guild.roles.get(ctx.guildBot.roles.sort((a, b) => {
                    return ctx.guildBot.guild.roles.get(b).position - ctx.guildBot.guild.roles.get(a).position;
                })[0]).color;
                ctx.msg.channel.createMessage({embed : {
                    title : `User Info`,
                    description : `${ctx.msg.author.username}#${ctx.msg.author.discriminator}`,
                    thumbnail : {url: ctx.msg.author.avatarURL},
                    color: roleColour,
                    fields : [
                        {name: 'Nickname' , value:ctx.msg.member.nick, inline: true},
                        {name: 'Status' , value:ctx.msg.member.status,inline:true},
                        {name: 'User ID', value: ctx.msg.member.user.id, inline: true}
                    ]
                }}).then(()=> resolve()).catch(err => ([err]));
            } else if (ctx.msg.mentions[0]) {
                ctx.msg.channel.createMessage({embed: {
                    title: 'User Info',
                    description: `${ctx.msg.mentions[0].username}#${ctx.msg.mentions[0].discriminator}`,
                    thumbnail:{url:ctx.msg.mentions[0].avatarURL},
                    fields: {}

                }}).then(()=> resolve()).catch(err => ([err]));
            }
        });
    }
};


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
            if (ctx.user.mention === 0 ) {
                //if no Mention provided, get the author's Info

            } else {

            }
        });
    }
};
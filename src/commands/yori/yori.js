//* a Anime image randomizer
//* Stolen from Yorium (wew lad)
//* because im baka
//*
//* Contributed by Capuccino

exports.commands = [
    'moemoe',
    'kyun' // this would be left undefined though, blame Dean
];

// nya nya nya nya nya nya nya nya nya nya nya nya nya nya nya
// nya nya nya nya nya nya nya nya nya nya nya nya nya nya nya
const noud02 = require(`${__baseDir}/res/yori/fw.json`);
// nya nya nya nya nya nya nya nya  nya nya nya nya nya nya nya
// nya nya nya nya nya nya nya nya nya nya nya nya nya nya nya 

exports.moemoe = {
    desc: 'idk about you but you have problems',
    longDesc : 'dad teach me how to parse JSON pl0x',
    main : (bot,ctx) => {
        return new Promise((resolve,reject) => {
            let url = noud02.link;
            let fgt = url[Math.random() * url.length];

            ctx.msg.channel.createMessage(fgt).then(() => resolve()).catch(err => ([err]));           
        });
    }
};


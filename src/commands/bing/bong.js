/* Bing - hi
 *  Contributed by :
 * | Capuccino
 * 
 */
exports.commands = [
    "bing",
    "bing-img"
];

//can't we use ES6 memes here?
const bing = require("node-bing-api")({ acckey: `${config.bingAPIkey}` });
const config = require(`${__baseDir}/config.json`);
const Promise = require("bluebird");

exports.bing = {
    desc: "queries a search team from Bing.",
    fullDesc: "searches using a term provided using Bing.",
    usage: "<Search term>",
    main: (bot, ctx) => {
        if (ctx.suffix) {
            return new Promise((resolve, reject) => {
                //this would return only the top search result
                //any other entries are disregarded
                bing.web(`${ctx.suffix}`,{top: 1, skip: 0}, (err,res,body) => {
                    var searchResult = body.webPages.value[0,1];
                    ctx.msg.channel.sendMessage(searchResult).then(() => resolve()).catch(err => reject([err]));
                })
            })
        }
    }
},

//refer to https://github.com/goferito/node-bing-api for API usage.
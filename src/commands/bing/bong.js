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
const bing = require("node-bing-api")({});
const Promise = require("bluebird");
const logger = require(`${_baseDir}/lib/logger.js`);

exports.bing = {
    desc:"queries a search team from Bing.",
    fullDesc:"searches using a term provided using Bing.",
    usage: "<Search term>",
    main: (bot,ctx) => {
        return new Promise((resolve,reject) => {
            function searchTerm(search) {
                //placeholder for now
                //refer to http://www.bing.com/developers/s/apibasics.html
                //and https://github.com/goferito/node-bing-api
            }
        })
    }
}
/*
 * owo-whats this - Core file
 * 
 * Contributed by:
 * | Ovyerus
 *
 * Licensed under MIT. Copyright (c) 2016 Capuccino, Ovyerus and the repository contributors.
 */

const fs = require('fs');
const bot = require(`${__baseDir}/bot.js`).bot;

/**
 * Parse a message's content to check if it starts with a registered prefix.
 * @arg {String} content Message content to check.
 * @returns {?String} Content without the prefix if the content starts with a prefix.
 */
function parse(content) {
    return new Promise((resolve, reject) => {
        if (typeof content !== 'string') reject(new Error('content is not a string'));

        var oldContent = content;
        var prefixes = JSON.parse(fs.readFileSync(`${__baseDir}/data/prefixes.json`));
        prefixes.push(`<@${bot.user.id}> `);
        
        if (!content.startsWith(bot.config.mainPrefix)) {
            for (let i in prefixes) {
                if (content.startsWith(prefixes[i])) {
                    content = content.substring(prefixes[i].length);
                    break;
                }
            }
        } else {
            content = content.substring(bot.config.mainPrefix.length);
        }

        if (content !== oldContent) {
            resolve(content);
        } else {
            resolve();
        }
    });
}

module.exports = parse;
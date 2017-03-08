/*
 * Clara - command argument parser
 * 
 * Contributed by Ovyerus
 */

/**
 * Parse a string and return arguments.
 * 
 * @param {String} str String to parse args from.
 * @returns {Object} Object with keys: args, cmd and suffix.
 */
function parseArgs(str) {
    return new Promise((resolve, reject) => {
        if (typeof str !== 'string') {
            reject(new Error('str is not a string.'));
        } else {
            let args;
            let tmp = str.split(' ');
            let cmd = tmp.splice(0, 1)[0];
            let suffix = tmp.join(' ');
            tmp = tmp.join(' ').match(/(["'])(?:(?=(\\?))\2.)*?\1/g).map(v => v.slice(1, -1));
            let tmp2 = str.split(/(["'])(?:(?=(\\?))\2.)*?\1/g).filter(v => v !== '' && v !== '"');
            tmp2[0] = tmp2[0].split(' ');
            tmp2[0].splice(0, 1);
            tmp2[0] = tmp2[0].join(' ');

            if (tmp) {
                tmp2.forEach((v, i) => {
                    if (!(v instanceof Array)) {
                        tmp2[i] = v.split(' ');
                        if (suffix.split(' ')[i].startsWith('"')) tmp2.splice(i, 0, tmp[i]);
                    }
                });
                
                tmp = tmp.filter(v => tmp.indexOf(v) === -1);
                tmp2 = tmp2.concat(tmp.filter(v => tmp2.indexOf(v) === -1))
                tmp2 = [].concat.apply([], tmp2).filter(v => v !== '' && v != undefined);
            }
        }
    });
}

module.exports = parseArgs;
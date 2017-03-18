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
            let tmp = str.split(' ');
            let cmd = tmp.splice(0, 1)[0];
            let suffix = tmp.join(' ');
            tmp = tmp.join(' ').match(/(["'])(?:(?=(\\?))\2.)*?\1/g);
            let args = str.split(/(")(?:(?=(\\?))\2.)*?\1/g).filter(v => v !== '' && v !== '"');
            args[0] = args[0].split(' ');
            args[0].splice(0, 1);
            args[0] = args[0].join(' ');

            if (tmp) {
                tmp = tmp.map(v => v.slice(1, -1));

                args.forEach((v, i) => {
                    if (!(v instanceof Array)) args[i] = v.split(' ');
                });

                args.forEach((v, i) => {
                    if (suffix.split(' ')[i].startsWith('"')) args.splice(i + 1, 0, tmp.shift());
                });

                args = args.concat(tmp.filter(v => args.indexOf(v) === -1));
                args = [].concat.apply([], args).filter(v => v !== '' && v != null);
            } else {
                args.forEach((v, i) => {
                    if (!(v instanceof Array)) args[i] = v.split(' ');
                });

                args = [].concat.apply([], args).filter(v => v !== '' && v != null);
            }

            resolve({args, suffix, cmd});
        }
    });
}

module.exports = parseArgs;
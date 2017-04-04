const QUOTEREGEX = /(")(?:(?=(\\?))\2.)*?\1/g;

/**
 * Parse a string and return arguments for command runner.
 * 
 * @param {String} str String to parse from
 * @returns {Promise<Object>} Object with three keys: args, cmd, raw
 */
function parseArgs(str) {
    return new Promise(resolve => {
        // Type checks
        if (typeof str !== 'string') throw new Error('str is not a string.');

        // Split string and pop command out
        let tmp = str.split(' ');
        let cmd = tmp.splice(0, 1)[0];

        // Match regex for multi word args.
        tmp = tmp.join(' ').match(QUOTEREGEX);
        let args = str.split(QUOTEREGEX).filter(v => v !== '' && v !== '"');
        args[0] = args[0].split(' ').slice(1).join(' ');

        if (tmp) {
            // Remove start and end quotes
            tmp = tmp.map(v => v.slice(1, -1));

            // Split regular args
            args.forEach((v, i) => {
                if (!Array.isArray(v)) args[i] = v.split(' '); 
            });

            // Move multi word args into main array
            args.forEach((v, i) => {
                if (suffix.split(' ')[i].startsWith('"')) args.splice(i + 1, 0, tmp.shift());
            });

            // Concat rest of multi word args, flatten and filter
            args = args.concat(tmp.filter(v => !~args.indexOf(v)));
            args = [].concat.apply([], args).filter(v => v !== '' && v != null);
        } else {
            // Split on spaces
            args.forEach((v, i) => {
                if (!Array.isArray(v)) args[i] = v.split(' ');
            });

            // Flatten and filter
            args = [].concat.apply([], args).filter(v => v !== '' && v != null);
        }

        // String without command in front
        let raw = str.split(cmd).slice(1).join(' ').trim();

        resolve({args, cmd, raw});
    });
}

/**
 * Parse a string and check if it starts with a valid prefixes
 * 
 * @param {String} str String to parse
 * @param {(String|Regex)[]} prefixes Array of prefixes
 * @returns {Promise<String?>} String without prefix in front. Null if nothing matches.
 */
function parsePrefix(str, prefixes) {
    return new Promise(resolve => {
        // Type checks
        if (typeof str !== 'string') throw new Error('str is not a string.');
        if (!Array.isArray(prefixes)) throw new Error('prefixes is not an array.');

        // Var for checking if content is altered or not
        let oldStr = str;

        for (let prfx of prefixes) {
            if (typeof prfx === 'string') {
                // Handle string prefixes
                str = str.startsWith(prfx) ? str.slice(prfx.length) : str;
                if (str !== oldStr) break;
            } else if (prfx instanceof RegExp) {
                // Stringify regex prefixes and match
                let tmp = prfx.toString().replace(/^\//, '').replace(/\/$/, '');
                tmp = tmp.startsWith('^') ? tmp : `^${tmp}`;
                tmp = new RegExp(tmp);
                str = str.replace(tmp, '');
                if (str !== oldStr) break;
            }
        }

        // If str isn't altered, return null
        if (str !== oldStr) {
            resolve(str);
        } else {
            resolve(null);
        }
    });
}

module.exports = {parseArgs, parsePrefix};
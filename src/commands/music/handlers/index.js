const fs = require('fs');

module.exports = bot => {
    let files = fs.readdirSync(__dirname);
    let holder = {};

    files.filter(f => f.endsWith('js')).forEach(f => {
        holder[f.slice(0, -3)] = new (require(`${__dirname}/${f}`))(bot);
    });

    return holder;
};
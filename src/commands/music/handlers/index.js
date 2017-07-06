const fs = require('fs');

module.exports = bot => {
    let files = fs.readdirSync(__dirname);
    let holder = {};

    files.filter(f => f.endsWith('js') && f !== 'index.js').forEach(f => {
        let a = require(`${__dirname}/${f}`);
        holder[f.slice(0, -3)] = new a(bot);
    });

    return holder;
};
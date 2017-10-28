const fs = require('fs');

module.exports = bot => {
    let files = fs.readdirSync(__dirname).filter(v => v !== 'index.js' && v.endsWith('.js'));

    files.forEach(v => {
        require(`${__dirname}/${v}`)(bot);
        logger.info(`Loaded event "${v.slice(0, -3)}"`);
    });
};
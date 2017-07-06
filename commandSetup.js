/*
 * Script to automatically setup a command folder with basic files.
 */

const fs = require('fs');
const cmdDefault = name =>
`/*
 * ${name}.js - Description here
 * 
 * Contributed by YOUR NAME HERE
 */

exports.commands = ['${name}'];

exports.${name} = {
    desc: '',
    usage: '',
    main(bot, ctx) {
        return new Promise((resolve, reject) => {
            
        });
    }
};`;

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('Please enter the name of the command you wish to setup\n> ');

process.stdin.once('data', txt => {
    let cmdName = txt.slice(0, -2).toLowerCase().replace(/\s+/g, '-');
    let cmdPath = `${__dirname}/src/commands/${cmdName}`;

    fs.mkdir(cmdPath, err => {
        if (err) throw err;
        console.log('Created command directory.');

        fs.writeFile(`${cmdPath}/package.json`, JSON.stringify({main: `${cmdName}.js`, dependencies: {}}, null, '    '), err => {
            if (err) throw err;
            console.log('Created package.json');

            fs.writeFile(`${cmdPath}/${cmdName}.js`, cmdDefault(cmdName), err => {
                if (err) throw err;
                console.log('Created main command file.\n');

                console.log('Finished command setup.');
                console.log(`Files can be found in src/commands/${cmdName}`);
                process.exit();
            });
        });
    });
});
var nconf = require('nconf');
var env = process.env.NODE_ENV || 'development';
var configFile = 'config/config.' + env + '.json';

// Config values are determined in order from top to bottom, i.e.
//   1. Use command-line arguments first,
//   2. otherwise, use environment variables,
//   3. otherwise, use the 'config.#{env}.json' file (e.g. 'config.test.json'),
//   4. lastly, use the defaults specified here.
// A good way to override any configs is to use command-line args or
// environment variables.
nconf
  .argv()
  .env()
  .file({ file: configFile })
  .defaults({
    'port': 8899
  });

exports = module.exports = nconf;

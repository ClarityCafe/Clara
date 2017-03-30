/* Clara - Globals
 * 
 * 
 * 
 * Contributed by Capuccino.
 */

global.__baseDir = __dirname;
global.Promise = require('bluebird');
global.logger = require(`${__dirname}/modules/logger`);
global.localeManager = new (require(`${__dirname}/modules/LocaleManager`))();

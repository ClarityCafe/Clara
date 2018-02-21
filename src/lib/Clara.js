/**
 * @file Class file for Clara, extending the Eris client.
 * @author Ovyerus
 */

const Eris = require('eris');
const got = require('got');
const fs = require('fs');
const path = require('path');
const {URL} = require('url');
const Redite = require('redite');
const {CommandHolder} = require(`${__dirname}/modules/CommandHolder`);
const LocaleManager = require(`${__dirname}/modules/LocaleManager`);
const Lookups = require(`${__dirname}/modules/Lookups`);

/**
 * Main class for Clara.
 * 
 * @prop {String[]} admins Array of people who have owner-like permissions over the bot.
 * @prop {Boolean} allowCommandUse If commands can be run.
 * @prop {String[]} blacklist Array of people who cannot use the bot.
 * @prop {CommandHolder} commands Command holder object.
 * @prop {String[]} commandFolders todo
 * @prop {ClaraConfig} config Configuration passed during construction.
 * @prop {Redite} db Database connection manager.
 * @prop {Boolean} loadCommands If the bot should load commands or not.
 * @prop {String[]} prefixes Array of all the prefixes that are able to be used by the bot.
 * @prop {Object} settings Settings cache for users and guilds.
 */
class Clara extends Eris.Client {
    /**
     * Creates a new Clara instance.
     * 
     * @param {ClaraConfig} config Configuration settings
     * @param {Object} options Eris client options.
     * @see https://abal.moe/Eris/docs/Client
     */
    constructor(config, options = {}) {
        if (!config && typeof config !== 'object') throw new TypeError('config is not an object.');
        
        super(config.general.token, options);

        this.lookups = new Lookups(this);
        this.localeManager = new LocaleManager();
        this.commands = new CommandHolder(this);
        this.db = new Redite({url: config.general.redisURL || config.general.redisUrl || 'redis://127.0.0.1/0'});

        this.config = config;

        this.loadCommands = true;
        this.allowCommandUse = false;
    }

    async connect() {
        let {general} = this.config;

        if (!general.ownerID) throw new Error('Configuration is missing general.ownerID');
        if (!general.token) throw new Error('Configuration is missing general.token');
        if (!general.mainPrefix) throw new Error('Configuration is missing general.mainPrefix')
        if (general.maxShards === 0) throw new Error('config.general.maxShards cannot be 0.');
        if (!general.maxShards) throw new Error('Configuration is missing general.maxShards');

        if (!general.redisURL) throw new Error('Configuration is missing general.redisURL');
        else {
            let parsed = new URL(general.redisURL);

            if (parsed.protocol !== 'redis:') throw new Error(`Invalid protocol for config.general.redisURL: "${parsed.protocol}" must instead be "redis:"`);
            if (!parsed.host) throw new Error('config.general.redisURL is missing host.');

            if (parsed.pathname && parsed.pathname !== '/') {
                if (isNaN(parsed.pathname.slice(1))) throw new Error('Invalid database for config.general.redisURL. Must be a number.');
                if (!(0 <= Number(parsed.pathname.slice(1)) < 16)) throw new Error(`Invalid database for config.general.redisURL. Must be between 0 and 15, inclusive.`);
            }
        }

        await super.connect();
    }

    /**
    * Wait for a message in the specified channel from the specified user.
    *
    * @param {String} channelID ID of channel to wait in.
    * @param {String} userID ID of user to wait for.
    * @param {Function} [filter] Filter to pass to message. Must return true.
    * @param {Number} [timeout=15000] Time in milliseconds to wait for message.
    * @returns {Promise<Eris.Message>} Awaited message.
    */
    awaitMessage(channelID, userID, filter = () => true, timeout = 15000) {
        return new Promise((resolve, reject) => {
            if (!channelID || typeof channelID !== 'string') {
                reject(new TypeError('channelID is not string.'));
            } else if (!userID || typeof userID !== 'string') {
                reject(new TypeError('userId is not string.'));
            } else {
                var responded, rmvTimeout;

                var onCrt = msg => {
                    if (msg.channel.id === channelID && msg.author.id === userID && filter(msg)) responded = true;

                    if (responded) {
                        this.removeListener('messageCreate', onCrt);
                        clearInterval(rmvTimeout);
                        resolve(msg);
                    }
                };

                this.on('messageCreate', onCrt);

                rmvTimeout = setTimeout(() => {
                    if (!responded) {
                        this.removeListener('messageCreate', onCrt);
                        reject(new Error('Message await expired.'));
                    }
                }, timeout);
            }
        });
    }

    /**
     * Sends guild count to various bot sites.
     */
    async postGuildCount() {
        if (this.config.botlistTokens.dbots) {
            try {
                await got(`https://bots.discord.pw/api/bots/${this.user.id}/stats`, {
                    method: 'POST',
                    headers: {
                        Authorization: this.config.botlistTokens.dbots,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        server_count: this.guilds.size
                    })
                });
            } catch(err) {
                logger.error(`Error sending stats to bots.discord.pw:\n${err}`);
                return;
            }

            logger.info('Sent stats to bots.discord.pw.');
        }

        if (this.config.botlistTokens.dbl) {
            try {
                await got(`https://discordbots.org/api/bots/stats`, {
                    method: 'POST',
                    headers: {
                        Authorization: this.config.botlistTokens.dbl,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        server_count: this.guilds.size,
                        shard_count: this.shards.size
                    })
                });
            } catch(err) {
                logger.error(`Error sending stats to discordbots.org:\n${err}`);
                return;
            }

            logger.info('Sent stats to discordbots.org.');
        }
    }

    /**
     * POST something to Hastebin.
     * 
     * @param {String} str Content to POST.
     * @returns {Promise<String>} Returned key.
     */
    async hastePost(str) {
        if (typeof str !== 'string') throw new TypeError('str is not a string');

        let res = await got('https://hastebin.com/documents', {
            method: 'POST',
            body: str
        });

        return JSON.parse(res.body).key;
    }

    /**
     * Check if a user has elevated bot permissions.
     * 
     * @param {String} userID ID of the user to check.
     * @returns {Boolean} If the user has perms.
     */
    checkBotPerms(userID) {
        return userID === this.config.general.ownerID || this.admins.includes(userID);
    }

    /**
     * Check if a user is blacklisted.
     * 
     * @param {String} userID ID of the user to check.
     * @returns {Boolean} If the user is blacklisted.
     */
    isBlacklisted(userID) {
        return this.blacklist.includes(userID);
    }

    /**
     * Gets settings from the database, and sets them if they don't exist.
     * 
     * @returns {Object} Settings from the database.
     */
    async getDataSettings() {
        if (!await this.db.settings.get) {
            await this.db.settings.set({
                prefixes: [],
                admins: [],
                blacklist: [],
                unloadedModules: []
            });
        } else {
            let res = await this.db.settings.get;
            let noHave = ['prefixes', 'admins', 'blacklist', 'unloadedModules'].filter(v => !Object.keys(res).includes(v));

            for (let key of noHave) await this.db.settings[key].set([]);
        }

        return this.db.settings.get;
    }

    /**
     * Adds a prefix.
     * 
     * @param {String} prefix Prefix to add.
     */
    async addPrefix(prefix) {
        if (typeof prefix !== 'string') throw new TypeError('prefix is not a string.');

        await this.db.settings.prefixes.push(prefix);
        this.prefixes.push(prefix);
    }

    /**
     * Removes a prefix.
     * 
     * @param {String} prefix Prefix to remove.
     */
    async removePrefix(prefix) {
        if (typeof prefix !== 'string') throw new TypeError('prefix is not a string.');

        await this.db.settings.prefixes.remove(prefix);
        this.prefixes.splice(this.prefixes.indexOf(prefix), 1);
    }

    /**
     * Add's a user as an admin.
     * 
     * @param {String} userID User to add as an admin. 
     */
    async addAdmin(userID) {
        if (typeof userID !== 'string') throw new TypeError('userId is not a string.');

        await this.db.settings.admins.push(userID);
        this.admins.push(userID);
    }

    /**
     * Removes a user as an admin.
     * 
     * @param {String} userID User to remove as an admin.
     */
    async removeAdmin(userID) {
        if (typeof userID !== 'string') throw new TypeError('userId is not a string.');

        await this.db.settings.admins.remove(userID);
        this.admins.splice(this.admins.indexOf(userID), 1);
    }

    /**
     * Adds a user to the blacklist.
     * 
     * @param {String} userID User to add to the blacklist.
     */
    async addBlacklist(userID) {
        if (typeof userID !== 'string') throw new TypeError('userId is not a string.');

        await this.db.settings.blacklist.push(userID);
        this.blacklist.push(userID);
    }

    /**
     * Removes a user from the blacklist.
     * 
     * @param {String} userID User to remove from the blacklist.
     */
    async removeBlacklist(userID) {
        if (typeof userID !== 'string') throw new TypeError('userId is not a string.');

        await this.db.settings.blacklist.remove(userID);
        this.blacklist.splice(this.blacklist.indexOf(userID), 1);
    }

    /**
     * Marks a module as persistently unloaded.
     * 
     * @param {String} mod Module to mark as unloaded.
     */
    async addUnloadedModule(mod) {
        if (typeof mod !== 'string') throw new TypeError('mod is not a string.');

        await this.db.settings.unloadedModules.push(mod);
        this.unloadedModules.push(mod);
    }

    /**
     * Unmarks a module as persistently unloaded.
     * 
     * @param {String} mod Module to unmark as unloaded.
     */
    async removeUnloadedModule(mod) {
        if (typeof mod !== 'string') throw new TypeError('mod is not a string.');

        await this.db.settings.unloadedModules.remove(mod);
        this.unloadedModules.splice(this.unloadedModules.indexOf(mod), 1);
    }

    /**
    * Initialise settings for a guild.
    *
    * @param {String} guildID ID of guild to init settings for.
    * @returns {Object} Settings for the guild.
    */
    async initGuildSettings(guildID) {
        if (typeof guildID !== 'string') throw new TypeError('guildID is not a string.');
        if (await this.db.has(guildID)) return await this.db.guildID.get;

        let settings = {
            id: guildID,
            locale: 'en-UK',
            greeting: {
                enabled: false,
                channelID: null,
                message: null
            },
            goodbye: {
                enabled: false,
                channelID: null,
                message: null
            },
            ranks: {
                limit: 0,
                roles: [],
                userlimits: {}
            }
        };
        
        await this.db[guildID].set(settings);
        return settings;
    }

    /**
    * Get the settings for a guild.
    *
    * @param {String} guildID ID of guild to get settings for
    * @returns {Object} Settings for the guild.
    */
    async getGuildSettings(guildID) {
        if (typeof guildID !== 'string') throw new TypeError('guildID is not a string.');
        if (!await this.db.has(guildID)) return await this.initGuildSettings(guildID);

        return await this.db[guildID].get;
    }

    /**
    * Initialize settings for a user.
    *
    * @param {String} userID ID of user to init settings for.
    * @returns {Object} Settings for the user.
    */
    async initUserSettings(userID) {
        if (typeof userID !== 'string') throw new TypeError('userID is not a string.');
        if (await this.db.has(userID)) return await this.db[userID].get;

        let settings = {
            id: userID,
            locale: 'en-UK',
            partner: null
        };

        await this.db[userID].set(settings);
        return settings;
    }

    /**
    * Get the settings for a user.
    *
    * @param {String} userID ID of user to get settings for.
    * @returns {Object} Settings for the user.
    */
    async getUserSettings(userID) {
        if (typeof userID !== 'string') throw new TypeError('userID is not a string.');
        if (!await this.db.has(userID)) return await this.initUserSettings(userID);
        
        return await this.db[userID].get;
    }

    /**
     * Check if the bot has a permission in a channel.
     * 
     * @param {String} permission The permission to check.
     * @param {Eris.Channel} channel The channel to check.
     * @returns {Boolean} If the user has the permission.
     */
    hasPermission(permission, channel) {
        // Check if permission actually exists.
        if (!Object.keys(Eris.Constants.Permissions).includes(permission)) return false;

        return channel.permissionsOf(this.user.id).has(permission);
    }

    get commandFolders() {
        let cmdDirs = fs.readdirSync(this.commandsDir).map(d => ({[d]: fs.readdirSync(`${this.commandsDir}/${d}`)}));
        let allCmds = {};
    
        // Go from an array of objects to an object of arrays.
        cmdDirs.forEach(d => Object.assign(allCmds, d));
        cmdDirs = cmdDirs.map(e => Object.keys(e)[0]);
    
        // Turn folder names into proper paths for future ease (also make sure we only get folders).
        allCmds = Object.entries(allCmds).map(x => x[1].filter(y => fs.statSync(`${this.commandsDir}/${x[0]}/${y}`).isDirectory()));
        allCmds = allCmds.map((v, i) => v.map(x => `${this.commandsDir}/${cmdDirs[i]}/${x}`));
        allCmds = [].concat.apply([], allCmds);

        return allCmds;
    }
}

/**
 * Configuration used for Clara instances.
 * @see config.example.yaml
 * 
 * @prop {Object} tokens Tokens used by APIs for different commands.
 * @prop {String} tokens.youtube
 * @prop {String} tokens.soundcloud If this is not set, this will be automatically scraped.
 * @prop {String} tokens.ibsearch
 * @prop {String} tokens.osu
 * @prop {String} tokens.saucenao
 * @prop {String} tokens.nasa
 * 
 * @prop {Object} botlistTokens Tokens used for sending stats to various bot list sites.
 * @prop {String} botlistTokens.dbl discordbots.org token.
 * @prop {String} botlistTokens.dbots bots.discord.pw token.
 * 
 * @prop {Object} development Various debugging options.
 * @prop {Boolean} development.debug
 * @prop {Boolean} development.promiseWarnings
 * 
 * @prop {Object} general Configuration options for the main bot.
 * @prop {String} general.ownerID
 * @prop {String} general.token
 * @prop {String} general.redisURL
 * @prop {String} general.mainPrefix
 * @prop {Number} general.maxShards
 * 
 * 
 * @prop {Object} discord Miscellaneous Discord-related options.
 * @prop {String} discord.status
 * @prop {Object} discord.game
 * @prop {String} discord.game.url
 * @prop {Integer} discord.game.type
 * @prop {String} discord.game.name
 */
class ClaraConfig { // eslint-disable-line
    // Only here for documentation purposes.
}

module.exports = Clara;
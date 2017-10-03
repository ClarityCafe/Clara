/**
 * @file Main locale manager.
 * @author Ovyerus
 */

/* eslint-env node */

const fs = require('fs');
const path = require('path');
const localeDir = path.resolve('./assets/locales');

/**
 * Object for managing locales and translating strings
 * 
 * @prop {String} fallbackLocale The locale to fallback if it can't translate the string for some reason.
 * @prop {Object} locales Object of locales currently loaded.
 * @prop {String} localeDir The directory where locales are stored.
 */

class LocaleManager {

    /**
     * Create the locale manager object.
     */
    constructor() {
        this.fallbackLocale = 'en-UK';
        this.locales = {};
        this.localeDir = localeDir;
        this.loaded = false;
    }

    loadLocales(bot) {
        let locales = fs.readdirSync(this.localeDir);

        for (let locale of locales) {
            if (!locale.endsWith('.json')) continue;

            this.locales[locale.slice(0, -5)] = JSON.parse(fs.readFileSync(`${this.localeDir}/${locale}`));
        }

        // Get command folders (should make this a function).
        let cmdDirs = fs.readdirSync(bot.commandsDir).map(d => ({[d]: fs.readdirSync(`${bot.commandsDir}/${d}`)}));
        let allCmds = {};
    
        // Go from an array of objects to an object of arrays.
        cmdDirs.forEach(d => Object.assign(allCmds, d));
        cmdDirs = cmdDirs.map(e => Object.keys(e)[0]);
    
        // Turn folder names into proper paths for future ease (also make sure we only get folders).
        allCmds = Object.entries(allCmds).map(x => x[1].filter(y => fs.statSync(`${bot.commandsDir}/${x[0]}/${y}`).isDirectory()));
        allCmds = allCmds.map((v, i) => v.map(x => `${bot.commandsDir}/${cmdDirs[i]}/${x}`));
        allCmds = [].concat.apply([], allCmds);

        for (let cmd of allCmds) {
            let _locales;
            try {
                _locales = fs.readdirSync(`${cmd}/locales`);
            } catch(err) {
                continue;
            }

            for (let locale of _locales) {
                if (!locale.endsWith('.json')) continue;
                Object.assign(this.locales[locale.slice(0, -5)], JSON.parse(fs.readFileSync(`${cmd}/locales/${locale}`)));
            }
        }

        this.loaded = true;
    }

    /**
     * Return's the value of 'key' in the locale specified, or fallback to the fallback language.
     *
     * @param {String} key The key whose value to translate
     * @param {String} locale Name of locale to translate too.
     * @param {Object} [replacers] Object of values in string.
     * @returns {String} Translated string.
     */
    t(key, locale = this.fallbackLocale, replacers = {}) {
        if (typeof key !== 'string') {
            throw new Error('key is not a string');
        } else if (typeof locale !== 'string') {
            throw new Error('locale is not a string');
        } else if (!this.locales[locale]) {
            throw new Error(`${locale} is not a valid locale`);
        } else {
            let res = this.locales[locale][key] || this.locales[this.fallbackLocale][key] || key;

            if (/.*{{.+}}.*/g.test(res) && Object.keys(replacers).length !== 0) {
                for (let rep of Object.keys(replacers)) {
                    res = res.replace(new RegExp(`{{${rep}}}`, 'g'), replacers[rep]);
                }
            }

            return res;
        }
    }
}

module.exports = LocaleManager;
/**
 * @file Locale manager.
 * @author Ovyerus
 */

const fs = require('fs');
const path = require('path');
const localeDir = path.resolve(`${__dirname}`, '../', '../assets/locales'); 


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

        for (let cmd of bot.commandFolders) {
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
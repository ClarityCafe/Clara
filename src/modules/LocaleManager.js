/*
 * Clara - locale manager
 *
 * Contributed by Capuccino and Ovyerus
 */

/* eslint-env node */

const fs = require('fs');
const localeDir = `${__baseDir}/res/locales`;

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
    }

    /**
     * Load all locales in the locale directory.
     *
     * @returns {Promise} .
     */
    loadLocales() {
        return new Promise((resolve, reject) => {
            fs.readdir(localeDir, (err, locales) => {
                if (err) {
                    reject(err);
                } else {
                    for (let locale of locales) {
                        if (!locale.endsWith('.json')) continue;
                        let localeParsed = JSON.parse(fs.readFileSync(`${localeDir}/${locale}`));
                        this.locales[locale.substring(0, locale.indexOf('.js'))] = localeParsed;
                    }

                    fs.readdir(`${__baseDir}/commands`, (err, fldrs) => {
                        if (err) {
                            reject(err);
                        } else {
                            for (let fldr of fldrs) {
                                let owo = fs.readdirSync(`${__baseDir}/commands/${fldr}`);
                                if (owo.indexOf('locales') !== -1) {
                                    let locales = fs.readdirSync(`${__baseDir}/commands/${fldr}/locales`);
                                    for (let locale of locales) {
                                        if (!locale.endsWith('.json')) continue;
                                        let r = JSON.parse(fs.readFileSync(`${__baseDir}/commands/${fldr}/locales/${locale}`));
                                        let l = locale.substring(0, locale.indexOf('.json'));
                                        this.locales[l] = Object.assign({}, this.locales[l], r);
                                    }
                                }
                            }

                            resolve();
                        }
                    });
                }
            });
        });
    }

    /**
     * Return's the value of 'key' in the locale specified, or fallback to the fallback language.
     *
     * @param {String} key The key whose value to translate
     * @param {String} locale Name of locale to translate too.
     * @param {Object=} replacers Object of values in string.
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
            let res = this.locales[locale][key] || this.locales[this.fallbackLocale][key] || '';

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
/**
 * @file Sagiri thin client for Clara
 * @author Capuccino
 * @author Ovyerus
 */

const FormData = require('form-data');
const fs = require('fs');

/** 
 * Query handler for SauceNAO.
 * 
 * @prop {String} key API key
 * @prop {Number} numRes Amount of responses returned from the API.
 */
class SauceHandler {
    /**
     * @param {String} key API Key for SauceNAO
     * @param {Number} numRes amount of responses you want returned from the API. Default is 5 Responses.
     * @see {link} https://saucenao.com/user.php?page=search-api
     */
    constructor(key, numRes) {
        if (!key) throw new TypeError('No API key provided!');
        this.key = key,
        this.numRes = numRes || 5;
    }

    /**
     * Gets the source and outputs it in your preferred output type
     * 
     * @param {String} file Either a file or URL that you want to find the source of.
     * @returns {Promise<Object>} JSON that contains the closest match.
     * @example client.getSauce(path/link).then(console.log);
     */
    getSauce(file) {
        return new Promise((resolve, reject) => {
            if (typeof file !== 'string') {
                reject(new Error('file is not a string.'));
            } else {
                let form = new FormData();

                form.append('api_key', this.key);
                form.append('output_type', 2);
                form.append('numres', this.numRes);

                if (fs.existsSync(file)) {
                    form.append('file', fs.createReadStream(file));
                } else {
                    form.append('url', file);
                }

                form.submit('https://saucenao.com/search.php', (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        let chunked = '';

                        res.setEncoding('utf-8');
                        res.on('data', chunk => chunked += chunk);

                        res.on('end', () => {
                            let allResults = JSON.parse(chunked).results;
                            let result;

                            if (allResults.length > 1) {
                                result = allResults.sort((a, b) => Number(b.header.similarity) - Number(a.header.similarity))[0];
                            } else if (allResults.length === 1) {
                                result = allResults[0];
                            } else {
                                reject(new Error('No results.'));
                            }

                            // TODO: go through the various results and find out how to reliably construct a url
                            if (result) {
                                let returner = {
                                    similarity: Number(result.header.similarity),
                                    original: result
                                };

                                resolve(returner);
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = SauceHandler;
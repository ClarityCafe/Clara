'use strict';

const Component = require('./Component')
    , ApiConstants = require('../Constants').API;

/**
 * Beatmap-related API component
 */
class BeatmapComponent extends Component {
    _get(letter, id, mode, limit, includeConverts, lookupType) {
        let options = {};
        options[letter] = id;
        if (mode)
            options.m = mode;
        if (limit)
            options.limit = limit;
        if (includeConverts)
            options.a = includeConverts;
        if (lookupType)
            options.type = lookupType;

        return this.api.requester.get(ApiConstants.BEATMAPS_GET, options, true, true);
    }

    /**
     * Get beatmaps via beatmap set ID.
     * @param {String} setId The set ID to lookup beatmaps from.
     * @param {Mode} [mode] The gamemode of maps to find.
     * @param {Number} [limit] The limit of maps to find.
     * @param {Converts} [includeConverts] If converts should be included in the lookup.
     * @return {Promise<Object[]>} The object array from the API.
     */
    getBySetId(setId, mode, limit, includeConverts) {
        return this._get('s', setId, mode, limit, includeConverts);
    }

    /**
     * Get beatmaps via beatmap ID.
     * @param {String} beatmapId The beatmap ID to lookup beatmaps from.
     * @param {Mode} [mode] The gamemode of maps to find.
     * @param {Number} [limit] The limit of maps to find.
     * @param {Converts} [includeConverts] If converts should be included in the lookup.
     * @return {Promise<Object[]>} The object array from the API.
     */
    getByBeatmapId(beatmapId, mode, limit, includeConverts) {
        return this._get('b', beatmapId, mode, limit, includeConverts);
    }

    /**
     * Get beatmaps via user ID.
     * @param {String} user The user to lookup beatmaps from.
     * @param {Mode} [mode] The gamemode of maps to find.
     * @param {Number} [limit] The limit of maps to find.
     * @param {Converts} [includeConverts] If converts should be included in the lookup.
     * @param {LookupType} [lookupType] The type of lookup of the user.
     * @return {Promise<Object[]>} The object array from the API.
     */
    getByUser(user, mode, limit, includeConverts, lookupType) {
        return this._get('u', user, mode, limit, includeConverts, lookupType);
    }

    /**
     * Get beatmaps via user ID.
     * @param {String} hash The hash of the beatmap to lookup.
     * @param {Mode} [mode] The gamemode of maps to find.
     * @param {Number} [limit] The limit of maps to find.
     * @param {Converts} [includeConverts] If converts should be included in the lookup.
     * @return {Promise<Object[]>} The object array from the API.
     */
    getByBeatmapHash(hash, mode, limit, includeConverts) {
        return this._get('h', hash, mode, limit, includeConverts);
    }
}

module.exports = BeatmapComponent;
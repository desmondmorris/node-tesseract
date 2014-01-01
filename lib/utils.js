'use strict';

module.exports.merge = function (defaults, options) {
    defaults = defaults || {};
    if (options && typeof options === 'object') {
        var i = 0,
            keys = Object.keys(options);

        for (i = 0; i < keys.length; i += 1) {
            if (options[keys[i]] !== undefined) {
                defaults[keys[i]] = options[keys[i]];
            }
        }
    }
    return defaults;
};

/**
 * Created by yang on 2017/2/21.
 */

(function (_) {

    _.localData = {};

    _.localData.write = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPLocalDataPlugin",
            "write",
            [
                {
                    identifier:_options.identifier,
                    data:_options.data
                }
            ]
        );
    };
    _.localData.read = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPLocalDataPlugin",
            "read",
            [
                {
                    identifier:_options.identifier
                }
            ]
        );
    };


})(cmp);
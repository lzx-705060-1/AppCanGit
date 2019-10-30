/**
 * Created by yang on 2017/2/21.
 */

(function (_) {

    _.schedule = {};

    _.schedule.writeConfig = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPSchedulePlugin",
            "writeConfig",
            [
                {
                    data:_options.data
                }
            ]
        );
    };
    _.schedule.readConfig = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPSchedulePlugin",
            "readConfig",
            [{}]
        );
    };


})(cmp);
/**
 * Created by guoyl on 2016-10-31.
 */
(function (_) {

//===========================================cmp  消息推送设置插件 start===================================//
    _.requestTimer = {};
    /**
     * 开启
     * @param options
     */
    _.requestTimer.start = function (options) {
        var _options = {
            success: null,
            error: null,
            "timeInterval":0,
            "url":"", // 请求url地址
            "parameter":"", //请求参数
            "requestMethod":"GET",// 请求类型get、post,
            "headers":"",
            "timeout":""
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPRequestTimerPlugin",
            "start",
            [
                {
                    "timeInterval": _options.timeInterval,
                    "url":_options.url, // 请求url地址
                    "parameter":_options.parameter, //请求参数
                    "requestMethod":_options.requestMethod,// 请求类型get、post,
                    "headers":_options.headers,
                    "timeout":_options.timeout
                }
            ]
        );
    };

    /**
     * 停止
     * @param options
     */
    _.requestTimer.invalidate = function (options) {
        var _options = {
            success: null,
            error: null,
            "url":"" // 请求url地址
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPRequestTimerPlugin",
            "invalidate",
            [
                {
                    "url":_options.url
                }
            ]
        );
    };

})(cmp);
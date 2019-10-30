/**
 * Created by youlin on 2016/9/13.
 */
(function(_){

    _.shell = {};
    //=====================================================CMP壳检查更新 start==============================================//
    /**
     * 获取cmp壳的当前版本号
     */
    _.shell.version = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPShellPlugin",
            "version",
            [
                {
                }
            ]
        );
    };

    /**
     * 检查cmp更新
     * 请求服务器端url地址，根据返回的值判断是否更新
     *@return
     * downloadurl 下载地址
     * lastversion 最新版本多少
     * msgcode 3-代表强制更新  4-代表选择性更新
     * message 更新内容
     *
     */
    _.shell.checkVersion = function (options) {
        var _options = {
            success: null,
            error: null,
            "checkUpdateUrl":"" // 更新更新的服务器地址
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPShellPlugin",
            "checkVersion",
            [
                {
                    "checkUpdateUrl":_options.checkUpdateUrl
                }
            ]
        );
    };

    /**
     * 打开下载地址
     * url
     *
     */
    _.shell.openDownloadUrl = function (options) {
        var _options = {
            success: null,
            error: null,
            "url":""
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPShellPlugin",
            "openDownloadUrl",
            [
                {
                    "url":_options.url
                }
            ]
        );
    };
    //=====================================================CMP壳检查更新 end==============================================//

})(cmp);
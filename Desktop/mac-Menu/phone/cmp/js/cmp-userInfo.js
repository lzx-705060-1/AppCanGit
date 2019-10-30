(function(_){
    // ===========================================cmp  当前登录用户操作插件 start===================================//

    _.userInfo = {};
    /**
     * 设置当前登录用户信息
     * @param options
     */
    _. userInfo.setCurrentUser = function (options) {
        //TODO 这里临时存储一个key，后面具体的登录场景在确定
        var _options = {
            currentUser:"",
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "UserInfoPlugin",
            "setCurrentUser",
            [
                {
                    "currentUser":_options.currentUser
                }
            ]
        );
    };


    /**
     *得到当前登录用户信息
     * @param options
     */
    _. userInfo.clearCurrentUser = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "UserInfoPlugin",
            "clearCurrentUser",
            [
                {
                }
            ]
        );
    };
// ===========================================cmp  当前登录用户操作插件 end===================================//
})(cmp);
/**
 * Created by wujs on 16/10/13.
 */
(function(_){
    /**
     *
     *加解密
     * value 为一个数组
     */
    _.encrypt = {};
    //加密
    _.encrypt.encryptM3Login = function (options) {
        var _options = {
            success: null,
            error: null,
            value:""
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPEncryptPlugin",
            "encryptM3Login",
            [
                {
                    "value": _options.value
                }
            ]
        );
    };

    //解密
    _.encrypt.decryptM3Login = function (options) {
        var _options = {
            success: null,
            error: null,
            value:""
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPEncryptPlugin",
            "decryptM3Login",
            [
                {
                    "value": _options.value
                }
            ]
        );
    };


})(cmp);
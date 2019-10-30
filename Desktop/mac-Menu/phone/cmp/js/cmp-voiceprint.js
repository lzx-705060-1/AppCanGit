(function(_){
    //声纹插件
    _.voiceprint = {};

    //设备注册
    _.voiceprint.register = function(options){
        var _options = {
            success: null,
            error: null,
            authId:null// 声纹AuthId，用户在云平台的身份标识，也是声纹模型的标识
                        // 请使用英文字母或者字母和数字的组合，6-18位数字字母下划线的组合,勿使用中文字符, 保存唯一性
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "SpeakerVerifierPlugin",
            "train",
            [
                {
                    "mAuthId": _options.authId
                }
            ]
        );
    }

    //声纹验证
    _.voiceprint.verify = function(options){
        var _options = {
            success: null,
            error: null,
            authId:null// 声纹AuthId，用户在云平台的身份标识，也是声纹模型的标识
            // 请使用英文字母或者字母和数字的组合，6-18位数字字母下划线的组合,勿使用中文字符, 保存唯一性
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "SpeakerVerifierPlugin",
            "verify",
            [
                {
                    "mAuthId": _options.authId
                }
            ]
        );
    }

    //获取声纹密码
    _.voiceprint.getPassword = function(options){
        var _options = {
            success: null,
            error: null,
            type:null//区分注册和验证   0:验证   1:注册
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "SpeakerVerifierPlugin",
            "getPassword",
            [
                {
                    "type": _options.type
                }
            ]
        );
    }

})(cmp);
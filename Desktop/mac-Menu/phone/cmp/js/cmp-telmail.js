/**
 * Created by YH on 2015/9/21 0021.
 */
(function(_){
    //=======================================================================电话服务 start===========================//
    _.tel = {};

    /**
     * 调用移动设备的打电话的服务
     * @param options
     * {
     *     phoneNum : 电话号码,
     *     success : 回调函数 //可选
     *     error : 错误回调函数
     * }
     */
    _.tel.call = function (options) {
        var _options = {
            phoneNum: "",
            success: null,
            error: null
        };

        if (typeof options == "string") {
            _options.phoneNum = options;
        } else if (_.isObject(options)) {
            _options = _.extend(_options, options);
            if (_options.phoneNum.length == 0) {
                _options.error && _options.error(CMPError.build(CMPErrorCode.CODE_TEL_PHONE_NUM, "电话号码不合法!"));
                return;
            }
        }
        cordova.exec(
            _options.success,
            _options.error,
            "CallPhone",
            "call",
            [
                {
                    // 手机号码
                    "phonenumber": _options.phoneNum
                }
            ]);
    };

    /**
     * 调用移动设备发短信的服务
     * @param options
     * {
     *     phoneNum : 电话号码,
     *     message : 短信内容,
     *     success : 成功回调函数 //可选
     *     error :失败回调函数
     * }
     */
    _.tel.sms = function (options) {
        var _options = {
            phoneNum: "",
            message: "",
            success: null,
            error: null
        };

        _options = _.extend(_options, options);
        if (_options.phoneNum.length == 0) {
            _options.error && _options.error(CMPError.build(CMPErrorCode.CODE_TEL_PHONE_NUM, "电话号码不合法!"));
            return;
        }
        cordova.exec(
            _options.success,
            _options.error,
            "CallPhone",
            "send",
            [
                {
                    "phonenumber": _options.phoneNum,
                    "message": _options.message
                }
            ]);
    };

    /**
     * 查找电话号码
     * @param options
     * {
     *     phoneNum : 电话号码,
     *     success : 成功回调函数 //可选
     *     error :失败回调函数 //可选
     * }
     */
    _.tel.findPhoneNum = function (options) {
        var _options = {
            phonename: "",
            success: null,
            error: null
        };

        _options = _.extend(_options, options);
        //if (_options.phonename.length == 0) {
        //    _options.error && _options.error(CMPError.build(CMPErrorCode.CODE_TEL_PHONE_NUM, "电话号码不合法!"));
        //    return;
        //}
        cordova.exec(
            _options.success,
            _options.error,
            "CallPhone",
            "findPhoneNumber",
            [
                {
                    "phonename": _options.phonename
                }
            ]);
    };

    //=======================================================================通讯录保存到本地 开始===========================//
    /**
     * 同步到手机通讯录
     * @param options
     */
    _.tel.syncToLocal = function (options) {
        var _options = {
            success: null,
            error: null,
            "name":"",
            "mobilePhone":"",
            "officePhone":"",
            "email":"",
            "imageData":"" // 图片base64编码
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPTelPlugin",
            "syncToLocal",
            [
                {
                    "name": _options.name,
                    "mobilePhone":_options.mobilePhone,
                    "officePhone":_options.officePhone,
                    "email":_options.email,
                    "imageData":_options.imageData
                }
            ]);
    };
    //=======================================================================通讯录保存到本地 end===========================//

    //=======================================================================电话服务 end===========================//

    //=======================================================================邮件服务 start===========================//
    _.mail = {};

    /**
     * 邮件发送
     * @param options
     *  {
            bodystr: '',邮件内容
            attaname: '', 邮件附件名称
            attadata: '', 邮件附件数据 TODO 需要文件的二进制数据
            receiver:'',邮件接收人邮箱地址
            success: null, 成功回调函数
            error: null 失败回调函数
        }
     */
    _.mail.send = function (options) {

        var _options = {
            bodystr: '',
            attname: '',
            attdata: '',
            receiver:'',
            success: null,
            error: null
        };

        _options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "EmailPlugin",
            "sendEmail",
            [
                {
                    "bodystr": _options.bodystr,
                    "attaname": _options.attname,
                    "attadata": _options.attdata,
                    "receiver":_options.receiver
                }
            ]
        );
    }
    //=======================================================================邮件服务 end===========================//

})(cmp);

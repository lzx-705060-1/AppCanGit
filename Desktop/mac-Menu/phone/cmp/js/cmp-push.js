/**
 * Created by wangxk on 2016-8-11.
 */
(function (_) {

//===========================================cmp  消息推送设置插件 start===================================//
    _.push = {};
    /**
     * 开启消息推送服务
     * @param options
     */
    _.push.startPush = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "PushPlugin",
            "startPush",
            [
                {}
            ]
        );
    };
    /**
     * 设置消息推送参数（是否接收消息，是否声音提醒等）
     * @param options
     */
    _.push.setPushConfig = function (options) {
        var _options = {
            userKey: "",//用来存储消息设置的唯一的key
            showContent: true,// 是否通知显示消息详情
            soundRemind: true,// 是否有声音
            vibrationRemind: true,//是否震动
            platforms: [],//android使用，进行推送的消息平台"baidu","xiaomi","huawei"
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "PushPlugin",
            "setPushConfig",
            [
                {
                    "startReceiveTime": _options.startReceiveTime,
                    "endReceiveTime": _options.endReceiveTime,
                    "userKey": _options.userKey,
                    "useReceive": _options.useReceive,
                    "showContent":_options.showContent,
                    "soundRemind":_options.soundRemind,
                    "vibrationRemind":_options.vibrationRemind,
                    "platforms":_options.platforms
                }
            ]
        );
    };

    /**
     * 停止消息推送服务
     * @param options
     */
    _.push.stopPush = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "PushPlugin",
            "stopPush",
            [
                {}
            ]
        );
    };

    /**
     * 获取离线消息推送配置
     * @param options
     * {
     *  platforms:["baidu","xiaomi"]
     *  userId:"121234" // 用户id
     *  serverIdentifier:"12234455" // 服务器唯一标识
     *  soundRemind:true // 声音提醒
     *  vibrationRemind:true // 震动提醒
     *  showContent:true// 显示内容
     * }
     * return
     * {
     *    clientProtocolType = iPhoneInHouse; //设备类型 android、iPad、iPadInHouse、iPhone、iPhoneInHouse
     *   tokens = {"baidu":"612021290303441655", "xiaomi":"23423456"}; // 用户注册id
     *   platforms = ["baidu", "xiaomi"];// 消息推送平台 baidu、 xiaomi 、huawei
      *  }
     */
    _.push.getRemoteNotificationToken = function (options) {
        var _options = {
            success: null,
            error: null,
            platforms:["baidu", "xiaomi"],
            userId:"",
            serverIdentifier:"",
            soundRemind:true,
            vibrationRemind:true,
            showContent:true
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "PushPlugin",
            "getRemoteNotificationToken",
            [
                {
                    "platforms":_options.platforms,
                    "userId":_options.userId,
                    "serverIdentifier":_options.serverIdentifier,
                    "soundRemind":_options.soundRemind,
                    "vibrationRemind":_options.vibrationRemind,
                    "showContent":_options.showContent
                }
            ]
        );
    };

    /**
     * 停止消息推送服务
     * @param options
     * @return dict
     *
     */
    _.push.getRemoteNotification = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "PushPlugin",
            "getRemoteNotification",
            [
                {}
            ]
        );
    };

//===========================================cmp  消息推送设置插件 end===================================//

})(cmp);
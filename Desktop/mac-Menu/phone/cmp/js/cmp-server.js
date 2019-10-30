/**
 * Created by youlin on 2016/9/1.
 */
(function(_){
    /**
     * 设置服务器信息for M3
     * @type {{}}
     */
    _.server = {};
    // 保存服务器设置for cmp 1.0.0版本
    _.server.saveServerInfo = function (options) {
        var _options = {
            success: null,
            error: null,
            "serverurl":"", // 服务器地址
            "serverID":"", //服务器唯一标识
            "userID":"", // 用户id
            "userName":"",//用户名称
            "loginName":"",// 用户登陆名
            "ucServerInfo":{"serverurls":{"intranet":"","extranet":""},"jid":"","token":""}, //uc服务器信息
            "preSetAppsInfo":{"defualtAppId":"54", "defualtAppVersion":"1.0.0"},//预制应用信息
            "handlePushMsgAppInfo":{"appId":"55","version":"1.0.0"}, //处理离线推送消息应用信息
            "handleDesktopAppInfo":{"appId":"55","version":"1.0.0"}, // 处理桌面应用信息
            "updateServer":"", // 服务器更新信息
            "needCheckUpdate":"false" // 是否需要检查CMP壳、zip更新，主要兼容低版本
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPServerPlugin",
            "saveServerInfo",
            [
                {
                    "serverurl": _options.serverurl,
                    "serverID": _options.serverID,
                    "userID": _options.userID,
                    "userName": _options.userName,
                    "loginName":_options.loginName,
                    "ucServerInfo": _options.ucServerInfo,
                    "preSetAppsInfo": _options.preSetAppsInfo,
                    "handlePushMsgAppInfo": _options.handlePushMsgAppInfo,
                    "handleDesktopAppInfo": _options.handleDesktopAppInfo,
                    "updateServer":_options.updateServer,
                    "needCheckUpdate":_options.needCheckUpdate
                }
            ]
        );
    };
    _.server.debugV5Login = function(options){
        var _options = {
            success: null,
            error: null,
            url:null, // 服务器地址
            username:null,  //用户名称
            password:null  // 用户密码
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "LoginPlugin",
            "login",
            [
                {
                    "url": _options.url,
                    "username": _options.username,
                    "password": _options.password
                }
            ]
        );
    };
    // 保存服务器设置for cmp 2.0.0版本
    _.server.saveServerSettings = function (options) {
        var _options = {
            success: null,
            error: null,
            "serverurl":"", // 服务器地址
            "serverID":"", //服务器唯一标识
            "serverVersion":"", // 服务器版本号
            "preSetAppsInfo":{"defualtAppId":"54", "defualtAppVersion":"1.0.0"},//预制应用信息
            "handlePushMsgAppInfo":{"appId":"55","version":"1.0.0"}, //处理离线推送消息应用信息
            "handleDesktopAppInfo":{"appId":"55","version":"1.0.0"}, // 处理桌面应用信息
            "updateServer":"" // 服务器更新信息
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPServerPlugin",
            "saveServerSettings",
            [
                {
                    "serverurl": _options.serverurl,
                    "serverID": _options.serverID,
                    "serverVersion":_options.serverVersion,
                    "preSetAppsInfo": _options.preSetAppsInfo,
                    "handlePushMsgAppInfo": _options.handlePushMsgAppInfo,
                    "handleDesktopAppInfo": _options.handleDesktopAppInfo,
                    "updateServer":_options.updateServer
                }
            ]
        );
    };

    // 保存用户信息 for cmp 2.0.0版本
    /**
     * 保存登陆成功后的信息
     * @param options
     */
    _.server.saveLoginResult = function (options) {
        var _options = {
            success: null,
            error: null,
            "userID":"", // 用户id
            "userName":"",// 用户名称
            "loginName":"",// 用户登陆名
            "jsessionId":"",// 登陆token
            "loginUrl":"", // 登陆地址
            "accountID":"",//单位id
            "departmentID":"",//部门id
            "levelID":"",//职务id
            "postID":"",//岗位id
            "userPassword":"",//用户密码
            "passwordStrong":"",//密码强度
            "passwordOvertime":""//密码过期时间
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPServerPlugin",
            "saveLoginResult",
            [
                {
                    "userID": _options.userID,
                    "userName": _options.userName,
                    "loginName":_options.loginName,
                    "jsessionId":_options.jsessionId,
                    "loginUrl":_options.loginUrl,
                    "accountID":_options.accountID,
                    "departmentID":_options.departmentID,
                    "levelID":_options.levelID,
                    "postID":_options.postID,
                    "userPassword":_options.userPassword,
                    "passwordStrong":_options.passwordStrong,
                    "passwordOvertime":_options.passwordOvertime
                }
            ]
        );
    };

    // 清空登陆信息 for cmp 2.0.0版本
    /**
     * 清空登陆信息
     * @param options
     */
    _.server.clearLoginResult = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPServerPlugin",
            "clearLoginResult",
            [
                {
                }
            ]
        );
    };
    /**
     * 显示session失效提示框
     * @param options
     */
    _.server.showSessionInvalidAlert = function (options) {
        var _options = {
            success: null,
            error: null,
            title:"",
            content:"",
            buttonTitle:""
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPServerPlugin",
            "showSessionInvalidAlert",
            [
                {
                    title:_options.title,
                    content:_options.content,
                    buttonTitle:_options.buttonTitle
                }
            ]
        );
    };
})(cmp);
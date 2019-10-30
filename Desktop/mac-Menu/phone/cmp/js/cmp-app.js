(function(_){
    //=======================================================================app操作 start============================//
    _.app = {};
    _.app.openApp = function (urlScheme) {
        cordova.exec(
            function (r) {

            },
            function (e) {

            },
            "CMPHandleThirdApp",
            "openThirdApp",
            [
                {
                    "urlScheme": urlScheme
                }
            ]
        );
    };
    _.app.downloadApp = function (options) {
        var _options = {
            url: "",
            title: "",
            extData: null,
            progress: function () {
            },
            success: function () {
            },
            error: null
        };
        _options = _.extend(_options, options);

        cordova.exec(
            function (result) {
                var tempStr = result;
                try {
                    result = cmp.parseJSON(tempStr);
                } catch (e) {
                    result = tempStr;
                }
                if (parseInt(result["pos"]) == 1) {
                    _options.success(result);
                } else {
                    _options.progress(result);
                }
            },
            _options.error,
            "CMPAppManagerPlugin",
            "downloadApp",
            [
                {
                    "url": _options.url,
                    "title": _options.title,
                    "extData": _options.extData
                }
            ]
        );
    };
    _.app.getDownloadAppList = function (options) {
        var _options = {
            url: "",
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "getDownloadAppList",
            [
                {"url" : _options.url}
            ]
        );
    };
    _.app.getAppVersionList = function (options) {
        var _options = {
            url : "",
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "getAppVersionList",
            [
                {
                    "url": _options.url
                }
            ]
        );
    };
    _.app.loadApp = function (options) {
        var _options = {
            "appId":"",//应用id
            "bundle_identifier":"", //唯一id
            "bundle_name":"",//应用名称
            "team":"",//所属组
            "version": "",//版本号
            "appType":"", //应用类型 default（v5、m3标准应用）、
            // integration_remote_url(url 接入)、
            // integration_local_h5(本地h5应用)、
            // integration_shortcut(快捷方式)、
            // integration_recommend(推荐应用)、
            // integration_native(原生应用)、
            "entry":"", // 用于原生app的调用、h5的url地址
            "from": "", //来源
            "downloadUrl":"", // 原生app下载地址
            "parameters":"", // 打开原生应用、h5url地址的参数
            "iOSStatusBarStyle":"", // ios状态栏颜色0=黑色 1=白色
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        console.log(_options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "loadApp",
            [
                _options
            ]
        );
    };

    _.app.deleteApp = function (options) {
        var _options = {
            appId:"",
            bundle_identifier:"", //唯一id
            bundle_name:"",//应用名称
            team:"",//所属组
            version: "",//版本号
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "deleteApp",
            [
                {
                    appId:_options.appId,
                    bundle_identifier:_options.bundle_identifier,
                    bundle_name:_options.bundle_name,
                    team:_options.team,
                    "version": _options.version
                }
            ]
        );
    };
    _.app.getJSAPIUrl = function (options) {
        var _options = {
            appId:"", //应用id
            serverVersion:"",//服务器版本号
            serverIdentifier:"",//服务器的唯一标识
            ownerId: "",//用户id
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "getJSAPIUrl",
            [
                {
                    appId:_options.appId,
                    serverVersion:_options.serverVersion,
                    serverIdentifier:_options.serverIdentifier,
                    ownerId: _options.ownerId
                }
            ]
        );
    };

    /*
     * 获取预置应用Md5码
     *@reurn {"cmp":"11111", "m3_apps_login":"", "m3_apps_commons":""}
     *
     */
    _.app.getPresetAppsMd5 = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "getJSAPIUrl",
            [
                {

                }
            ]
        );
    };
    /*
     * 获取App入口
     *
     */
    _.app.getAppEntryUrl = function (options) {
        var _options = {
            success: null,
            error: null,
            "appId":"", //应用id
            "version":"" // 应用版本号
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "getAppEntryUrl",
            [
                {
                    "appId":_options.appId,
                    "version":_options.version
                }
            ]
        );
    };
    /*
     * 获取App信息
     * options appId、version
     *
     */
    _.app.getAppInfo = function (options) {
        var _options = {
            success: null,
            error: null,
            "appId":"", //应用id
            "version":"" // 应用版本号
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "getAppInfo",
            [
                {
                    "appId":_options.appId,
                    "version":_options.version
                }
            ]
        );
    };
    /*
     * 获取本地资源路径
     * options url
     * return  {Object} 返回的本地资源格式  如：{localUrl:"XXXX"} ,兼容，如果不是cmp壳，直接在success回调返回拼接好的数据格式
     */
    _.app.getLocalResourceUrl = function (options) {
        var _options = {
            success: null,
            error: null,
            "url":"" // url地址
        };
        _options = _.extend(_options, options);
        if(!_.platform.CMPShell){
            var successFun = _options.success;
            if(successFun && typeof successFun == "function"){
                var localUrl = _options.url || "";
                var result = {
                    localUrl:localUrl
                };
                successFun(result);
            }
            return;
        }
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "getLocalResourceUrl",
            [
                {
                    "url":_options.url,
                }
            ]
        );
    };
    //=======================================================================app操作 end============================//

    //=====================================================创建桌面应用==============================================//
    /*
     * 创建桌面一键应用
     *
     *
     */
    _.app.createDesktopAppLink = function (options) {
        var _options = {
            success: null,
            error: null,
            "displayName":"",
            "iconBase64Data":"", // 以data:image/png;base64,开头
            "options":{} // {appId:"", version:""}
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPDesktopAppLinkPlugin",
            "createDesktopLinkApp",
            [
                {
                    "displayName":_options.displayName,
                    "iconBase64Data":_options.iconBase64Data,
                    "options":_options.options
                }
            ]
        );
    };
    /**
     * 获取打开桌面应用参数
     * @param options
     */
    _.app.getOpenDesktopAppOptions = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPDesktopAppLinkPlugin",
            "getOpenDesktopLinkAppOptions",
            [
                {
                }
            ]
        );
    };
    //=====================================================创建桌面应用 end==============================================//

    //=====================================================设置ios状态颜色start==============================================//
    /**
     *  // ios状态栏颜色0=黑色 1=白色
     * @param options
     */
    _.app.setStatusBarStyleforiOS = function (options) {
        var _options = {
            success: null,
            error: null,
            "statusBarStyle":0
        };
        _options = _.extend(_options, options);
        if(cmp.os.ios) {
            cordova.exec(
                _options.success,
                _options.error,
                "CMPStatusBarStylePlugin",
                "setStatusBarStyle",
                [
                    {
                        "statusBarStyle": _options.statusBarStyle
                    }
                ]
            );
        }
    };
    _.app.setStatusBar = function (options) {
        var _options = {
            success: null,
            error: null,
            "statusBarStyle":0,
            "bgColor":"#ffffff"
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPStatusBarStylePlugin",
            "setStatusBarStyle",
            [
                {
                    "statusBarStyle": _options.statusBarStyle,
                    "bgColor":_options.bgColor
                }
            ]
        );
    };
    //=====================================================设置ios状态颜色end==============================================//

    //=====================================================添加杀进程插件==============================================//
    /**
     *  杀进程退出app
     */
    _.app.exitApp = function (options) {
        var _options = {
            success: null,
            error: null,
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPExitAppPlugin",
            "exitApp",
            [
                {}
            ]
        );
    };
    //=====================================================添加杀进程插件end==============================================//

    //====================================================特殊情况的请求，当active的状态改变后才触发该缓存下的请求======//
    _.app.sendAjaxByActiveState = function(options){
        if(_.os.ios) return; //ios不进行这个适配
        var _options = {
            params:{
                "hide":{      //active  hide状态的请求
                    header:null,
                    url:null,
                    data:null
                },
                "wakeup":{    //active唤醒状态的请求
                    header:null,
                    url:null,
                    data:null
                }
            },
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        if(typeof options.params.hide == "undefined"){
            _options.params.hide = null;
        }
        if(typeof options.params.wakeup == "undefined"){
            _options.params.wakeup = null;
        }
        cordova.exec(
            _options.success,
            _options.error,
            "CMPStatePlugin",
            "sendRequestByActiveState",
            [
                {
                    params:_options.params
                }
            ]
        );
    }

    //======ios 设置桌面icon 数字======//

    _.app.setApplicationIconBadgeNumber = function (options) {
        if(_.os.android) return; //ios不进行这个适配
        var _options = {
            success: null,
            error: null,
            "badgeNumber":"0"
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPBadgeNumberlugin",
            "setApplicationIconBadgeNumber",
            [
                {
                    "badgeNumber":_options.badgeNumber
                }
            ]
        );
    };

    //清除缓存
    _.app.clearCache = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CacheInfoPlugin",
            "clearCache",
            [{}]
        );
    };
    //获取缓存文件大小
    _.app.getCacheLength = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CacheInfoPlugin",
            "getCacheLength",
            [{}]
        );
    };

    //提示设置应用权限
    _.app.setPermission = function(options){
        var _options = {
            success: null,
            error: null,
            permissionTips:"没有权限，请开启相关权限",
            cancelText:"取消",
            toSetText:"去设置"
        };
        _options = _.extend(_options, options);
        _.notification.confirm(_options.permissionTips, function (index) {
            if (index == 0) {
                return;
            } else if (index == 1) {
                cordova.exec(
                    function () {
                    },
                    function () {
                    },
                    "CMPSettingPlugin",
                    "enterSetting",
                    []
                );
            }
        }, "", [_options.cancelText,_options.toSetText]);//"取消","去设置"
    };
    /**
     * 隐藏启动页
     * @param options
     */
    _.app.hideStartPage = function (options) {
        var _options = {
            success: null,
            error: null,
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPStartPagePlugin",
            "hideStartPage",
            [{}]
        );
    };
    /**
     * 打开第三方原生应用
     * @param options
     */
    _.app.openThirdNative = function (options) {

        var _options = {
            success: null,
            error: null,
            params:null,
            appEnter:"",
            iosAppEntry:"",
            androidAppEntry:"",
            androidDownloadUrl:"",
            iosDownloadUrl:""
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "openThirdNative",
            [{
                appEnter: _options.appEnter,
                params:_options.params,
                iosAppEntry:_options.iosAppEntry,
                androidAppEntry:_options.androidAppEntry,
                androidDownloadUrl:_options.androidDownloadUrl,
                iosDownloadUrl:_options.iosDownloadUrl
            }]
        );

    };


    /**
     * 权限插件
     * @param options {values:{ hasColNew:true/false,xxx:true/false }, success:function, error:function}
     * 现在只有一个新建协同权限,以后会扩展,只需在values里面添加相应字段,请以has开头
     */
    _.app.privilegeWrite = function (options) {

        var _options = _.extend(
            {
                values:{},
                success:function () {

                },
                error:function () {

                }
            },options);

        cordova.exec(
            function success(res){
                if(typeof _options.success == "function"){
                    _options.success(res);
                }
            },
            function error(error){
                if(typeof _options.error == "function"){
                    _options.error(error);
                }
            },
            "CMPPrivilegePlugin",
            "writePrivilege",
            [{
                values:_options.values
            }]
        );
    };
    //根据appId获取应用的md5码
    //返回值[{"appID":"1","md5":"xxx","path":"xxx"}]
    _.app.getAppMd5 = function(options){
        var _options = {
            success: null,
            error: null,
            appIds:[]//需要以数组的形式传appId，appId item是字符串
        };
        _options = _.extend(_options, options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPAppManagerPlugin",
            "getMD5ByIDs",
            [{"appIDs":_options.appIds}]
        );
    }

})(cmp);
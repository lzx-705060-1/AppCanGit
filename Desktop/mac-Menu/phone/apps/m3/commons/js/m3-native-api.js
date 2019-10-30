/**
 * @description 原生API模块
 * @author Clyne
 * @createDate 2017-07-25
 */
;(function() {
    var m3Error;
    define(function( require, exports, module ){
        //加载模块
        m3Error = require('error');
        //导出模块
        module.exports = window.m3Native = m3Api;
    });
    //二次封装cordova的cmd
    function m3ExceCmd( success, fail, service, action, args, sync ) {
        success = success || function() {};
        fail = fail || function() {};
        var failCb = function (e) {
            m3Error.notify(e, 'native', fail);
        }
        cordova.exec(success, failCb, service, action, args, sync);
    };
    //api对象
    var m3Api = {
        
        /* ========================= 应用类原生接口 CMPAppManagerPlugin ========================= */
        
        /** 
         * @description 根据应用ID获取在线图标地址 
         * @param {string} 应用id
         * @param {function} success
         * @param {function} fail
         * @return {string} example '/seeyon/upload.do?xxx'
         */
        getAppIconUrlByAppId: function(appId, success, fail) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin", "getAppIconUrlByAppId", [{appId: appId}]);
        },
        /** 
         * @description 获取AppList 
         * @succes return 应用列表信息 [object String]
         */
        getAppList: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin", "getAppList", []);
        },
        /** 
         * @description 获取单个独立应用（默认的标准应用，根据AppType = default 的方式）;
         * @succes return  [object String]
         */
        getAppInfoAppId: function( appId, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin", "getAppInfoByIdAndType", [{appId: appId, appType:"default"}]);
        },
        /** 
         * @description 适配第三方穿透根据传递的类型获取应用信息
         * @succes return  [object String]
         */
        getAppInfoAppIdByType: function( appId,type, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin", "getAppInfoByIdAndType", [{appId: appId, appType:type}]);
        },
        /** 
         * @description 保存AppList 
         * @param data 保存的数据 [object String]
         */
        saveAppList: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin",  "setAppList", [{appList: data}]);
        },
        
        /** 
         * @description 根据id获取应用信息 
         * @param id 应用唯一标示 [object String]
         * @succes return 应用信息 [object String]
         */
        getAppInfoById: function( id, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin",  "getAppInfoById", [{id: id}]);
        },
        
        /**
         * @description 加载应用 
         * @param appInfo 应用信息 [object]
         */
        loadApp: function(appInfo, success, fail) {
            console.log(appInfo);
            m3ExceCmd(success, fail, 'CMPAppManagerPlugin', 'loadApp', [appInfo]);
        },
        
        /** 
         * @description 获取底部导航栏信息
         * @succes return [object String](JSON字符串)
         */
        getNavBarInfo: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin",  "getNavBarInfo", []);
        },
        
         /** 
         * @description 打开原生通讯录
         */
        showAddressBook: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin",  "showAddressBook", []);
        },

        /**
         * @description 获取应用的S3JS的绝对路径
         */
        getS3JSAPIUrl: function(appId, success, fail) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin",  "getJSAPIUrl", [{
                appId:appId
            }]);
        },
        
        /**
         * @description 获取应用列表，config权限接口状态
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         * @return {string} example '{applist: true, config: false}'的JSON字符串
         */
        getAppAndConfigRequestStatus: function (success, fail) {
            m3ExceCmd(success, fail, "CMPAccountPlugin", "getAppAndConfigRequestStatus", []);
        },

        /**
         * @description 刷新应用列表，config权限接口状态
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         * @return {string} example '{applist: true, config: false}'的JSON字符串
         */
        refreshAppAndConfig: function(success, fail) {
            m3ExceCmd(success, fail, "CMPAccountPlugin", "refreshAppListAndConfigInfo", []);
        },

        /** 
         * @description 获取关联账号状态
         */
        getAssociateAccountState: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin",  "getAssociateAccountState", []);
        },
         /** 
         * @description 打开原生关联账号列表页面
         */
        openAssociateAccountList: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin",  "openAssociateAccountList", []);
        },

         /** 
         * @description 打开原生切换企业页面
         */
        openAssociateAccountSwitcher: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin",  "openAssociateAccountSwitcher", []);
        },
        /** 
         * @description 根据AppId获取应用版本信息
         * @param appId 应用唯一标示 [object String]
         * @succes return [object String](JSON字符串)
         */
        getVersionInfoByAppId: function( appId, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin",  "getAppInfo", [{appId: appId, version: ''}]);
        },
        
        getAppPackageInfoByAppId: function(appId, succes, fail) {
            this.getVersionInfoByAppId(appId, succes, fail);
        },
        
        /* ========================= 设置权限类接口 CMPCallIdentificationPlugin ========================= */
        
        /** 
         * @description 获取来电显示权限
         * @succes return 示例{state: true} [object object](map)
         * @succes param state 状态值 [object boolean]
         */
        getCallerAuthor: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPCallIdentificationPlugin",  "getCallIdentificationState", []);
        },
        /** 
         * @description 获取来电列表显示权限
         * @succes return 示例{state: true} [object object](map)
         * @succes param state 状态值 [object boolean]
         */
        getCallerAuthorShow:function( success, fail ){
            m3ExceCmd(success, fail, "CMPCallIdentificationPlugin",  "isSupportCallIdentification", []);
        },
        /** 
         * @description 设置来电显示权限
         * @param state 状态值 [object boolean]
         */
        setCallerAuthor: function( state, success, fail ) {
            m3ExceCmd(success, fail, "CMPCallIdentificationPlugin",  "setCallIdentificationState", [{state: state}]);
        },
        
        /* ========================= 离线组织结构接口 CMPOfflineContactsPlugin========================= */
        
        /** 
         * @description 获取组织架构人员或者部门的排序参数
         */
        getDepartmentMemberSortType:function(success, fail){
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin",  "getDepartmentMemberSortType", []);
        },
        /** 
         * @description 展示搜索人员页面
         */
        showMemberSearch: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin",  "showMemberSearch", []);
        },
        /** 
         * @description 获取离线通讯录下载状态
         */
        getDownloadState: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin",  "getDownloadState", []);
        },
        /** 
         * @description 离线通讯录下载失败重试
         */
        retryDownload: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin",  "retryDownload", []);
        },
        /** 
         * @description 根据单位ID获取单位信息
         * @param id 单位ID [object string]
         * @succes return 单位信息 [object string](JSON字符串)
         */
        getAccountInfo: function( id, success, fail ) {
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin",  "getAccountInfo", [{accountID: id}]);
        },
        
        /** 
         * @description 根据单位ID获取该单位的所有部门
         * @param id 单位ID [object string]
         * @succes return 部门列表信息 [object string](JSON字符串)
         */
        getDepartmentList: function( id, success, fail ) {
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin",  "getDepartmentList", [{accountID: id}]);
        },
        
        /** 
         * @description 根据部门ID获取该部门的所有人员
         * @param data.accountId 单位ID [object string]
         * @param data.departmentId 部门ID [object string]
         * @param data.pageNum 部门ID [object Number]
         * @succes return 人员列表信息 [object string](JSON字符串)
         */
        getMemberList: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin", "getDepartmentMemberList", [
                {
                    pageNum: data.pageNum, 
                    accountID: data.accountId,
                    departmentID: data.departmentId,
                    sortType:data.sortType
                }
            ]);
        },
        
        /** 
         * @description 根据部门ID获取该部门的所有人员
         * @param id 人员ID [object string]
         * @succes return 人员信息 [object string](JSON字符串)
         */
        getMemberInfo: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin", "getMemberCard", [{memberID: data.id, accountID: data.accountId}]);
        },

        
        /* ========================= 获取本地缓存类接口 CMPLocalDataPlugin ========================= */
        
        /** 
         * @description 根据key获取原生缓存
         * @param key keyzhi [object string]
         * @param isGlobal 是否为全局，与userID无关联 [object boolean]
         * @succes return 缓存信息 [object string]
         */
        getCacheByKey: function( key, success, fail, isGlobal ) {
            m3ExceCmd(success, fail, "CMPLocalDataPlugin", "read", [{identifier: key, isGlobal: isGlobal || false}]);
        },
        
        /** 
         * @description 根据key获取原生缓存
         * @param data.key key值 [object string]
         * @succes data.value 缓存值 [object string]
         * @param data.isGlobal 是否为全局，与userID无关联 [object boolean]
         */
        setCacheByKey: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPLocalDataPlugin", "write", [{
                identifier: data.key, 
                data: data.value, 
                isGlobal: data.isGlobal || false
            }]);
        },
        
        /* ========================= 底部导航栏原生接口 CMPTabBarPlugin ========================= */
        
        /** 
         * @description 设置默认显示的底部导航页签
         * @param id 自定义导航返回的appKey值 [object string]
         * 原有的接口参数的key是AppId，原生兼容
         */
        setIndexPage: function( id, success, fail ) {
            m3ExceCmd(success, fail, "CMPTabBarPlugin", "setDefaultIndex", [{appKey: id}]);
        },
        
        /** 
         * @description 获取用户设置的底部导航页签
         * @return JSON字符串 应用的appKey [object String]
         */
        getIndexPage: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPTabBarPlugin", "getDefaultIndex", []);
        },
        
        /* ========================= 获取权限接口 CMPPrivilegePlugin ========================= */
        
        /** 
         * @description 根据key值获取权限
         * @param key key值 [object string]
         * @param return 返回值 [object string]
         */
        getAuthorityByKey: function( key, success, fail ) {
            m3ExceCmd(success, fail, "CMPPrivilegePlugin", "getAuthorityByKey", [{key: key}]);
        },
        
         /* ========================= 原生弹出框 showSessionInvalidAlert ========================= */
        
        /** 
         * @description 根据key值获取权限
         * @param data.title标题 [object string]
         * @param data.content内容 [object string]
         * @param data.buttonTitle按钮名称 [object string]
         * @param success点击按钮的回调 [object function]
         */
        nativeAlert: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPServerPlugin", "showSessionInvalidAlert", [{
                title: data.title || '',
                content: data.content || '',
                buttonTitle: data.buttonTitle || ''
            }]);
        },
        
        /** 
         * @description 根据key值获取权限
         * @param data.title标题 [object string]
         * @param data.content内容 [object string]
         * @param data.buttonTitle按钮名称 [object string]
         * @param success点击按钮的回调 [object function]
         */
        logout: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPServerPlugin", "clearLoginResult", [{}]);
        },
        
        /* ========================= Message类接口 CMPAppMessagePlugin ========================= */
        
        /** 
         * @description 设置消息置顶
         * @param data appID 应用ID [object string]
         * @param data status 状态值 [object string] 0-免打扰 1-提醒
         */
        setTopStatus: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppMessagePlugin", "setTopStatus", [{status: data.status, appID: data.appID}]);
        },
        
        /** 
         * @description 获取消息置顶状态
         * @param appID 应用ID [object string]
         * @param return [object string] 0-不置顶 1-置顶
         */
        getTopStatus: function( appID, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppMessagePlugin", "getTopStatus", [{appID: appID}]);
        },
        
        /** 
         * @description 设置消息置顶
         * @param data appID 应用ID [object string]
         * @param data status 置顶状态 [object string]
         * @param return [object string] 0-不置顶 1-置顶
         */
        setRemindStatus: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppMessagePlugin", "setRemindStatus", [{appID: data.appID, status: data.status}]);
        },
        
        /** 
         * @description 获取消息置顶状态
         * @param data appID 应用ID [object string]
         * @param return [object string] 0-不置顶 1-置顶
         */
        getRemindStatus: function( appID, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppMessagePlugin", "getRemindStatus", [{appID: appID}]);
        },
        
        /** 
         * @description 设置聚合消息状态
         * @param data appID 应用ID [object string]
         * @param data status 聚合消息状态 [object string] 0-不聚合 1-聚合
         */
        setAggregationStatus: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppMessagePlugin", "setAggregationStatus", [{
                appID: data.appID,
                aggregationID: 'AppMessage',
                status: data.status,
            }]);
        },
        
        /** 
         * @description 设置聚合消息状态
         * @param data appID 应用ID [object string]
         * @param data status 聚合消息状态 [object string] 0-不聚合 1-聚合
         */
        getAggregationStatus: function( data, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppMessagePlugin", "getAggregationStatus", [{aggregationID: 'AppMessage', appID: data.appID}]);
        },
        
        /* ========================= 推送开关类 PushPlugin ========================= */
        
        /**
         * @description 获取推送开关配置信息
         * @success return 开关信息 [object string]  
         */
        getPushConfig: function( success, fail ) {
            m3ExceCmd(success, fail, "PushPlugin", "getPushConfig", [{}]);
        },
        
        /**
         * @description 设置推送开关配置信息
         * @param data ring 声音 [object string]
         * @param data shake 振动 [object string]
         * @param data mainSwitch 主开关 [object string]
         * @param data startDate 开始时间 [object string]
         * @param data endDate 结束时间 [object string]
         */
        setPushConfig: function(data, success, fail) {
            m3ExceCmd(success, fail, "PushPlugin", "setPushConfig", [{
                soundRemind: data.ring,
                vibrationRemind: data.shake,
                useReceive: data.mainSwitch,
                startReceiveTime: data.startDate,
                endReceiveTime: data.endDate,
            }]);
        },
        
        /* ========================= 账户登录类 CMPAccountPlugin ========================= */
        
        /**
         * @description 获取login的登录信息
         * @return 登录信息 [object String]
         */
        getLoginInfo: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin", "getLoginInfo", [{}]);
        },
        
        /**
         * @description 验证密码
         * @return 验证结果 [object String]
         */
        checkPSW: function( psw, success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin", "checkPassword", [{password: psw || ''}]);
        },
        
        /**
         * @description 获取配置权限信息
         * @return 权限信息 [object String]
         */
        getConfigInfo: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin", "getConfigInfo", [{}]);
        },
        
        /**
         * @description 获取服务器信息
         * @return 服务器信息 [object String]
         */
        getServerInfo: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin", "getServerInfo", [{}]);
        },
        
        /* ========================= 账户登录类 GestureLockPlugin ========================= */
        
        /**
         * @description 获取手势密码状态
         * @return 手势密码状态 [object String]
         */
        gestureState: function( success, fail ) {
            m3ExceCmd(success, fail, "GestureLockPlugin", "gestureState", [{}]);
        },

        setGestureState: function(userName, success, fail) {
            m3ExceCmd(success, fail, "GestureLockPlugin", "setGestureLock", [{showLeftArrow: true, username: userName, autoHide: true}]);
        },

        resetGestureState: function(success, fail) {
            m3ExceCmd(success, fail, "GestureLockPlugin", "unRegisterTimeInterval", [{}]);
        },
        
        /* ========================= 获取网络状态 NetworkStatus ========================= */
        
        /**
         * @description 获取网络状态
         * @return 网络状态 [object String]
         */
        getNetworkState: function( success, fail ) {
            m3ExceCmd(success, fail, "NetworkStatus", "getNetworkStatusInfo", [{}]);
        },

        /* ========================= 获取M3版本信息 CMPShellPlugin ========================= */
        
        /**
         * @description 获取M3版本信息
         * @return 网络状态 [object Object]
         */
        getM3VersionInfo: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPShellPlugin", "version", [{}]);
        },
        /* ========================= 获取M3页面穿透信息 CMPShellPlugin ========================= */

        /**
         * @description 获取M3页面穿透信息
         * @return 页面信息 [Any]
         */
        getPenetrationParams: function (data, success, fail) {
            m3ExceCmd(success, fail, "CMPTransferDataPlugin", "getData", [{
                key: data
            }]);
        },

        /* ========================= 二维码扫描 CDVBarcodeScanner ========================= */
        /**
         * @description QR扫描开启
         * @param {function} success 
         * @param {function} fail 
         */
        scanQRCode: function(success, fail) {
            m3ExceCmd(success, fail, "CDVBarcodeScanner", "holdScan", [{}]);
        },

        /**
         * @description 关闭QRscan
         * @param {string} val 
         * @param {function} success 
         * @param {function} fail 
         */
        closeQRCode: function(val, success, fail) {
            m3ExceCmd(success, fail, "CDVBarcodeScanner", "holdScanClose", [{callbackVal: val}]);
        },

        /**
         * @description 弹框
         * @param {string} msg 
         * @param {function} success 
         * @param {function} fail 
         */
        QRAlert: function(msg, success, fail) {
            m3ExceCmd(success, fail, "CDVBarcodeScanner", "holdScanSendResult", [{callbackVal: val}]);
        },
        
        /**
         * @description webview广播事件
         * @param {string} eventName 自定义事件名称
         * @param {function} success 
         * @param {function} fail 
         */
        addWebviewListener: function(eventName, success, fail) {
            m3ExceCmd(success, fail, 'CMPWebviewListenerAddPlugin', 'add', [{type: eventName}]);
        },

        notifyWebviewListener: function(eventName, data, success, fail) {
            m3ExceCmd(success, fail, 'CMPWebviewListenerAddPlugin', 'add', [{type: eventName, data: data}]);
        },

        /* ========================= M3加密 CMPEncryptPlugin ========================= */
        /**
         * @description 字符串加密
         * @param {Array} str 被加密字符串
         * @param {function} success 
         * @param {function} fail 
         */
        encrypt: function(strArr, success, fail) {
            m3ExceCmd(success, fail, 'CMPEncryptPlugin', 'encryptM3Login', [{value: strArr}]);
        }
    };
})();
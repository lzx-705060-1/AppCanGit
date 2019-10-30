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
         * @description 根据AppId获取应用版本信息
         * @param appId 应用唯一标示 [object String]
         * @succes return [object String](JSON字符串)
         */
        getVersionInfoByAppId: function( appId, success, fail ) {
            m3ExceCmd(success, fail, "CMPAppManagerPlugin",  "getAppInfo", [{appId: appId, version: ''}]);
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
         * @description 设置来电显示权限
         * @param state 状态值 [object boolean]
         */
        setCallerAuthor: function( state, success, fail ) {
            m3ExceCmd(success, fail, "CMPCallIdentificationPlugin",  "setCallIdentificationState", [{state: state}]);
        },
        
        /* ========================= 离线组织结构接口 CMPOfflineContactsPlugin========================= */
        
        /** 
         * @description 展示搜索人员页面
         */
        showMemberSearch: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPOfflineContactsPlugin",  "showMemberSearch", []);
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
                    departmentID: data.departmentId
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
        checkPSW: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin", "checkPassword", [{}]);
        },
        
        /**
         * @description 获取配置权限信息
         * @return 权限信息 [object String]
         */
        getConfigInfo: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPAccountPlugin", "getConfigInfo", [{}]);
        },
        
        /* ========================= 服务信息类 CMPServerPlugin ========================= */
        
        /**
         * @description 获取服务器信息
         * @return 服务器信息 [object String]
         */
        getServerInfo: function( success, fail ) {
            m3ExceCmd(success, fail, "CMPServerPlugin", "getServerInfo", [{}]);
        },
        
        /* ========================= 账户登录类 GestureLockPlugin ========================= */
        
        /**
         * @description 获取手势密码状态
         * @return 手势密码状态 [object String]
         */
        gestureState: function( success, fail ) {
            m3ExceCmd(success, fail, "GestureLockPlugin", "gestureState", [{}]);
        },
        
        /* ========================= 获取网络状态 NetworkStatus ========================= */
        
        /**
         * @description 获取网络状态
         * @return 网络状态 [object String]
         */
        getNetworkState: function( success, fail ) {
            m3ExceCmd(success, fail, "NetworkStatus", "getNetworkStatusInfo", [{}]);
        }
    };
})();
;(function() {
    define('todo/js/cmp-native-sdk.js', function(require, exports, module) {
        module.exports = new sdk();
    });

    function sdk() {}

    sdk.prototype = {

        syncExec: function(service, action, data) {
            if ($.os.android) {
                return window.CMPNativeBridge.smRequest(service, action, JSON.stringify(data));
            }
            var requestParams = {
                service:service,
                action:action,
                data:data
            };
            requestParams = JSON.stringify(requestParams);
            var xhr = new window.XMLHttpRequest();
            var url = "http://127.0.0.1/nativeservice";
            xhr.open("POST", url, false);
            xhr.send(requestParams);
            var nativeResult = xhr.responseText;
            return nativeResult;
        },

        /**
         * @method exec
         * @description 执行函数
         * @param {srting} plugin 类名
         * @param {string} action 方法名
         * @param {any} params 参数
         * @param {function} success 成功回调
         * @param {function} fail 成功回调
         */
        exec: function (plugin, action, params, success, fail) {
            cordova.exec(success || function () { },fail || function () { }, plugin, action, [params]);
        },

        /**
         * @method loadAppInBrowse
         * @description 在浏览器中代开app
         * @param {object} params 参数
         * @param {string} params.url url地址
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         * @return {object} fail 错误返回，错误对象
         */
        loadAppInBrowse: function (params, success, fail) {
            this.exec('CMPAppManagerPlugin', 'loadInExplorer', params, success, fail);
        },

        loadApp: function(params, success, fail) {
            this.exec('CMPAppManagerPlugin', 'loadApp', params, success, fail);
        },

        /**
         * @method openWebview
         * @description 打开webview
         * @param {any} params 参数
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        openWebview: function (params, success, fail) {
            this.exec('WebViewPlugin', 'open', params, success, fail);
        },

        /**
         * @method closeWebview
         * @description 关闭webview
         * @param {any} params 参数
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        closeWebview: function (params, success, fail) {
            this.exec('WebViewPlugin', 'close', params, success, fail);
        },

        /**
         * @method getLocalDataSync
         * @description 同步获取localData
         * @param {any} params 参数
         */
        getLocalDataSync: function (key) {
            return window.localStorage[ key ];
            return this.exec('CMPStoragePlugin', 'getItem', [{key: key, scope: false}], undefined, undefined, true);
        },

        /**
         * @method setLocalDataSync
         * @description 同步设置localData
         * @param {any} params 参数
         */
        setLocalDataSync: function (key, value) {
            return window.localStorage[ key ] = JSON.stringify(value);
            return this.exec('CMPStoragePlugin', 'setItem', {
                key: key, 
                data: JSON.stringify(value),
                scope: false
            }, undefined, undefined, true);
        },

        /**
         * @method clearLocalDataSync
         * @description 同步清除localData
         * @param {any} key 键值
         */
        clearLocalDataSync: function(key) {
            return delete window.localStorage[ key ];
            return this.exec('CMPStoragePlugin', 'clear', {key: key, scope: false});
        },

        /**
         * @method addWebviewListener
         * @description 增加webview事件
         * @param {string} eventName 事件名称
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        addWebviewListener: function(eventName, success, fail) {
            this.exec('CMPWebviewListenerAddPlugin', 'add', {type: eventName}, success, fail);
        },

        /**
         * @method notifyWebviewListener
         * @description webview发起通知
         * @param {string} eventName 事件名称
         * @param {any} data 事件数据
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        notifyWebviewListener: function(eventName, data, success, fail) {
            this.exec('CMPWebviewListenerFirePlugin', 'fire', {type: eventName, data: data}, success, fail);
        },

        /**
         * @method getAbsolutePathByUrl
         * @description 获取本地路径
         * @param {string} path 路径
         * @param {function} success 成功回调
         * @param {function} fail 失败回调
         */
        getAbsolutePathByUrl: function(path, success, fail) {
            this.exec('CMPAppManagerPlugin', 'getLocalResourceUrl', {url: path}, success, fail);
        },

        /**
         * @method showShortcuts
         * @description 打开快捷方式
         */
        showShortcuts: function() {
            this.exec('CMPShortcutMenuPlugin', 'show', {});
        },

        /**
         * @method hideShortcuts
         * @description 关闭快捷方式
         */
        hideShortcuts: function() {
            this.exec('CMPShortcutMenuPlugin', 'hide', {});
        },

        /**
         * @method getAbsolutePathByUrl
         * @description 获取本地路径
         * @param {string} path 路径
         */
        setNavBarRedPoint: function(param) {
            this.exec('CMPTabBarPlugin', 'setBadge', param);
        }
    }

})();
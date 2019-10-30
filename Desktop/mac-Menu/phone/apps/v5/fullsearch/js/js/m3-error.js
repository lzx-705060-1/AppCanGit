/**
 * @description 错误模块
 * @author Clyne
 * @createDate 2017-07-25
 */
;(function() {
    //加载模块
    var tools, m3, m3Event, m3Debug, m3i18n, errorMap;
    var wechat = cmp.platform.wechat;
    //构造函数
    var error = function(errorMap) {
        this.errorMap = errorMap;
        this.observe();
    };

    error.prototype = {

        //监听，接收错误
        observe: function() {
            var objThis = this;
            m3Event.addEventListener('m3-get-error', function(e) {
                e = e.data;
                var type = e.errorType;
                //能否匹配错误类型
                if (objThis[type + 'Handle'])
                    objThis[type + 'Handle'](e);
                else
                    objThis.othersHandle(e);
            });
            //全局监听
            window.onerror = function() {
                var e = new Error(arguments[0]);
                e['message'] = arguments[0];
                e['url'] = arguments[1];
                e['line'] = arguments[2];
                objThis.notify(e, 'window');
            };
        },

        //告知异常模块，入口
        notify: function(e, type, callback) {
            if (!tools.isError(e) && tools.isString(e) || tools.isNull(e)) {
                e = new Error('原生接口，没有返回错误信息');
                e.msg = '原生接口，没有返回错误信息';
            }
            e.callback = callback;
            e.errorType = type;
            m3Event.fireEvent('m3-get-error', e);
        },

        //处理原生异常
        nativeHandle: function(e) {
            e.callback(e);
            //告知调试模块
            m3Debug.fireDebug(e, 'native');
        },

        //处理ajax
        ajaxHandle: function(e) {
            var res = e,
                _e = res.callback,
                //是否已经登录app了
                isIn = !window.location.pathname.match(/server-edit|server-add|server-select|login.html|index.html/),
                //操作类型，在map里面没有的，为空
                operType = errorMap[res.code + ''] ? errorMap[res.code + ''].type : '';

            //m3-ajax那边声明了不处理异常，由业务处理,切不为登出code
            if (e.operType === 'none' && operType !== 'logout') {
                operType = 'none';
            }
            //errorMap中存在，且已登录，且操作类型是logout
            if(isIn && operType === 'logout') {
                notifyDebug(
                    '发生了错误code为' + res.code + 'ajax异常', 
                    res.code,
                    res.message,
                    res.requestUrl
                );
                //弹出退出窗口，点击退出
                if(!wechat){
                    window.m3Native.nativeAlert(
                        {
                            title: m3i18n[cmp.language].sessionError,
                            content: res.message || m3i18n[cmp.language].LoginSessionError,
                            buttonTitle: m3i18n[cmp.language].backLogin
                        },
                        function() {
                            cmp.setCookie({});
                            //原生跳转到login.html
                            cmp.server.clearLoginResult({});
                        },
                        function() {
                            
                        }
                    ); 
                };
            //不做任何处理，交给业务处理，模块仅仅只是告知调试模块发生异常
            } else if(operType === 'none') {
                notifyDebug(
                    '发生了错误code为' + res.code + 'ajax异常', 
                    res.code,
                    res.message,
                    res.requestUrl
                );
                _e(res);
            //无网络
            } else if(operType === 'noNetWork') {
                notifyDebug(
                    '发生了错误code为' + res.code + 'ajax异常', 
                    res.code,
                    res.message,
                    res.requestUrl
                );
                cmp.dialog.loading({
                    status: "nonetwork",
                    callback: function() {
                        window.location.reload();
                    }
                });
                
            //没有code的，toast类型，和其他位置错误
            } else if(operType === 'busy') {
                notifyDebug(
                    '发生了错误code为' + res.code + 'ajax异常', 
                    res.code,
                    res.message,
                    res.requestUrl
                );
                cmp.dialog.loading({
                    status: "systembusy",
                    text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + m3i18n[cmp.language].systemBusy + "</span>",
                    callback: function() {
                        window.location.reload();
                    }
                });
                _e(res);
            } else {
                var errorMsg = res.message;
                if (!res.code)
                    errorMsg = '发现未知错误码，请及时告知易成，该错误码' + res.code + '在M3错误映射文件中没有匹配到';
                notifyDebug(
                    errorMsg, 
                    res.code,
                    res.message,
                    res.requestUrl
                );
                cmp.notification.toast(res.message || '接口报错且没有返回任何有效信息', "center");
                _e(res);
            }
        },
        
        

        //处理其他异常
        othersHandle: function(e) {
            //告知调试模块
            m3Debug.fireDebug(e);
        },

        //native错误码处理
        nativeHandleCode: function() {
            //告知调试模块
            m3Debug.fireDebug(e);
        }

    };
    
    /**
     * @description 分发给debug模块 (今后还可以增加一个错误等级的key，来做错误的分级处理，本地日志，提示，上传服务器日志等等)
     * @param code 错误码 
     * @param message 请求错误msg 
     * @param requestUrl 请求地址
     */
    function notifyDebug(m3ErrorMsg, code, message, requestUrl) {
        m3Debug.fireDebug(createErrorObj(
            m3ErrorMsg, 
            code,
            message,
            requestUrl
        ), 'ajax');
    }
    
    /**
     * @description 创建错误对象函数
     * @param errorMsg 自定义的提示语
     * @param code 错误码 
     * @param requestMsg 请求错误msg 
     * @param requestUrl 请求地址
     */
    function createErrorObj(errorMsg, code, requestMsg, requestUrl) {
        var errorMsg = errorMsg,
            errObj = new Error(errorMsg);
        errObj.code = code;
        errObj.msg = requestMsg || '该接口没有返回错误信息';
        errObj.requestUrl = requestUrl || '';
        return errObj;
    }
    
    define(function(require, exports, module){
        tools = require('tools');
        m3 = require('m3');
        m3Event = require('event');
        m3Debug = require('debug');
        m3i18n = require('m3i18n');
        errorMap = require('../js/m3-errormap.js');
        require('event');
        module.exports = window.m3Error = new error(errorMap);
    });
})();
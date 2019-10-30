/**
 * @description ajax模块
 * @author Clyne
 * @createDate 2017-07-25
 */
;(function() {
    //加载模块
    var error, debug, m3, tools, m3i18n, event, cache, defaultTimeout = 30000;
    
    //模块触发
    function m3Ajax(options) {
        event.fireEvent('m3-ajax', options);
    }
    
    function _m3Ajax(options) {
        //获取默认配置信息
        var _options = options,
            objThis = this,
            _m3AjaxSetting = this.getDefaultAjax();
        objThis.isLoaded;
        //缓存callback
        var _s = _options.success,
            _e = _options.error;
        //是否是自定义头部信息
        if (!options.custom) {
            _options = cmp.extend(_m3AjaxSetting, options);
        }
        delete _options.custom;
        //设置超时, 回调设置
        _options.timeout = this.ajaxSetTimeout(_options, defaultTimeout);
        _options.success = this.successCb(_options, _s);
        _options.error = this.errorCb(_options, _e);
        var cacheObj = options.setCache || {};
        //有缓存
        if (cacheObj.key) {
            //根据key获取缓存
            cache.getCache(cacheObj.key, function(data) {
                console.log('----------离线模式数据 start---------');
                data.network = false;
                //离线只加载第一页
                if (cacheObj.pageNum !== 1 && cacheObj.isList)
                    data.data.data = [];
                options.success(data, 'native');
                objThis.isLoaded = true;
            }, function(e) {
                objThis.isLoaded = false;
                //获取缓存失败
                console.log('缓存获取失败');
            });
        }
        cmp.ajax(_options);
    };
    
    //获取默认配置信息
    _m3Ajax.prototype.getDefaultAjax = function() {
        return {
            custom: false, //完全使用自定义请求
            type: "post",
            dataType: "json",
            contentType: "application/json",
            async: true,
            timeout: defaultTimeout,
            customCatchError: true, //自行处理错误回调
            customCatchSuccess: false, //自行处理成功回调
            m3CatchError: true, //m3处理错误回调
            setCache: {}, //isList，是否为list，是list只缓存第一页的数据，key，缓存的索引，key值
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Accept-Language': cmp.language,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function() {},
            error: function() {}
        };
    }
    
    //设置timeout
    _m3Ajax.prototype.ajaxSetTimeout = function(options, defaultTimeout) {
        if (tools.getTypeof(options.timeout) !== "undefined") {
            if (options.url.indexOf("https://") != -1) {
                if (options.timeout < defaultTimeout) {
                    return defaultTimeout;
                } else {
                    return defaultTimeout;
                }
            } else {
                return defaultTimeout;
            }
        }
    }
    
    //成功回调
    _m3Ajax.prototype.successCb = function(_options, _s) {
        return function(res) {
            $('.m3-no-network').remove();
            if (tools.isEmpty(res)) {
                res = {};
            }
            res.network = true;
            var cacheObj = _options.setCache || {};
            //该接口有缓存设置
            if ((cacheObj.key) && (cacheObj.pageNum == 1 || !cacheObj.isList)) {
                cache.setCache(cacheObj.key, res);
            }
            _s(res);
        };
    }
    
    //失败回调
    _m3Ajax.prototype.errorCb = function(options, _e) {
        var objThis = this;
        return function(res) {
            if (res.code == '-1009' && options.noNetworkTgt) {
                appendNode(options.noNetworkTgt);
            }
            var cacheObj = options.setCache || {};
            //加载失败，且无网络，且不显示无网络页面
            if (cacheObj.isShowNoNetWorkPage === false && res.code == '-1009'){
                //如果缓存加载失败，执行回调
                if (objThis.isLoaded === false) {
                    _e();
                    appendNode(options.noNetworkTgt);
                } 
                return;
            }
//            objThis.isLoaded
            res.requestUrl = options.url;
            if (typeof options.m3CatchError != "undefined" && options.m3CatchError == false) {
                //声明，none错误操作类型
                res.operType = 'none';
            }
            //告知错误模块
            error.notify(res, 'ajax', _e);
        }
    }
    
    function appendNode(tgt) {
        var nodeObj = $(tgt),
            firstChild = nodeObj.children().eq(0);
            str = ' <div class="m3-no-network">\
                        <span class="icon-no-network"></span>\
                        <span>' + m3i18n[cmp.language].noNetworkMsg + '</span>\
                    </div>';
        if ($('.m3-no-network').length === 0) {
            if (firstChild.length > 0) {
                firstChild.before(str)
            } else {
                nodeObj.append(str);
            }
        }
    }
    define(function(require, exports, module){
        //加载模块
        error = require('error');
        debug = require('debug');
        m3 = require('m3');
        cache = require('nativeCache');
        tools = require('tools');
        m3i18n = require('m3i18n');
        event = require('event');
        require('zepto');
        //模块监听
        event.addEventListener('m3-ajax', function(e) {
            new _m3Ajax(e.data);
        });
        module.exports = window.m3Ajax = m3Ajax;
    });
})();
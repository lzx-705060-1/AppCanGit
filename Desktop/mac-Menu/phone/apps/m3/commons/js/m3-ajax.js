/**
 * @description ajax模块
 * @author Clyne
 * @createDate 2017-07-25
 */
;(function() {
    //加载模块
    var error, debug, m3, tools, m3i18n, event, cache, nativeApi, defaultTimeout = 30000, 
        //存在ajaxId且code为-1001，-1009的异常接口参数缓存
        ajaxErrorOpMap = {},
        //所以接口存在key noNetworkTgt的缓存
        noNetworkTgt;
    
    //模块触发
    function m3Ajax(options) {
        event.fireEvent('m3-ajax', options);
        if ( options.noNetworkTgt ) {
            noNetworkTgt = options.noNetworkTgt;
        }
        //事件监听,ajaxId解决重复请求，在ajaxErrorOpMap
        if ( options.ajaxId && !window.netWorkEventLoaded ) {
            window.netWorkEventLoaded = true;
            m3.netWorkChangeListener(function( state ) {
                console.log(state);
                if ( state.serverStatus === 'connect' ) {
                    //移除提示
                    $('.m3-no-network').remove();
                    //重新请求-1009，-1001异常接口
                    sendAllAjax();
                } else {
                    var code;
                    if ( state.networkType === 'none' ) {
                        code = '-1009';
                    } else {
                        code = '-1001';
                    }
                    appendNode(noNetworkTgt, code);
                }
            });
        }
    }
    
    function sendAllAjax() {
        for ( var i in ajaxErrorOpMap ) {
            cmp.ajax(ajaxErrorOpMap[i]);
        }
        console.log(ajaxErrorOpMap);
        console.log('释放所有的阻塞请求');
        ajaxErrorOpMap = {};
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
        //判断网络状态
        //设备网络状态：networkType        none、cellular、wifi、unknown
        //服务器连接状态：serverStatus      disconnect、connect
        nativeApi.getNetworkState(function( ret ) {
            //能连接服务器，走在线流程
            if ( ret.serverStatus === 'connect' ) {
                cmp.ajax(_options);
            //直接走离线
            } else { 
                var res = {};
                res.code = '-1001';
                if ( ret.networkType === 'none' ) {
                    res.code = '-1009';
                }
                if (cacheObj.key) {
                    //根据key获取缓存
                    cache.getCache(cacheObj.key, function(data) {
                        //离线只加载第一页
                        if (cacheObj.pageNum == 1 && cacheObj.isList) {
                            options.success(data, 'native');
                        } else if ( !cacheObj.isList ) {
                            options.success(data, 'native');
                        }
                    }, function(e) {
                        cacheNoticeLog(res.code);
                    });
                }
                //是否设置无网络加载容器
                if ( options.noNetworkTgt ) {
                    appendNode(options.noNetworkTgt, res.code);
                }
                //加载失败，且无网络，且不显示无网络页面
                if ( cacheObj.isShowNoNetWorkPage === false ) {
                    //声明，none错误操作类型
                    res.operType = 'none';
                }
                res.requestUrl = options.url;
                if (typeof options.m3CatchError != "undefined" && options.m3CatchError == false) {
                    //声明，none错误操作类型
                    res.operType = 'none';
                }
                //如果设置了ajaxId队列，切缓存不为列表，或者列表页数不为1
                if ( options.ajaxId && cacheObj.pageNum != 1 ) {
                    ajaxErrorOpMap[options.ajaxId] = options;
                }
                //告知错误模块
                error.notify(res, 'ajax', _e);
            }
            
        },function(e) {
            //获取失败，走在线流程
            cmp.ajax(_options);
        })
        
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
            if ( _options.ajaxId ) {
                delete ajaxErrorOpMap[_options.ajaxId];
            }
            if ( res && res.code ) {
                
            } else {
                console.log('-----成功接口规范问题 start-----');
                console.log('接口返回参数不规范，url：' + _options.url);
                console.log('-----成功接口规范问题 end-----');
            }
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
            var cacheObj = options.setCache || {};
            //是否设置无网络加载容器
            if ( options.noNetworkTgt ) {
                appendNode(options.noNetworkTgt, res.code);
            }
            //加载失败，且无网络，且不显示无网络页面
            if ( cacheObj.isShowNoNetWorkPage === false ) {
                //声明，none错误操作类型
                res.operType = 'none';
            }
            //是否能连上服务器
            if ( res.code == '-1009' || res.code == '-1001' ) {
                //是否设置了缓存
                if ( cacheObj.key ) {
                    //根据key获取缓存
                    cache.getCache(cacheObj.key, function(data) {
                        //离线只加载第一页
                        if (cacheObj.pageNum == 1 && cacheObj.isList) {
                            options.success(data, 'native');
                        //非列表
                        } else if ( !cacheObj.isList ) {
                            options.success(data, 'native');
                        }
                    }, function(e) {
                        //获取缓存失败
                        console.log('缓存获取失败');
                    });
                    //如果设置了ajaxId队列，切缓存不为列表，或者列表页数不为1
                    if ( options.ajaxId && cacheObj.pageNum != 1 ) {
                        ajaxErrorOpMap[options.ajaxId] = options;
                    }
                }
            }
            
            res.requestUrl = options.url;
            if (typeof options.m3CatchError != "undefined" && options.m3CatchError == false) {
                //声明，none错误操作类型
                res.operType = 'none';
            }
            //告知错误模块
            error.notify(res, 'ajax', _e);
        }
    }
    
    function appendNode(tgt, code) {
        var nodeObj = $(tgt),
            txt = m3i18n[cmp.language].noNetworkMsg,
            firstChild = nodeObj.children().eq(0);
        if ( code == '-1001' ) {
            txt = m3i18n[cmp.language].noConnectServer
        }
            str = ' <div class="m3-no-network">\
                        <span class="icon-no-network"></span>\
                        <span>' + txt + '</span>\
                    </div>';
        if ($('.m3-no-network').length === 0) {
            if (firstChild.length > 0) {
                firstChild.before(str)
            } else {
                nodeObj.append(str);
            }
        }
    }
    
    function cacheNoticeLog( code ) {
        //获取缓存失败
        if ( code === '-1009' ) {
            console.log('当前无网络且缓存获取失败');
        } else if ( code === '-1001' ) {
            console.log('当前无法连接到服务器且缓存获取失败');
        } else {
            console.log('code为' + code + '的异常，且获取缓存失败');
        }
    }
    define(function(require, exports, module){
        //加载模块
        error = require('error');
        debug = require('debug');
        m3 = require('m3');
        nativeApi = require('native');
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
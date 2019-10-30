/**
 * @description 原生缓存模块
 * @author Clyne
 * @createDate 2017-11-03
 */
;(function() {
    var m3, tools, m3Event, m3Error, nativeApi;
    //定义模块
    define(function(require, exports, module){
        //加载模块
        m3 = require('m3');
        tools = require('tools');
        m3Event = require('event');
        m3Error = require('error');
        nativeApi = require('native');
        module.exports = window.m3Cache = new cache();
    });
    
    //构造函数
    function cache() {
        //观察者
        this.observer();
    }
    
    //原生API
    var nativeAPI = {
        
        //获取缓存的原生接口
        GET: function(options) {
            nativeApi.getCacheByKey(options.data.key, function(res) {
                res = dataFormat(res);
                options.data.success(res)
            }, function(e) {
                options.data.error(e);
            }, options.data.isCommon);
        },
        
        //设置缓存的原生接口
        SET: function(options) {
            var data = dataFormat(options.data.value, 'toString');
            nativeApi.setCacheByKey({
                key: options.data.key,
                value: data,
                isGlobal: options.data.isCommon
            }, function(res) {
                options.data.success(res);
            }, function(e) {
                options.data.error(e);
            });
        },
        
        //获取缓存的原生接口
        DELETE: function(options) {
           console.log(new Error('暂无DELETE的cache操作接口'));
        }
    };
    
    //原型链
    cache.prototype = {
        
        //观察者
        observer: function() {
            //监听器
            m3Event.addEventListener('m3-cache', function(e) {
                //非公共缓存
                if (!e.data.isCommon) {
                    //key的唯一性拼接，根据serverId，userId，key组合
                    e.data.key = getKey(e.data.key);
                }
                //利用nativeAPI的key值作为function的name执行
                nativeAPI[e.data.type](e);
            });
        },
        
        /**
         * @description 获取缓存
         * @param key 缓存索引，唯一标识 [Object string]
         */
        getCache: function(key, successCb, errorCb) {
            //分发到缓存模块 获取
            m3Event.fireEvent('m3-cache', {
                type: 'GET',
                key: key,
                success: successCb || function() {},
                error: errorCb || function() {}
            });
        },
        
        /**
         * @description 设置缓存
         * @param key 缓存索引，唯一标识 [Object string]，如果key不存在则新建，存在则跟新
         * @param value 缓存值  [Object 所有类型]
         */
        setCache: function(key, value, successCb, errorCb) {
            //分发到缓存模块，设置
            m3Event.fireEvent('m3-cache', {
                type: 'SET',
                key: key,
                value: value,
                success: successCb || function() {},
                error: errorCb || function() {}
            });
        },
        
        /**
         * @description 设置公共缓存
         * @param key 缓存索引，唯一标识 [Object string]，如果key不存在则新建，存在则跟新
         * @param value 缓存值  [Object 所有类型]
         */
        setCommonCache: function(key, value, successCb, errorCb) {
            //分发到缓存模块，设置
            m3Event.fireEvent('m3-cache', {
                type: 'SET',
                key: key,
                isCommon: true,
                value: value,
                success: successCb || function() {},
                error: errorCb || function() {}
            });
        },
        
        /**
         * @description 获取公共缓存
         * @param key 缓存索引，唯一标识 [Object string]
         */
        getCommonCache: function(key, successCb, errorCb) {
            //分发到缓存模块 获取
            m3Event.fireEvent('m3-cache', {
                type: 'GET',
                key: key,
                isCommon: true,
                success: successCb || function() {},
                error: errorCb || function() {}
            });
        },
        
        /**
         * @description 移除缓存
         * @param key 需要移除的缓存索引，唯一标识 [Object string]
         */
        removeCache: function(key, callback) {
            //分发到缓存模块,移除操作
            m3Event.fireEvent('m3-cache', {
                type: 'DELETE',
                key: key,
                callback: callback || function(){}
            });
        }
    };
    
    //格式化数据
    function dataFormat(data, toString) {
        //字符串装换
        if (toString === 'toString') {
            try {
                data = JSON.stringify(data);
                return data;
            } catch(e) {
                return data + '';
            }
        }
        //把字符串装换成对象
        try {
            data = JSON.parse(data);
            return data;
        } catch(e) {
            return data;
        }
    }
    
    //cache key组装函数
    function getKey(key) {
        var serverId = m3.getCurServerInfo().serverID,
            userId = m3.userInfo.getId(),
            companyId = m3.userInfo.getCurrentMember().accountId;
        return 'serverid' + serverId + '-userid' + userId + '-companyId' + companyId + key;
    }
})();
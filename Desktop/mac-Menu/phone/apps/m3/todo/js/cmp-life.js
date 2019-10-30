/**
 * @module life
 * @description CMP生命周期
 * @author Clyne
 */
;(function($) {
    var util, nativeSdk;
    define('todo/js/cmp-life.js', function(require, exports, module) {
        util = require('todo/js/cmp-util.js');
        nativeSdk = require('todo/js/cmp-native-sdk.js');
        module.exports = life;
    });
    function life(target, ops) {
        if (this instanceof life) {
            this.target = target;
            init(this, ops);
        } else {
            return new life(target, ops);
        }
    }

    function init(_this, ops) {
        mixMethods(_this, ops.methods || {});
        _this.$onloaded = ops.$onloaded || function() {};
        $.ready(function() {
            delete _this.methods;
            addWebviewListener(_this, ops.$webviewListener);
            _this.pageParam = $.href.getParam();
            _this.urlParam = util.getParamByUrl();
            _this.$onloaded();
        })
    }

    function addWebviewListener(_this, listenerMap) {
        if (!listenerMap) {return;}
        _this.$webviewListerHandleMap = listenerMap;
        for (var eventName in listenerMap) {
            execHandle(_this, eventName);
        }
    }

    function execHandle (_this, eventName) {
        var handle = function(e) {
            //指针指向 生命周期实例
            _this.$webviewListerHandleMap[ eventName ].call(_this, e);
        };
        var docBind = function(eventName) {
            document.addEventListener(eventName, function(e) {
                handle(e);
            });
        }
        if (eventName === 'com.seeyon.m3.phone.webBaseVC.didAppear') {
            setTimeout(function() {
                docBind(eventName);
            }, 2000);
        } else {
            nativeSdk.addWebviewListener(eventName);
            docBind(eventName);
        }
    }

    function mixMethods(_this, methods) {
        for (var i in methods) {
            var _match = i.match(/\$onloaded/);
            if (!_match) {
                _this[ i ] = methods[ i ];
            } else {
                console.error('CMP life Error: "' + _match[ 0 ] + '" should not define in methods');
            }
        }
    }

    life.prototype = {

    }

    //export到cmp全局变量
    $ = $ || {};
    $.life = life;
})(cmp);

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && (define.amd || define.cmd) ? define(factory) :
            (global.SuiEvent = factory());
} (this, function () {
    'use strict';


    //静态API
    var api = {};

    /*以下是SuiEvent的具体实现*/
    api.trigger = function (options, callback) {
        var target = options.target || document;
        var eventName = options.eventName || '';
        var event = new CustomEvent(eventName, {
            detail: {data: options.data, q: Q, promiseArray: []},
            bubbles: true,
            cancelBubble: true,      //是否冒泡
            cancelable: true   //是否阻止
        });

        target.dispatchEvent(event);
        Q.all(event.detail.promiseArray).then(function(){
            console.log(arguments);
            var result = arguments[0].indexOf(false) == -1;
            callback && callback(null, {success: result});
        }, function(){
            //出现异常
            callback && callback({message: 'exception in ' + options.eventName});
        });
    }

    api.promise = function (e, handler) {
        if (e && e.detail && typeof e.detail.q == 'function' && typeof handler == 'function') {
            var q = e.detail.q;
            var deferred = q.defer();
            handler(e.detail.data, function(err, result){
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
            if (e.detail.promiseArray instanceof Array) {
                e.detail.promiseArray.push(deferred.promise);
            }
        }
    }

    /*以上是SuiEvent的具体实现*/

    api.version = '1.0.1';
    return api;

}));
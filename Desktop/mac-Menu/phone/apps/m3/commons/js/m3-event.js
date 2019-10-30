/**
 * @description 事件流模块，各个模块的观察者
 * @author Clyne
 * @createDate 2017-07-25
 */
;(function() {
    //加载模块
        var tools;
        //构造函数
        var event = function() {
            //cb缓存
            this.cbCache = {};
        };

        //原型链
        event.prototype = {

            //注册事件
            registEvent: function(eventName, value){
                var e = document.createEvent('HTMLEvents');
                e.initEvent(eventName, true, true);
                e.data = value;
                return e;
            },

            //触发事件
            fireEvent: function(eventName, value){
                var e = this.registEvent(eventName, value);
                document.dispatchEvent(e);
            },

            //添加监听
            addEventListener: function(eventName, callback){
                //callback验证
                if (!tools.isFunction(callback)) {
                    throw new Error('事件' + eventName + '的callback参数不是一个function');
                    return;
                }
                //是否重名
                if (this.cbCache[eventName]) {
                    throw new Error('regist event fail, 兄弟，该事件已被注册，麻烦换一个骚气一点的名字');
                    return;
                }
                document.addEventListener(eventName, callback, false);
                this.cbCache[eventName] = callback;
            },

            //移除
            removeEventListener: function(eventName){
                //验证是否存在于缓存中
                if (tools.isUndefined(this.cbCache[eventName])) {
                    console.warm('你移除的' + eventName + '事件在callback缓存里面并没有找到对应的callback，请仔细检查你的代码')
                    return;
                }
                document.removeEventListener(eventName, this.cbCache[eventName], false);
                delete this.cbCache[eventName];
            }
        };
    define(function(require, exports, module){
        tools = require('tools');
        module.exports = new event();
    });
})();
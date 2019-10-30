/**
 * Created by yang on 2017/2/20.
 */
(function (_) {
    _.webViewListener= {};
    _.webViewListener.add = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        if(_.platform.CMPShell){
            cordova.exec(
                _options.success,
                _options.error,
                "CMPWebviewListenerAddPlugin",
                "add",
                [
                    {
                        type: _options.type,
                    }
                ]
            );
        }
    };
    _.webViewListener.fire = function (options) {
        var _options = {
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        if(_.platform.CMPShell){
            cordova.exec(
                _options.success,
                _options.error,
                "CMPWebviewListenerFirePlugin",
                "fire",
                [
                    {
                        type: _options.type,
                        data: _options.data
                    }
                ]
            );
        }

    };
    /**
     *
     * @param type 需要监听的类型
     * @param callback 触发监听的回调函数
     */
    _.webViewListener.addEvent = function(type,callback){
        document.addEventListener(type,function(e){
            var data = e.data;
            if(typeof callback == "function"){
                callback.call(this,data);
            }
        });
        _.webViewListener.add({
            type:type
        })
    }
})(cmp)
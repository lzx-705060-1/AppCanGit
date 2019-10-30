(function(_){
    //=======================================================================二维码组件 start========================//
    _.barcode = {};
    /**
     * 扫描二维码<br>
     *     可实现扫描二维码和制作二维码的功能
     */
    _.barcode.scan = function (options) {

        var _options = {
            success: null,
            error: null
        };

        _.options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "CDVBarcodeScanner",
            "scan",
            [{}]
        );
    };

    /**
     * 新增的扫描二维码的插件，其作用是将扫描结果发给开发者，开发者自行判断结果后，进行开发者传过来的提示，并且根据回调函数保持是否关闭扫描插件
     */
    _.barcode.holdScan = function(options){
        var _options = {
            success:null,
            error:null
        };
        _options = _.extend(_options, options);
        var callbackObj = {
            sendResult:_.barcode.holdScan.prototype.sendResult,
            close:_.barcode.holdScan.prototype.close
        };
        var success = _options.success;
        var error = _options.error;
        var successFun = function(result){
            if(success && typeof success == "function"){
                success.call(this,result,callbackObj);
            }
        };
        var errorFun = function(result){
            if(error && typeof error == "function"){
                error.call(this,result,callbackObj);
            }
        };
        cordova.exec(
            successFun,
            errorFun,
            "CDVBarcodeScanner",
            "holdScan",
            [{}]
        );
    };
    /**
     * scan2组件的保持，不关闭
     * @param val，开发者回传值
     */
    _.barcode.holdScan.prototype.sendResult = function(val){
        var callbackVal = val || null;
        cordova.exec(
            function success(){},
            function error(){},
            "CDVBarcodeScanner",
            "holdScanSendResult",
            [
                {
                    callbackVal:callbackVal
                }
            ]
        );
    };
    /**
     * scan2组件的关闭
     * @param val，开发者回传值
     */
    _.barcode.holdScan.prototype.close = function(val){
        var callbackVal = val || null;
        cordova.exec(
            function success(){},
            function error(){},
            "CDVBarcodeScanner",
            "holdScanClose",
            [
                {
                    callbackVal:callbackVal
                }
            ]
        );
    };

    /**
     * scan2组件的保持，不关闭
     * @param val，开发者回传值
     */
    _.barcode.holdScan.notify = function(val){
        var callbackVal = val || null;
        cordova.exec(
            function success(){},
            function error(){},
            "CDVBarcodeScanner",
            "holdScanSendResult",
            [
                {
                    callbackVal:callbackVal
                }
            ]
        );
    };
    /**
     * scan2组件的关闭
     * @param val，开发者回传值
     */
    _.barcode.holdScan.closeScan = function(val){
        var callbackVal = val || null;
        cordova.exec(
            function success(){},
            function error(){},
            "CDVBarcodeScanner",
            "holdScanClose",
            [
                {
                    callbackVal:callbackVal
                }
            ]
        );
    };
    /**
     * 制作二维码
     * @class makeBarScan
     * @namespace cmp
     * @constructor
     * @param options {object} 配置项参数
     * @param {String} options.data 被用于制作二维码的字符串数据
     */
    _.barcode.makeBarScan = function (options) {
        var _options = {
            data: '',
            success: null,
            error: null
        };

        _.options = _.extend(_options, options);

        cordova.exec(
            _options.success,
            _options.error,
            "CDVBarcodeScanner",
            "encode",
            [
                {
                    "data": _options.data
                }
            ]
        );
    }
    //=======================================================================二维码组件 end========================//
})(cmp);
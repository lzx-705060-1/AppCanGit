(function(_){
    /**
     * 语音机器人设置
     * @type {{}}
     * @author by guojl
     */
    _.speechRobot = {};

    //************************开关**************************

    var _setRobotOnOffState = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "setRobotOnOffState",
            [{
                isOnOff:options.isOnOff
            }]
        );
    };

    /**
     * 打开机器人
     * options 成功失败回调
    */
    _.speechRobot.open = function(options) {
        var _options =_.extend({isOnOff:true},options);
        _setRobotOnOffState(_options);
    };

    /**
     * 关闭机器人
     * options 成功失败回调
    */
    _.speechRobot.close = function(options) {
        var _options =_.extend({isOnOff:false},options);
        _setRobotOnOffState(_options);
    };


    /**
     * 获取机器人开关状态
     * options 成功失败回调 返回值res为 true false
    */
    _.speechRobot.getRobotOnOffState = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    var val = res.isOnOff;
                    if (typeof val == "string"){
                        val = val == "true";
                    }
                    options.success(val);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "getRobotOnOffState",
            [{}]
        );
    };
    

    //*************************语音按钮*************************


    var _setRobotAssistiveTouchOnShowState = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "setRobotAssistiveTouchOnShowState",
            [{
                isOnShow:options.isOnShow
            }]
        );
    };


    /**
     * 打开机器人语音按钮
     * options 成功失败回调
    */
    _.speechRobot.openAssistiveTouch = function(options) {
        var _options =_.extend({isOnShow:true},options);
        _setRobotAssistiveTouchOnShowState(_options);
    };

    /**
     * 关闭机器人语音按钮
     * options 成功失败回调
    */
    _.speechRobot.closeAssistiveTouch = function(options) {
        var _options =_.extend({isOnShow:false},options);
        _setRobotAssistiveTouchOnShowState(_options);
    };


    /**
     * 获取机器人语音按钮开关状态
     * options 成功失败回调 返回值res为 true false
    */
    _.speechRobot.getAssistiveTouchState = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    var val = res.isOnShow;
                    if (typeof val == "string"){
                        val = val == "true";
                    }
                    options.success(val);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "getRobotAssistiveTouchOnShowState",
            [{}]
        );
    };


    //************************自动唤醒**************************


    var _setRobotAutoAwakeState = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "setRobotAutoAwakeState",
            [{
                isAutoAwake:options.isAutoAwake
            }]
        );
    };


    /**
     * 打开机器人自动唤醒
     * options 成功失败回调
    */
    _.speechRobot.openAutoAwake = function(options) {
        var _options =_.extend({isAutoAwake:true},options);
        _setRobotAutoAwakeState(_options);
    };


    /**
     * 关闭机器人自动唤醒
     * options 成功失败回调
    */
    _.speechRobot.closeAutoAwake = function(options) {
        var _options =_.extend({isAutoAwake:false},options);
        _setRobotAutoAwakeState(_options);
    };

    /**
     * 获取机器人自动唤醒开关状态
     * options 成功失败回调 返回值res为 true false
    */
    _.speechRobot.getAutoAwakeState = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    var val = res.isAutoAwake;
                    if (typeof val == "string"){
                        val = val == "true";
                    }
                    options.success(val);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "getRobotAutoAwakeState",
            [{}]
        );
    };


    //************************激活时间**************************

    /**
     * 设置机器人激活时间
     * options {startTime:xx,endTime:xx}
    */
    _.speechRobot.setRobotWorkTime = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "setRobotWorkTime",
            [{
                startTime:options.startTime,
                endTime:options.endTime
            }]
        );
    };

    /**
     * 获取机器人激活时间
     * 返回值 {startTime:xx,endTime:xx}
    */
    _.speechRobot.getRobotWorkTime = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "getRobotWorkTime",
            [{}]
        );
    };

    //*****************************************************

    /**
     * 获取机器人所以配置
     * 返回值 {isOnOff:xxx,isOnShow:xxx,isAutoAwake:xxx,startTime:xx,endTime:xx}
     */
    _.speechRobot.getRobotConfig = function(options) {
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "getRobotConfig",
            [{}]
        );
    };

    /**
     * 控制显示和隐藏小致图标,有些页面不需要显示
     * @param showOrNot 显示还是隐藏
     * @param options 回调等
     */
    _.speechRobot.toggleShowAssistiveTouchOnPageSwitch = function (showOrNot,options) {
        cordova.exec(
            function success(res){
                if(options && typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(error){
                if(options && typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "toggleShowAssistiveTouchOnPageSwitch",
            [{
                showOrNot:showOrNot
            }]
        );
    };

    //检查小智权限
    _.speechRobot.checkPermission = function(options){
        var _options = _.extend({
            success:null,
            error:null
        },options);
        cordova.exec(
             _options.success,
            _options.error,
            "CMPSpeechRobotConfigPlugin",
            "checkXiaoZhiPermission",
            [{}]
        );
    };
    //获取语音输入内容
    _.speechRobot.getSpeechInput = function(options){
        var _options = _.extend({
            success:null,
            error:null
        },options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPSpeechRobotConfigPlugin",
            "getSpeechInput",
            [{}]
        );
    };

    //设置智能消息开关
    _.speechRobot.setMessageSwitch = function(options){
        cordova.exec(
            function success(res){
                if(typeof options.success == "function"){
                    options.success(res);
                }
            },
            function error(error){
                if(typeof options.error == "function"){
                    options.error(error);
                }
            },
            "CMPSpeechRobotConfigPlugin",
            "setMessageSwitch",
            [{
                mainSwitch:options.mainSwitch,//总开关
                cultureSwitch:options.cultureSwitch,//文化信息开关
                statisticsSwitch:options.statisticsSwitch,//统计数据开关
                arrangeSwitch:options.arrangeSwitch,//工作任务开关
                chartSwitch:options.chartSwitch//报表数据开关
            }]
        );
    }

})(cmp);

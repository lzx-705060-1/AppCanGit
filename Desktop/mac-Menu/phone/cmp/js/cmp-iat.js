(function(_){
    //============================================================语音识别组件 start====================================//
    var DEFAULT_IAT_LANGUAGE = "zh_cn";			// 默认中文
    var DEFAULT_IAT_VADBOS = "5000";			// 默认后端等待时间5s
    var DEFAULT_IAT_VADEOS = "1000";			// 默认前端等待时间1s
    var DEFAULT_IAT_SPEEcordovaH_TIME_OUT = "30000";	// 默认说话时间30s
    var DEFAULT_IAT_VOIcordovaE_TYPE = "abnf";		// 默认语音识别类型云识别
    _.iat = {};
    /**
     * 语音输入
     */
    _.iat.input = function (cfg) {
        cordova.exec(
                typeof cfg.success == "undefined" ? null : cfg.success,
                typeof cfg.error == "undefined" ? null : cfg.error,
            "IATPlugin",
            "input",
            [
                {
                    // 语音输入语言类型
                    "language": typeof cfg.language == "undefined" ? DEFAULT_IAT_LANGUAGE : cfg.language,
                    // 前端等待时间
                    "vadbos": typeof cfg.vadbos == "undefined" ? DEFAULT_IAT_VADBOS : cfg.vadbos,
                    // 后端等待时间
                    "vadeos": typeof cfg.vadeos == "undefined" ? DEFAULT_IAT_VADEOS : cfg.vadeos,
                    "speechtimeout": typeof cfg.speechtimeout == "undefined" ? DEFAULT_IAT_SPEEcordovaH_TIME_OUT : cfg.speechtimeout
                }
            ]);
    };

    /**
     * 语音指令
     */
    _.iat.bnf = function (cfg) {
        cordova.exec(
                typeof cfg.success == "undefined" ? null : cfg.success,
                typeof cfg.error == "undefined" ? null : cfg.error,
            "IATPlugin", "startBnf",
            [
                {
                    "language": typeof cfg.language == "undefined" ? DEFAULT_IAT_LANGUAGE : cfg.language,
                    "vadbos": typeof cfg.vadbos == "undefined" ? DEFAULT_IAT_VADBOS : cfg.vadbos,
                    "vadeos": typeof cfg.vadeos == "undefined" ? DEFAULT_IAT_VADEOS : cfg.vadeos,
                    "speechtimeout": typeof cfg.speechtimeout == "undefined" ? DEFAULT_IAT_SPEEcordovaH_TIME_OUT : cfg.speechtimeout,
                    //语音识别类型，abnf云识别,bnf本地识别
                    "voicetype": typeof cfg.voicetype == "undefined" ? DEFAULT_IAT_VOIcordovaE_TYPE : cfg.voicetype,
                    // slots 要插入到语法中的数据
                    // {"contact": {"data": "李志强|王鑫", "type": "contacts"}}
                    "slots": typeof cfg.slots == "undefined" ? {} : cfg.slots
                }
            ]);
    };

    //============================================================语音识别组件 end====================================//

    //语音识别组件关闭
    _.iat.close = function(cfg){
        cordova.exec(
            function(){},
            function(){},
            "IATPlugin",
            "close",
            [
                {}
            ]);
    }
})(cmp);
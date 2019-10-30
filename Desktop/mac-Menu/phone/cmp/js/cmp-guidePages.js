// 引导页插件
(function(_) {
    _.guidePages = {};
    /*
     * 显示引导页
     * @return 1:立即体验  2:跳过
     */
    _.guidePages.showGuidePages = function (cfg) {
        var _options;
        _options = {
            success: null,
            error: null,
            "appId": "", // 应用id
            "version": "", // 应用版本号
            "guidePics": [] // 图片相对路径
        };
        _options = _.extend(_options, cfg);
        if(_.platform.CMPShell) {  //如果是cmp平台
            cordova.exec(
                _options.success,
                _options.error,
                "CMPGuidePagesPlugin",
                "showGuidePages",
                [
                    {
                        "appId":_options.appId,
                        "version":_options.version,
                        "guidePics":_options.guidePics
                    }
                ]
            );
        }
        else {
            // 不支持
        }
    };
})(cmp);
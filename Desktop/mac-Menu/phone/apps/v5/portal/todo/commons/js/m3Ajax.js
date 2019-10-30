(function(m3) {

    m3.ajax = function(options) {

        var _m3AjaxSetting = {
            custom: false, //完全使用自定义请求
            type: "post",
            dataType: "json",
            contentType: "application/json",
            async: true,
            timeout: 30000,
            customCatchError: true,
            showLoading: true, //是否控制显示菊花图
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Accept-Language': cmp.language,
                'Content-Type': 'application/json;charset=UTF-8',
                'token':cmp.token
            },
            success: function() {},
            error: function() {}
        }

        var _options = options;
        if (!options.custom) {
            _options = $.extend(true, _m3AjaxSetting, options);
        }

        delete _options.custom;

        var _s = _options.success,
            _e = _options.error;


        if (typeof options.timeout != "undefined") {
            if (options.url.indexOf("https://") != -1) {
                if (options.timeout < 30000) {
                    _options.timeout = 30000;
                } else {
                    _options.timeout = options.timeout;
                }
            } else {
                _options.timeout = options.timeout;
            }
        }

        _options.success = function(res) {
            if ("200" != res.code && ("500005" != res.code)) {
                if (!res.code || !res.message) {
                    cmp.notification.toast(m3.i18n[cmp.language].serverError, "center");
                } else if (res.message) {
                    //cmp.notification.toast(res.message, "center");
                }
            }

            _s(res);
        }

        _options.error = function(res) {
            console.error("ajaxerror-----begin");
            console.error(_options);
            console.error(res);
            console.error("ajaxerror-----end");
            m3.checkNetwork(function(networkState) {
                if (networkState != "false") {

                    var errorCode = [401, 1001, 1002, 1003, 1004, 1005, 10000, "10000"];//10000是v5返回的,不知道是啥类型,都判断上
                    //1001:用户超出并发数 1002:用户单位超出并发数 1003:管理员踢人 1004:另一地方登录 1005:pc端更新了密码 -1001:服务器连接失败 
                    if (res.code && errorCode.indexOf(parseInt(res.code)) >= 0 &&
                        window.location.pathname.indexOf("server-edit") == -1 &&
                        window.location.pathname.indexOf("server-add") == -1 &&
                        window.location.pathname.indexOf("server-select") == -1 &&
                        window.location.pathname.indexOf("login.html") == -1 &&
                        window.location.pathname.indexOf("index.html") == -1) {
                        cmp.server.showSessionInvalidAlert({
                            title: m3.i18n[cmp.language].sessionError,
                            content: res.message,
                            buttonTitle: m3.i18n[cmp.language].backLogin,
                            success: function() {
                                cmp.setCookie({});
                                //原生跳转到login.html
                                cmp.server.clearLoginResult({});
                            },
                            error: function() {

                            }
                        })
                    } else {

                        if (typeof options.m3CatchError != "undefined" && options.m3CatchError == false) {
                            _e(res);
                            return;
                        }

                        var toastMess;

                        if (res && res.code && res.message) {
                            toastMess = res.message;
                        } else {
                            toastMess = "接口报错且没有返回任何有效信息";
                        }

                        cmp.notification.toast(toastMess, "center");

                        _e(res);
                    }

                } else {
                    cmp.notification.toast(m3.i18n[cmp.language].noNetwork, "center");
                    _e({
                        code: -110, //没有网络
                        message: m3.i18n[cmp.language].noNetwork
                    });
                }
            });
        }
        cmp.ajax(_options);
    }

})(m3);

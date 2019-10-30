/**
 * description: 我的模块——关于
 * author: hbh
 * createDate: 2017-01-07
 */
;(function() {
    var m3, m3i18n, nativeApi;
    define(function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        m3i18n = require('m3i18n');
        nativeApi = require('native');
        require('zepto');
        initPage();
    });
    
    //页面跳转参数
    var canClick = true; //防止在toast没消失的时候在弹出toast
    var m3Version = "";
    //入口函数
    function initPage() {
        cmp.ready(function() {
            initStyle();
            initEvent();
        });
    }

    //样式初始化
    function initStyle() {
        //获取版本号
        nativeApi.getM3VersionInfo(function(res) {
            var str = '';
            m3Version = res.value;
            str += m3i18n[cmp.language].version + ' ' + (res.value || '') + '<br />';
            str += m3i18n[ cmp.language ][ 'm3-build' ] + ' ' + (res.build || '');
            $(".title").html(str);
        }, function() {
            console.log('获取版本信息失败');
            $(".title").html('');
        });
    }

    //事件初始化
    function initEvent() {
        //检查新版本
        $("#check").on("tap", function() {
            if (canClick) {
                canClick = false;
                cmp.dialog.loading(m3i18n[cmp.language].checkVersion);
                setTimeout(function() {
                    checkVersion();
                }, 2000);
            }
        });

        //M3引导页
        $("#guidePage").on("tap", function() {
            cmp.guidePages.showGuidePages({
                success: function() {},
                error: function() {},
                "appId": "",
                "version": "",
                "guidePics": []
            });
        });

        //进入意见反馈
        $("#suggestion").on("tap", function() {
            //判断机型
            var model = "";
            if (cmp.os.ios) {
                model = "iPhone"
            } else {
                model = "Android";
            }
            //获取设备信息
            var device = cmp.device.info();
            var options = {
                "客户端": "M3" + model,
                "版本号": m3Version,
                "设备型号": device.version
            };
            var url = 'https://www.formtalk.net/pub.do?f=F0FC55BDC5B943EEFEF20A8C33A499D776742F66BA3AB5695697058C98477B32&data4Display=' + JSON.stringify(options);
            //打开新的webview 跳转到formtalk
            cmp.openWebView({
                useNativebanner: true,
                url: url
            });
        });

        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });

        //左上角返回按钮
        backBtn();
    }

    //检查版本
    function checkVersion() {
        var url = "";
        var message = "";
        var serverUrl,
            serverinfo = m3.getCurServerInfo().shellUpdateSever;
        if ( typeof serverinfo === 'string' ) {
            serverUrl = JSON.parse(serverinfo).url
        } else {
            serverUrl = serverinfo.url
        }
        cmp.shell.checkVersion({
            checkUpdateUrl: serverUrl || '',
            success: function(res) {
                console.log(res);
                cmp.dialog.loading(false);
                if (res.msgcode == 3 || res.msgcode == 4) {
                    url = res.downloadurl;
                    message = res.message;
                    cmp.notification.confirm(message, function(index) {
                        if (index == 0) { //下次再说
                            canClick = true
                        } else if (index == 1) { //立即更新
                            canClick = true;
                            cmp.shell.openDownloadUrl({
                                success: null,
                                error: null,
                                "url": url
                            })
                        }
                    }, m3i18n[cmp.language].versionUpdateTip, [m3i18n[cmp.language].nextTime, m3i18n[cmp.language].update]);
                } else {
                    cmp.notification.toast(m3i18n[cmp.language].recentVersions, "center");
                    setTimeout(function() {
                        canClick = true;
                    }, 2000);
                }
            },
            error: function(err) {
                console.log(err);
                cmp.dialog.loading(false);
                cmp.notification.toast(m3i18n[cmp.language].checkFailed, "center");
                setTimeout(function() {
                    canClick = true;
                }, 2000);
            }
        });
    }

    //左上角返回按钮
    function backBtn() {
        $("#backBtn").on("tap", function() {
            cmp.href.back();
        });
    }
})();

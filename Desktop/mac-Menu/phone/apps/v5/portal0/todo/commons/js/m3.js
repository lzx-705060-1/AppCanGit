/**
 * Created by yang on 16/9/19.
 */


(function(global, factory) {
    //
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("m3 requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window) {

    var m3 = {};

    window.m3 = m3;

    window.openNewPage = 0; //0:普通url跳转 1新开webView 2:url跳转,强制设置无动画,解决离线消息穿透白屏问题

    cmp.href.openWebViewCatch = function() {
        return openNewPage;
    };

    //默认没有发协同权限
    m3.hasColNew = false;

    m3.closeGestureAndIndex = function() {
        cmp.app && cmp.app.hideStartPage && cmp.app.hideStartPage({});
        if (m3.userInfo.getCurrentMember().id) {
            cmp.gestureLock && cmp.gestureLock.close && cmp.gestureLock.close({});
        }
    };


    m3.androidclick = 0;
    m3.time = m3.timeOne = m3.timeTwo = 0;
    m3.exitApp = function() {

        m3.androidclick++;
        m3.time = new Date();
        if (m3.androidclick == 1) {
            m3.timeOne = m3.time.getSeconds() + m3.time.getMinutes() * 60 + m3.time.getHours() * 3600;
            cmp.notification.toast(m3.i18n[cmp.language].backCue, 'bottom', 1000);
            setTimeout(function() {
                m3.androidclick = 0;
            }, 1000)
        } else if (m3.androidclick == 2) {
            m3.timeTwo = m3.time.getSeconds() + m3.time.getMinutes() * 60 + m3.time.getHours() * 3600;

            if (m3.timeTwo - m3.timeOne < 3) {
                cmp.app.exitApp({ //需要在页面上导入cmp-app.js
                    success: function(res) {},
                    error: function(res) {}

                });
            } else {
                m3.androidclick = 0;
            }
        } else {
            m3.androidclick = 0;
        }
    }

    m3.client = (function() {
        if (/(iPhone)/i.test(navigator.userAgent)) {
            return "iphone";
        } else if (/(iPad)/i.test(navigator.userAgent)) {
            return "ipad";
        } else if (/(Android)/i.test(navigator.userAgent)) {
            return "androidphone";
        } else {
            return "无法判断手机类型";
        }
    })();

    m3.curServerInfo = {
        ip: "",
        port: "",
        model: "",
        url: "",
        allServer: ""
    };

    function initIPStorage() {
        m3.curServerInfo.ip = cmp.storage.get("editAddress");
        m3.curServerInfo.port = cmp.storage.get("editPort");
        m3.curServerInfo.model = cmp.storage.get("editModel");
        m3.curServerInfo.url = m3.curServerInfo.model + "://" + m3.curServerInfo.ip + ":" + m3.curServerInfo.port;
        m3.curServerInfo.allServer = JSON.parse(cmp.storage.get("localData")) || [];
    };
    initIPStorage();

    m3.setServerInfo = function(ipInfo) {
        m3.curServerInfo.ip = ipInfo.ip;
        m3.curServerInfo.port = ipInfo.port;
        m3.curServerInfo.model = ipInfo.model;
        m3.curServerInfo.url = m3.curServerInfo.model + "://" + m3.curServerInfo.ip + ":" + m3.curServerInfo.port;

        cmp.storage.save("editAddress", ipInfo.ip);
        cmp.storage.save("editPort", ipInfo.port);
        cmp.storage.save("editModel", ipInfo.model);
    };

    m3.getServerInfo = function(ipInfo) {
        var info = cmp.storage.get(ipInfo.ip + "_" + ipInfo.port);

        var s = null;
        try {
            s = JSON.parse(info) || {};
        } catch (e) {
            s = {};
        }
        return s;
    };

    m3.userInfo = {

        getId: function() {
            return cmp.storage.get("userId_" + m3.curServerInfo.url);
        },

        setId: function(id) {

            cmp.storage.save("userId_" + m3.curServerInfo.url, id)
        },
        setUserName: function(name) {
            var user = m3.userInfo.getCurrentMember();
            user.loginName = name;
            m3.userInfo.setCurrentMember(user);
        },
        setPwd: function(pwd) {
            var user = m3.userInfo.getCurrentMember();
            user.loginPwd = pwd;
            if (pwd && pwd != "") {
                user.voiceLoginPwd = pwd;
            }

            m3.userInfo.setCurrentMember(user);
        },
        setLoginStatus: function(status) {
            var user = m3.userInfo.getCurrentMember();
            user.loginStatus = status;
            m3.userInfo.setCurrentMember(user);
        },
        setShowCategory: function(status) {
            var user = m3.userInfo.getCurrentMember();
            user.showAppCategory = status;
            m3.userInfo.setCurrentMember(user);
        },
        setDeviceState:function (DeviceState) {
            var user = m3.userInfo.getCurrentMember();
            user.deviceState = DeviceState;
            m3.userInfo.setCurrentMember(user);
        },
        setVoice:function (status, pwd) {
            var user = m3.userInfo.getCurrentMember();
            user.voiceStatus = status;
            user.voicePwd = pwd;
            m3.userInfo.setCurrentMember(user);
        },
        setIndexPage:function (indexPage) {
            var user = m3.userInfo.getCurrentMember();
            user.indexPage = indexPage;
            m3.userInfo.setCurrentMember(user);
        },
        setAppLayout: function(status) {
            var user = m3.userInfo.getCurrentMember();
            user.appLayOut = status;
            m3.userInfo.setCurrentMember(user);
        },
        setRadius: function(radius) {
            var user = m3.userInfo.getCurrentMember();
            user.radius = radius;
            m3.userInfo.setCurrentMember(user);
        },
        setGesture: function(status, gesPwd) {
            var user = m3.userInfo.getCurrentMember();
            user.gesture = status;
            user.gesturePwd = gesPwd;
            m3.userInfo.setCurrentMember(user);
        },
        setVoice: function(status, pwd) {
            var user = m3.userInfo.getCurrentMember();
            user.voiceStatus = status;
            user.voicePwd = pwd;
            m3.userInfo.setCurrentMember(user);
        },
        setPic: function(pic) {
            var user = m3.userInfo.getCurrentMember();
            user.iconUrl = pic;
            cmp.storage.save("iconUrl", user.iconUrl);
            m3.userInfo.setCurrentMember(user);
        },
        setUserConfig: function(hasAddressBook, hasIndexPlugin, warkMarkConfig) {
            var user = m3.userInfo.getCurrentMember();
            user.hasAddressBook = hasAddressBook;
            user.hasIndexPlugin = hasIndexPlugin;
            /* {
                 //水印内容：
                 "materMarkNameEnable" : "false",    姓名
                 "materMarkDeptEnable" : "true",     单位
                 "materMarkTimeEnable" : "false",    时间
                 //是否设置水印：
                 "materMarkEnable" : "true"
                 }*/
            if (warkMarkConfig) {
                user.materMarkNameEnable = warkMarkConfig.materMarkNameEnable;
                user.materMarkDeptEnable = warkMarkConfig.materMarkDeptEnable;
                user.materMarkTimeEnable = warkMarkConfig.materMarkTimeEnable;
                user.materMarkEnable = warkMarkConfig.materMarkEnable;
            }
            m3.userInfo.setCurrentMember(user);
        },
        setLogImgUrl: function(logImgUrl) {
            var user = m3.userInfo.getCurrentMember();
            user.logImgUrl = logImgUrl;
            m3.userInfo.setCurrentMember(user);
        },
        setLogBgUrl: function(logBgUrl) {
            var user = m3.userInfo.getCurrentMember();
            user.logBgUrl = logBgUrl;
            m3.userInfo.setCurrentMember(user);
        }
    };

    m3.userInfo.getCurrentMember = function() {
        var user = cmp.storage.get("userId_" + m3.userInfo.getId() + "server_" + m3.curServerInfo.url) || {};
        var returnUser = {};
        try {
            returnUser = JSON.parse(user);
        } catch (e) {
            returnUser = {};
        }
        return returnUser;
    }

    m3.userInfo.setCurrentMember = function(user) {
        if (user.id) {

            return cmp.storage.save("userId_" + user.id + "server_" + m3.curServerInfo.url, JSON.stringify(user || {}));
        }
    }

    m3.showTime = function(data) {
        // var now = new Date();
        // now.setHours(0);
        // now.setMinutes(0);
        // now.setSeconds(0);
        // var yes = now - 86400000;
        // var time = new Date(data.replace(new RegExp("-", "gm"), "/")).getTime();
        // if (time - now > 3600000 * 24) {
        //     return data.slice(0, 10);
        // } else if (now >= time && time > yes) {
        //     return m3i18n[cmp.language].yesterday;
        // } else if (time <= yes) {
        //     return data.slice(0, 10);
        // } else {
        //     return data.slice(11, 16);
        // }

        //昨天显示 昨天: 时间点
        var now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        var addZore = function(data) {
            data = data + '';
            if (data.length > 1)
                return data;
            else
                return '0' + data;
        }
        var yes = now - 86400000,
            dataObj = new Date(data.replace(new RegExp("-", "gm"), "/")),
            time = dataObj.getTime(),
            ymm = addZore(dataObj.getFullYear()) + '-' + addZore(dataObj.getMonth() + 1) + '-' + addZore(dataObj.getDate()),
            hm = addZore(dataObj.getHours()) + ':' + addZore(dataObj.getMinutes());
        if (time - now > 3600000 * 24) {
            return data.slice(0, 10);
        } else if (now >= time && time > yes) {
            return m3.i18n[cmp.language].yesterday + ' ' + hm;
        } else if (time <= yes) {
            //fk this shit! 改了无数遍了
            // if (now.getYear() === dataObj.getYear()) {
            //     return addZore(dataObj.getMonth() + 1) + '-' + addZore(dataObj.getDate()) + ' ' + hm;
            // }
            // return (ymm + ' ' + hm);
            return ymm;
        } else {
            return data.slice(11, 16);
        }
    };

    m3.showPic = function(tag) {
        tag.on("load", function() {
            tag.css({
                "width": "auto",
                "height": "auto",
                "left": 0,
                "top": 0
            });
            var width = tag.width();
            var height = tag.height();
            width > height ? tag.css("height", "100%") : tag.css("width", "100%");
            width = tag.width();
            height = tag.height();
            var widthParent = tag.parent().width();
            var heightParent = tag.parent().height();
            width > height ? tag.css("left", -(width - widthParent) / 2 + "px") : tag.css("top", -((height - heightParent) / 2 + 1) + "px");

        });
    };

    m3.getCurServerInfo = function() {
        var info = cmp.storage.get(m3.curServerInfo.ip + "_" + m3.curServerInfo.port);
        return JSON.parse(info);
    };

    //检查网络状态
    m3.checkNetwork = function(callback) {
        cmp.connection.getNetworkType({
            success: function(networkState) {
                if (networkState == "none") {
                    //cmp.notification.toast(m3.i18n[cmp.language].noNetwork, "center");
                    if (window.location.pathname.indexOf("index.html") !== -1) {
                        cmp.notification.toast(m3.i18n[cmp.language].noNetwork, "center");
                        setTimeout(function() {
                            m3.state.go(m3.href.map.login_index, "", m3.href.animated.left, false);
                        }, 2000);
                    } else {
                        callback && callback("false");
                    }
                } else {
                    callback && callback(networkState);
                }
            }
        });
    };

    m3.setBadgeNumber = function(callback) {
        m3.db.getMessageUnreadCount(function(num) {
            cmp.app.setApplicationIconBadgeNumber({
                badgeNumber: num,
                success: function(res) {

                },
                error: function(err) {

                }
            });

            callback && callback(num);
        });
    };


    m3.loadApp = function(app, from) {
        var entry = "";
        switch (app.appType) {
            case "integration_remote_url"://加载远程地址
                entry = app.entry;
                cmp.href.next(entry,app.parameters);
                break;
            case "integration_native":
                if (app.entry) {
                    var entryIsJson = undefined,
                        tmpentry = undefined;

                    var modules = ["message", "todo", "application"];

                    modules.indexOf(from) > 1 ? entryIsJson = true : entryIsJson = false;


                    if (entryIsJson) {
                        try {
                            tmpentry = JSON.parse(app.entry);
                        } catch (e) {
                            cmp.notification.confirm("打开应用命令有误,请检查后台配置或者服务器端返回格式错误", null, "失败", ["确定"]);

                            return;
                        }
                    } else {
                        tmpentry = app.entry.split("|");
                    }


                    var device = ["iphone", "ipad", "androidphone", "androidpad", "WP"];
                    var paramFrom = ["iPhone", "iPad", "androidPhone", "androidPad", "WP"];

                    if (entryIsJson) {
                        var index = device.indexOf(m3.client);
                        var key = paramFrom[parseInt(index)];
                        entry = tmpentry[key];
                    } else {
                        var index = device.indexOf(m3.client);
                        entry = tmpentry[parseInt(index)];
                    }

                } else {
                    cmp.notification.confirm(
                        m3.i18n[cmp.language].noParam,
                        function(index) {
                            //console.log(index);
                        },
                        "", [m3.i18n[cmp.language].iKnow]
                    );
                    return;
                }


                break;
            case "default":
            case "integration_local_h5":
                break;
            default:
                break;
        }

        //在微信端loadApp无意义  xinpei 2017-09-28
        // cmp.app.loadApp({
        //     "appId": app.appId,
        //     "bundle_identifier": app.bundleIdentifier || "",
        //     "bundle_name": app.bundleName || "",
        //     "team": app.domain || "",
        //     "version": app.version || "",
        //     "appType": app.appType || "",
        //     "downloadUrl": app.downloadUrl || "",
        //     "entry": entry,
        //     "parameters": app.gotoParam || "",
        //     success: function(res) {
        //         //console.log(res);
        //     },
        //     error: function(res) {
        //
        //         var mess = "";
        //
        //         switch (res.code) {
        //
        //             case "3000":
        //                 mess = m3.i18n[cmp.language].openAppFailTip1;
        //                 break;
        //             case "3001":
        //                 mess = m3.i18n[cmp.language].openAppFailTip2;
        //                 break;
        //             case "3002":
        //                 mess = m3.i18n[cmp.language].openAppFailTip3;
        //                 break;
        //             default:
        //                 mess = m3.i18n[cmp.language].openAppFailTip4;
        //         }
        //
        //         cmp.notification.confirm(
        //             mess,
        //             function(index) {
        //                 //console.log(index);
        //             },
        //             "", [m3.i18n[cmp.language].iKnow]
        //         );
        //     }
        // });
    }

    m3.parseQueryString = function(url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = reg_url.exec(url),
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1],
                result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    };


    /**
     * 穿透
     * @param  {[type]} options.appId [应用appId]
     * @param  {[type]} options.type [从哪里穿透 todo/message]
     * @param  {[type]} options.returnUrl [返回地址]
     * @param  {[type]} options.sendParms [应用所需参数]
     * @param  {[type]} options.returnParms [其他扩展参数]
     */
    m3.penetrated = function(options) {
        openNewPage = options.openNewPage;

        var option = {
            appId: options.appId,
            serverVersion: "1.0.0",
            serverIdentifier: "123123",
            ownerId: "123123",
            success: function(appRes) {
                cmp.app.getAppInfo({
                    appId: options.appId,
                    version: "v",
                    success: function(res) {
                        if (m3.penetratedHandle(appRes.openAppMethod.replace(".openApp", ""), appRes.jsapiurl)) {

                            if (!options.sendParms) {
                                console.error("穿透接口无返回参数");
                            } else {
                                if (options.appId == "43") {
                                    m3.s3Caller("bizApi.openBizInfo", ["", options.sendParms, options.returnParms], "", "");
                                } else {
                                    m3.s3Caller(appRes.openAppMethod, [options.type, "", options.sendParms, options.returnParms], "", "");
                                }
                            }
                        }
                    },
                    error: function() {
                        // cmp.href.back();
                    }
                });
            },
            error: function(res) {
                cmp.notification.confirm("无法打开应用,请管理员检查对应应用包配置", null, "失败", ["确定"]);

                //cmp.href.back();
            }
        };
        cmp.app.getJSAPIUrl(option);
    }

    m3.penetratedByUrl = function(appInfo,callback){
        var pkage = appInfo.package,
            jsapi = appInfo.jsapi,
            openAppMethod = appInfo.openAppMethod;
        var jsapiurl = pkage + "/"+jsapi;

        if (m3.penetratedHandle(openAppMethod.replace(".openApp", ""), jsapiurl)) {

            if (!appInfo.sendParms) {
                console.error("穿透接口无返回参数");
                callback && callback({error:true});
            } else {
                try{
                    callback && callback();
                    if (appInfo.appId == "43") {
                        m3.s3Caller("bizApi.openBizInfo", ["", appInfo.sendParms, appInfo.returnParms], "", "");
                    } else {
                        m3.s3Caller(openAppMethod, [appInfo.type, "", appInfo.sendParms, appInfo.returnParms], "", "");
                    }
                }catch (e){
                    callback && callback({error:true});
                }

            }
        }
    };


    m3.penetratedHandle = function(id, url) {

        if ($("#" + id).length > 0) {
            return true;
        }
        var xmlHttp = null;
        if (window.ActiveXObject) //IE
        {
            try {
                //IE6以及以后版本中可以使用
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                //IE5.5以及以后版本可以使用
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else if (window.XMLHttpRequest) //Firefox，Opera 8.0+，Safari，Chrome
        {
            xmlHttp = new XMLHttpRequest();
        }
        //采用同步加载
        xmlHttp.open("GET", url, false);
        //发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错
        xmlHttp.send(null);
        //4代表数据发送完毕
        if (xmlHttp.readyState == 4) {
            //0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存
            if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
                var myHead = document.getElementsByTagName("HEAD").item(0);
                var myScript = document.createElement("script");
                myScript.language = "javascript";
                myScript.type = "text/javascript";
                myScript.id = id;
                try {
                    //IE8以及以下不支持这种方式，需要通过text属性来设置
                    myScript.appendChild(document.createTextNode(xmlHttp.responseText));
                } catch (ex) {
                    myScript.text = xmlHttp.responseText;
                }
                myHead.appendChild(myScript);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    m3.s3Caller = function(expression, args, $scope, defaultValue) {
        var scope = $scope || window;
        if (typeof expression === 'string') {
            expression = expression.replace(/\[/g, '.').replace(/\]/g, '');
            var arr = expression.split('.');
            if (arr.length > 1) {
                expression = scope;
                arr.forEach(function(item) {
                    if (expression && expression[item])
                        scope = expression;
                    expression = expression[item];
                });
            } else {
                expression = scope[expression];
            }
        }

        if (typeof expression === 'function') {
            return expression.apply(scope, args);
        } else if (typeof expression !== 'undefined') {
            //如果是对象，则返回对象本身
            return expression;
        }
        return defaultValue;
    }


    document.addEventListener("deviceready", function() {
        /**
         * 注册唤醒,进入后台事件
         */
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
    }, false);

    //退出应用
    function onPause() {
        if (!m3.curServerInfo.ip) {
            return;
        }
        if (window.location.pathname.indexOf("login.html") === -1 &&
            window.location.pathname.indexOf("index.html") === -1 &&
            window.location.pathname.indexOf("server-edit.html") === -1 &&
            window.location.pathname.indexOf("server-select.html") === -1) {

            var url = "/statistics/hide";
            var data = {
                "statisticId": (cmp.storage.get("statisticId") ? cmp.storage.get("statisticId") : "-1")
            };

            if (cmp.os.ios) {
                m3.ajax({
                    customCatchError: true,
                    m3CatchError: false,
                    showLoading: false,
                    url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3" + url,
                    data: JSON.stringify(data),
                    success: function(res) {
                        //console.log(res)
                    },
                    error: function(err) {
                        //console.log(err);
                    }
                });

                m3.setBadgeNumber(function(num) {
                    m3.ajax({
                        customCatchError: true,
                        m3CatchError: false,
                        showLoading: false,
                        url: m3.curServerInfo.url + "/mobile_portal/api/pns/message/setOfflineMsgCount/" + m3.userInfo.getId() + "/" + num,
                        success: function(res) {
                            //console.log(res)
                        },
                        error: function(err) {
                            //console.log(err);
                        }
                    });
                });
            }
        }
    }

    //重新进入应用
    function onResume() {
        if (window.location.pathname.indexOf("login.html") === -1 &&
            window.location.pathname.indexOf("index.html") === -1 &&
            window.location.pathname.indexOf("server-edit.html") === -1 &&
            window.location.pathname.indexOf("server-select.html") === -1) {
            var href = location.href.slice(location.href.indexOf("layout/"));
            if (href != "layout/login.html" && href != "layout/server-edit.html" && href != "layout/index.html" && href != "layout/server-select.html") {
                var url = "/statistics/wakeUp";
                if (cmp.os.ios) {
                    m3.ajax({
                        m3CatchError: false,
                        showLoading: false,
                        url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3" + url,
                        data: JSON.stringify({
                            "client": "iphone"
                        }),
                        success: function(res) {
                            res && res.data && res.data.statisticId && cmp.storage.save("statisticId", res.data.statisticId);
                        },
                        error: function(err) {}
                    })
                }
            }
        }
    }

    m3.holdScan = function() {
        cmp.barcode.holdScan({
            success: function(result, callbackObj) { //result为扫描到的结果，callbackObj为再次回调方法，包括了sendResult(继续扫描，并显示文字)，close(关闭扫描组件)
                //console.log(result);
                var sendResultFun = callbackObj.sendResult; //组件返回开发者，需要在扫描组件上显示文字的回调方法
                var closeFun = callbackObj.close; //组件返回开发者，需要关闭扫描组件的回调方法
                var obj = "";
                try {
                    obj = JSON.parse(result.text);
                } catch (err) {

                }

                if (!obj) {
                    //不支持扫描此格式的二维码
                    sendResultFun.call(this, m3.i18n[cmp.language].notSupport_QR_CODE);
                } else if (obj.name) {
                    if (obj.officePhone || (obj.phone && obj.phone != "******") || obj.email) {
                        closeFun.call(this, "");
                        cmp.tel.syncToLocal({
                            success: function(res) {
                                //console.log(res);
                            },
                            error: function(err) {
                                //console.log(err);
                            },
                            name: obj.name,
                            mobilePhone: obj.phone != "******" ? obj.phone : "",
                            officePhone: obj.officePhone,
                            email: obj.email,
                            imageData: ""
                        });
                    } else { //没有任何联系信息，不保存到本地通讯录
                        sendResultFun.call(this, m3.i18n[cmp.language].notSyncToLocal);
                    }
                } else if (obj.content && obj.codeType) {
                    if (obj.codeType == "form") {
                        var content = JSON.parse(obj.content.replace("/1.0/", ""));
                        if (content && content.formType == 1) {

                            var url = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/barcode/decodeUrl?option.n_a_s=1";
                            m3.ajax({
                                url: url,
                                type: "post",
                                data: cmp.toJSON({ "codeStr": result.text }),
                                success: function(msg) {
                                    if (!msg.error_msg) {
                                        var hrefUrl = window.location.href.split("/");
                                        var returnUrl;
                                        if (hrefUrl[length - 1] == "message.html") {
                                            returnUrl = m3.href.map.message_index;
                                        } else {
                                            returnUrl = m3.href.map.todo_index;
                                        }
                                        closeFun.call(this, "");
                                        m3.penetrated({
                                            appId: "1",
                                            type: "barCode",
                                            returnUrl: returnUrl,
                                            sendParms: msg.barcodeOptions,
                                            returnParms: null,
                                            openNewPage: 1
                                        });
                                    } else {
                                        sendResultFun.call(this, msg.error_msg);
                                    }
                                },
                                error: function(msg) {
                                    sendResultFun.call(this, msg.message);
                                }
                            });
                        } else {
                            //暂不支持查看该类型表单
                            sendResultFun.call(this, m3.i18n[cmp.language].notSupport_process_free);
                        }
                    }
                } else {
                    //不支持扫描此格式的二维码
                    sendResultFun.call(this, m3.i18n[cmp.language].notSupport_QR_CODE);
                }
            },
            error: function(error, callbackObj) {
                //console.log(error);
                var closeFun = callbackObj.close;
                closeFun.call(this, "");
            }
        });
    }

    //我的模块人员头像
    m3.personnelHead = function(imgUrl, nameString, nameSelector, form, id) {
        var img = $(".person_head img");
        img.attr("src", imgUrl);
        m3.showPic(img);
        if (form == "person" || form == "company") { //我的模块首页\个人信息页\企业页
            $(".blur_bg").css({
                "background-image": "url('" + imgUrl + "')",
                "background-repeat": "no-repeat",
                "background-position": "center"
            });
        }
    };


    //姓名显示规则
    function checkName(nameString, nameSelector) {
        var regChinese = /^[\u4e00-\u9fa5]+$/g;
        var regEnglish = /^[A-Za-z]+$/g;
        var name = "";
        if (regChinese.test(nameString)) { //纯中文，取后两个字
            name = nameString.slice(nameString.length - 2, nameString.length);
        } else if (regEnglish.test(nameString)) { //纯英文，取前两个字
            name = nameString.slice(0, 2);
        } else { //取后两个字
            name = nameString.slice(nameString.length - 2, nameString.length);
        }
        $(nameSelector).html(name).removeClass("display_none");
    }

    //没有上传头像时，头像为纯色块，10种色值中随机取一个
    function setRandomColor() {
        var randomColor = "";
        var colors = [
            "#E95A4C",
            "#4098E6",
            "#A47566",
            "#777777",
            "#F3A64C",
            "#8A8A8A",
            "#F7B55E",
            "#F2725E",
            "#568AAD",
            "#4DA9EB"
        ];
        var index = Math.floor(Math.random() * 10);
        return randomColor = colors[index];
    }

    m3.matchURL = function(address, port) {
        var result = true;
        if (!address.match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/)) {
            if (!address.match(/^(\w+\.){2,3}[a-zA-Z]+$/i)) {
                cmp.notification.toast(m3.i18n[cmp.language].checkSeverTip1, "center");
                result = false;
            }
        }

        if (!port.match(/[0-9]*/)) {
            //不是url
            cmp.notification.toast(m3.i18n[cmp.language].checkSeverTip2, "center");
            result = false;
        }

        return result;
    }

    m3.getTimeZoneId = function() {
        //获取客户端时区
        var d = new Date();
        var timezoneOffset = 0 - d.getTimezoneOffset();
        var gmtHours = (timezoneOffset / 60).toString();
        //8  -8:30  8:45
        var gmtHoursArr = gmtHours.split(".");
        var h = gmtHoursArr[0];
        if (h >= 0) {
            h = "+" + h;
        }
        var m = "00";
        if (gmtHoursArr.length > 1) {
            m = Number("0." + gmtHoursArr[1]) * 60;
        }
        return "GMT" + h + ":" + m;
    };

    /**
     * 设置待办,消息红点
     * @return {[type]} [description]
     */
    m3.getUnreadCount = function hasPend(barType) {
        m3.ajax({
            type: "GET",
            url: cmp.seeyonbasepath + "/rest/m3/common/hasPendingAndMessage",
            m3CatchError: false,
            success: function(ret) {
                if (!cmp.storage.get("isFirstLogin", true)) {
                    cmp.storage.save("isFirstLogin", "true", true)
                    cmp.tabBar.setBadge({ "appID": "55", "show": ret.data.message ? true : false });
                    cmp.tabBar.setBadge({ "appID": "58", "show": ret.data.pending ? true : false });
                } else {
                    if (barType == "message") {
                        cmp.tabBar.setBadge({ "appID": "55", "show": ret.data.message ? true : false });
                    } else {
                        cmp.tabBar.setBadge({ "appID": "58", "show": ret.data.pending ? true : false });
                    }
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    }

}));

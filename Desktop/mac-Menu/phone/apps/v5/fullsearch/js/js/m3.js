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
    var m3i18n;
    var strategies = {
        isNonEmpty: function(value, errorMsg) {
            if (!value) {
                return errorMsg;
            }
        },
        isServerIp: function(address, errorMsg) {
            if (!address.match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/) &&
                !address.match(/^(\w+\.){2,3}[a-zA-Z]+$/i)) {
                return errorMsg;
            }
        },
        isPort: function(port, errorMsg) {
            if (!port.match(/[0-9]*/)) {
                return errorMsg;
            }
        },
        isNonEmptyServer: function(value, errorMsg) {
            if (!value) {
                cmp.notification.alert(errorMsg, function(res) {
                    m3.state.go(m3.href.map.login_serverSet, "", m3.href.animated.none, false);
                }, "", "<span>" + m3i18n[cmp.language].iKnow + "</span>"); //"我知道了"
            }
        },
        isSame: function(values, errorMsg) {
            if (values[0] != values[1]) {
                return errorMsg;
            }
        },
        isNotSame: function(values, errorMsg) {
            if (values[0] == values[1]) {
                return errorMsg;
            }
        },
        isPwdMatch: function(value, errorMsg) {
            if (!/^[\x21-\x7e]{6,50}$/.test(value)) {
                return errorMsg;
            };
        },
        isStrong: function(value, strongType, errorMsg) {
            var tes = {
                "default": /^[\x21-\x7e]{6,50}$/,
                "week": /^([a-zA-Z]){6,50}$|^(\d){6,50}$|^((?=[\x21-\x7e]+)[^A-Za-z0-9]){6,50}$|^(?!\2+$)(?!\1+$)[\2\1]{6,7}$|^(?!\3+$)(?!\1+$)[\3\1]{6,7}$|^(?!\3+$)(?!\2+$)[\2\3]{6,7}$|^(?=.*\3)(?=.*\1)(?=.*\2)[a-zA-Z\x21-\x7e\d]{6,7}$/,
                "strong": /^(?=.*((?=[\x21-\x7e]+)[^A-Za-z0-9]))(?=.*[a-zA-Z])(?=.*[0-9])[^\u4e00-\u9fa5]{8,13}$/,
                "strongest": /^(?=.*((?=[\x21-\x7e]+)[^A-Za-z0-9]))(?=.*[a-zA-Z])(?=.*[0-9])[^\u4e00-\u9fa5]{14,50}$/,
                "middle1": /^(?!\d+$)(?![a-zA-Z]+$)[\dA-Za-z]{8,50}$/,
                "middle2": /^(?!((?=[\x21-\x7e]+)[^A-Za-z0-9])+$)(?![a-zA-Z]+$)[^\u4e00-\u9fa5\d]{8,50}$/,
                "middle3": /^(?!((?=[\x21-\x7e]+)[^A-Za-z0-9])+$)(?!\d+$)[^\u4e00-\u9fa5a-zA-Z]{8,50}$/
            };

            //如果strongType不为-1,则匹配传入的类型,如果strongType为-1,返回匹配到的类型
            if (strongType != -1) {
                return tes[strongType].test(value) ? "" : errorMsg;
            } else {
                for (pro in tes) {
                    if (pro != "default" && tes[pro].test(value)) {
                        return pro;
                    }
                }
            }
        }
    };





    var m3 = {};

    window.m3 = m3;

    var modulePrefix = {
        todo: "http://todo.m3.cmp/v1.0.0/layout/", //待办
        message: "http://message.m3.cmp/v1.0.0/layout", //消息
        apps: "http://application.m3.cmp/v1.0.0/layout", //应用
        search: "http://search.m3.cmp/v1.0.0/layout", //找人
        login: "http://login.m3.cmp/v1.0.0/layout", //登录
        my: "http://my.m3.cmp/v1.0.0/layout" //我的
    };
    m3.i18nRoute = {
        todo: "http://todo.m3.cmp/v1.0.0/i18n/", //待办
        message: "http://message.m3.cmp/v1.0.0/i18n/", //消息
        apps: "http://application.m3.cmp/v1.0.0/i18n/", //应用
        search: "http://search.m3.cmp/v1.0.0/i18n/", //找人
        login: "http://login.m3.cmp/v1.0.0/i18n/", //登录
        my: "http://my.m3.cmp/v1.0.0/i18n/" //我的
    };
    m3.href = {
        map: {
            //服务器设置
            login_serverSet: modulePrefix.login + "/server-edit.html",
            //服务器新增
            login_serverAdd: modulePrefix.login + "/server-add.html",
            //服务器选择
            login_serverSelect: modulePrefix.login + "/server-select.html",
            //登录
            login_index: modulePrefix.login + "/login.html",
            //引导页
            index: modulePrefix.login + "/index.html",
            //待办
            todo_index: modulePrefix.todo + "/todo-list.html",
            //待办搜索
            todo_search: modulePrefix.todo + "/todo-search.html",
            //全局搜索点击查看全部
            todo_search_all:modulePrefix.todo + "/todo-search-all.html",
            //全文检索
            all_search:modulePrefix.todo + "/all-search.html",
            //全文检索查看更多
            all_search_seemore:modulePrefix.todo + "/all-search-seemore.html",
            //消息一级页面
            message_index: modulePrefix.message + "/message.html",
            //消息详情页
            message_detail: modulePrefix.message + "/message-detail.html",
            //通讯录
            contact:modulePrefix.search+"/contact.html",
            //找人
            search_person: modulePrefix.search + "/organization.html",
            //找人下级部门
            search_nextDept: modulePrefix.search + "/organization-next.html",
            
            //更改单位
            search_company: modulePrefix.search + "/change-company.html",
            //项目组
            project_team:modulePrefix.search + "/project-team.html",
            //项目组人员
            project_team_members:modulePrefix.search + "/project-team-members.html",
            //我的群聊
            group_chat:modulePrefix.search + "/group-chat.html",
            //常用联系人
            frequent_contacts:modulePrefix.search + "frequent-contacts.html",
            //应用
            app_index: modulePrefix.apps + "/application.html",
            //应用中心
            app_center: modulePrefix.apps + "/application-center.html",
            //消息推送
            my_messagePropel: modulePrefix.my + "/message-propelling.html",
            //我的--关于
            my_about: modulePrefix.my + "/my-about.html",
            //意见反馈
            my_feedback: modulePrefix.my + "/my-about-suggestion.html",
            //账号与安全
            my_account: modulePrefix.my + "/my-account.html",
            //修改密码
            my_accountPassword: modulePrefix.my + "/my-account-pwd.html",
            //声音锁
            my_accountVoice: modulePrefix.my + "/my-account-voice.html",
            //我的企业
            my_company: modulePrefix.my + "/my-company.html",
            //桌面一键应用--标准功能
            my_deskStandard: modulePrefix.my + "/my-desktop-standard.html",
            //我的--首页
            my_index: modulePrefix.my + "/my-index.html",
            //个人信息
            my_personInfo: modulePrefix.my + "/my-person.html",
            //二维码
            my_personDecoder: modulePrefix.my + "/my-person-2dcode.html",
            //我的--设置
            my_set: modulePrefix.my + "/my-setting.html",
            //桌面一键应用
            my_setApply: modulePrefix.my + "/my-setting-apply.html",
            //新消息通知
            my_newMessageNotice: modulePrefix.my + "/new-message-notice.html",
            //语音小致
            my_xiaoZhi: modulePrefix.my + "/my-vocie-xiaoZhi.html",
            //账号在线管理
            my_onlineManage: modulePrefix.my + "/online-manage.html",
            //同步
            my_syncManage: modulePrefix.my + "/my-synchronization.html"
        },
        animated: {
            left: {
                animated: true,
                direction: "left" //动画切换方向left：从右到左；
            },
            right: {
                animated: true,
                direction: "right" //right：从左到右
            },
            none: {
                animated: false,
                direction: ""
            }
        }
    };
    m3.state = {};
    m3.state = {
        /**
         *
         * @param url          跳转地址
         * @param params       跳转参数,没有默认传""
         * @param animate      跳转动画 m3.route.animated: left,right,none
         * openPage   是否新开webView
         */
        go: function(url, params, animate,openPage) {
            if (typeof url == 'function') {
                url();
                return;
            }
            if (Object.prototype.toString.call(url) !== "[object String]")
                return;
            (params == "" || params == undefined) ? params = null: params;
            
            //openNewPage 全局变量,供cmp使用,是否新开webView
            //if(cmp.os.ios){
                openNewPage = openPage?1:0;
            //}
            
            cmp.href.next(url, params, animate);
        }
    };
    m3.Validator = function() {
        this.cache = [];
    }

    m3.Validator.prototype.add = function(value, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function(rule) {
                var strategyAry = rule.strategy.split(":");
                var errorMsg = rule.errorMsg;
                //缓存验证策略
                self.cache.push(function() {
                    var strategy = strategyAry.shift();
                    strategyAry.unshift(value);
                    strategyAry.push(errorMsg);
                    return strategies[strategy].apply(this, strategyAry);
                });
            })(rule)
        }
    };

    m3.Validator.prototype.start = function() {
        for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            var errorMsg = validatorFunc(); //执行缓存策略中的方法
            if (errorMsg) {
                return errorMsg;
            }
        }
    }

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
            cmp.notification.toast(m3i18n[cmp.language].backCue, 'bottom', 1000);
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
        setDeviceState: function(DeviceState) {
            var user = m3.userInfo.getCurrentMember();
            user.deviceState = DeviceState;
            m3.userInfo.setCurrentMember(user);
        },
        setVoice: function(status, pwd) {
            var user = m3.userInfo.getCurrentMember();
            user.voiceStatus = status;
            user.voicePwd = pwd;
            m3.userInfo.setCurrentMember(user);
        },
        setIndexPage: function(indexPage) {
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
        setUserConfig: function(hasAddressBook, hasIndexPlugin, warkMarkConfig, todoConfig, messageClassification) {
            var user = m3.userInfo.getCurrentMember();
            user.hasAddressBook = hasAddressBook;
            user.hasIndexPlugin = hasIndexPlugin;
            user.messageClassification = messageClassification;
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

            if (todoConfig) {
                user.hasDoneList = todoConfig.hasDoneList;
                user.hasPendingList = todoConfig.hasPendingList;
                user.hasSentList = todoConfig.hasSentList;
                user.hasWaitSendList = todoConfig.hasWaitSendList;
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
            return m3i18n[cmp.language].yesterday + ' ' + hm;
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
                    callback && callback("false");
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
            case "integration_remote_url":
                entry = app.entry;
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
                        m3i18n[cmp.language].noParam,
                        function(index) {
                            //console.log(index);
                        },
                        "", [m3i18n[cmp.language].iKnow]
                    );
                    return;
                }

                break;
            case "default":
            case "integration_local_h5":
                break;
            default:
        }

        var map = {
            "appId": app.appId,
            "bundle_identifier": app.bundleIdentifier || "",
            "bundle_name": app.bundleName || "",
            "team": app.domain || "",
            "version": app.version || "",
            "appType": app.appType || "",
            "downloadUrl": app.downloadUrl || "",
            "entry": entry,
            "from": from || '',
            "parameters": app.gotoParam || "",
            success: function(res) {
                console.log(res);
            },
            error: function(res) {

                var mess = "";

                switch (res.code) {

                    case "3000":
                        mess = m3i18n[cmp.language].openAppFailTip1;
                        break;
                    case "3001":
                        mess = m3i18n[cmp.language].openAppFailTip2;
                        break;
                    case "3002":
                        mess = m3i18n[cmp.language].openAppFailTip3;
                        break;
                    default:
                        mess = m3i18n[cmp.language].openAppFailTip4;
                }

                cmp.notification.confirm(
                    mess,
                    function(index) {
                        //console.log(index);
                    },
                    "", [m3i18n[cmp.language].iKnow]
                );
            }
        }
        
        if (app.isOpenWebview === false)
            map.isOpenWebview = false;
        cmp.app.loadApp(map);
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
                ret[result[1]] = decodeURI(result[2]); //result[2];
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
                            //二维码扫描进入无流程详情
                            if (options.appId === '47' && options.isScan) {
                                m3.s3Caller(options.callFun, [options.sendParms,options.type, "", options.returnParms], "", "");
                            }else {
                                if (!options.sendParms || m3.isOwnEmpty(options.sendParms)) {
                                    // alert("穿透参数为空");
                                    console.error("穿透接口无返回参数");
                                } else {
                                    if (options.appId == "43") {
                                        m3.s3Caller("bizApi.openBizInfo", ["", options.sendParms, options.returnParms], "", "");
                                    } else {
                                        m3.s3Caller(appRes.openAppMethod, [options.type, "", options.sendParms, options.returnParms], "", "");
                                    }
                                }
                            }
                            cmp.event.trigger("closeHoldScan",document);
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

    m3.isOwnEmpty = function isOwnEmpty(obj) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                return false;
            }
        }
        return true;
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


    //退出应用
    // function onPause() {
    //     if (!m3.curServerInfo.ip) {
    //         return;
    //     }
    //     if (window.location.pathname.indexOf("login.html") === -1 &&
    //         window.location.pathname.indexOf("index.html") === -1 &&
    //         window.location.pathname.indexOf("server-edit.html") === -1 &&
    //         window.location.pathname.indexOf("server-select.html") === -1) {
    //
    //         var url = "/statistics/hide";
    //         var data = {
    //             "statisticId": (cmp.storage.get("statisticId") ? cmp.storage.get("statisticId") : "-1")
    //         };
    //
    //         if (cmp.os.ios) {
    //             m3.ajax({
    //                 customCatchError: true,
    //                 m3CatchError: false,
    //                 showLoading: false,
    //                 url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3" + url,
    //                 data: JSON.stringify(data),
    //                 success: function(res) {
    //                     //console.log(res)
    //                 },
    //                 error: function(err) {
    //                     //console.log(err);
    //                 }
    //             });
    //
    //             m3.setBadgeNumber(function(num) {
    //                 m3.ajax({
    //                     customCatchError: true,
    //                     m3CatchError: false,
    //                     showLoading: false,
    //                     url: m3.curServerInfo.url + "/mobile_portal/api/pns/message/setOfflineMsgCount/" + m3.userInfo.getId() + "/" + num,
    //                     success: function(res) {
    //                         //console.log(res)
    //                     },
    //                     error: function(err) {
    //                         //console.log(err);
    //                     }
    //                 });
    //             });
    //         }
    //     }
    // }

    //重新进入应用
    // function onResume() {
    //     if (window.location.pathname.indexOf("login.html") === -1 &&
    //         window.location.pathname.indexOf("index.html") === -1 &&
    //         window.location.pathname.indexOf("server-edit.html") === -1 &&
    //         window.location.pathname.indexOf("server-select.html") === -1) {
    //         var href = location.href.slice(location.href.indexOf("layout/"));
    //         if (href != "layout/login.html" && href != "layout/server-edit.html" && href != "layout/index.html" && href != "layout/server-select.html") {
    //             var url = "/statistics/wakeUp";
    //             if (cmp.os.ios) {
    //                 m3.ajax({
    //                     m3CatchError: false,
    //                     showLoading: false,
    //                     url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3" + url,
    //                     data: JSON.stringify({
    //                         "client": "iphone"
    //                     }),
    //                     success: function(res) {
    //                         res && res.data && res.data.statisticId && cmp.storage.save("statisticId", res.data.statisticId);
    //                     },
    //                     error: function(err) {}
    //                 })
    //             }
    //         }
    //     }
    // }

    




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
                cmp.notification.toast(m3i18n[cmp.language].checkSeverTip1, "center");
                result = false;
            }
        }

        if (!port.match(/[0-9]*/)) {
            //不是url
            cmp.notification.toast(m3i18n[cmp.language].checkSeverTip2, "center");
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


    m3.checkXiaozhiPermission = function(options) {
        cmp.speechRobot.checkPermission({
            success: function(xiaozhiRes) {
                // status:1,//已绑定
                // stutus:2,//未绑定
                if (xiaozhiRes.status == 1) {
                    options.success({ code: 200, status: xiaozhiRes.status, message: "正常" });
                } else if (xiaozhiRes.status == 2) {
                    options.success({ code: 56000, status: xiaozhiRes.status, message: "有权限,但还未绑定" });
                }
            },
            error: function(err) {
                // 57001: "NoPlugin", //没有插件
                // 57002: "NoPermission", //未授权
                // 57003: "MaxDevice", //超过最大使用人数
                // 57004: "OutTime" //服务到期
                // 56000: 有权限,未绑定
                options.error({ code: err.code, status: 0, message: err.message })
            }
        });
    };
    m3.getDefaultAppByAppId = function(appId, callback) {
        callback = callback || function() {};
        var getInfo = function(appId, data) {
            for( var i = 0;i < data.length;i++ ) {
                if (data[i].appId === appId && data[i].appType === 'default') {
                    return data[i]
                }
            }
            return {};
        }
        
        function getInfos(appId, data) {
            data = data.data;
            for (var i = 0; i < data.length;i++) {
                for (var j = 0,arr = data[i].appList;j < arr.length;j++) {
                    if (arr[j].appId === appId && arr[j].appType === 'default') {
                        return arr[j];
                    }
                }
            }
            return {};
        }
        m3Native.getAppList(function(apps) {
            apps = JSON.parse(apps);
            if (Object.prototype.toString.call(apps) === '[object Array]') {
                callback(getInfo(appId, apps));
            } else {
                callback(getInfos(appId, apps));
            }
        })
    };
    if (window.define && window.define.cmd) {
        define('m3', function(require, exports, module) {
            m3i18n = require('m3i18n');
            module.exports = window.m3 = m3;
        })
    } else {
        window.m3 = m3;
//        document.addEventListener("deviceready", function() {
//            /**
//             * 注册唤醒,进入后台事件
//             */
//            document.addEventListener("pause", onPause, false);
//            document.addEventListener("resume", onResume, false);
//        }, false);
    }
}));
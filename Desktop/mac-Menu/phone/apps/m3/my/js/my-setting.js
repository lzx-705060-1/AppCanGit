/**
 * description: 我的模块——设置
 * author: hbh
 * createDate: 2017-01-07
 */
;(function() {
    var m3, m3Ajax, m3Db, m3i18n, nativeApi,
        //来电显示权限状态
        state;
    define(function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        require('commons');
        m3Ajax = require('ajax');
        m3Db = require('sqliteDB');
        m3i18n = require('m3i18n');
        nativeApi = require('native');
        require('zepto');
        initPage();
    });
    //页面跳转参数
    var parent = "",
        navData;

    //入口函数
    function initPage() {
        cmp.ready(function() {
            parent = cmp.href.getParam();
            
            // initAccountState();
            // cmp.webViewListener.addEvent("mysetting_didAppear",function(e){
            //     initAccountState();
            // });
            document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear",function () {
                initAccountState();
            });
             //iOS的didAppear触发与安卓不一致，Android每次页面切换回触发，iOS仅仅一级页面切换触发
             if ( cmp.os.ios ) {
                 document.addEventListener("resume",function(){
                    initAccountState();
                 },false);
             }
            
            initStyle();
            initEvent();
            initData();
        });
    }
    //样式初始化
    function initStyle() {

        //如果设备为iphone，则‘消息推送平台选择’item不显示
        // if (cmp.os.ios) {
        // $("#msgPro").remove();
        // }
        // if(parent && parent.listShow){
        //     $("#call-item").removeClass('display_none');
        //     if(parent.listOpen){
        //         $('#call-btn').addClass('cmp-active');
        //     }
        // }
        var user = m3.userInfo.getCurrentMember();
        //显示应用分类 开关状态：true(开启);false(关闭)
        var app = m3.userInfo.getCurrentMember().showAppCategory;
        if (app == "true") {
            $("#showAppCategory").addClass("cmp-active")
        } else {
            $("#showAppCategory").removeClass("cmp-active")
        }
        var headerDom = document.querySelector('header.cmp-flex-header');
        $(".shadow")[0].style.height = (CMPFULLSREENHEIGHT - headerDom.offsetHeight - $(".cmp-bar-tab").height()) + "px";
        if(user.accShortName)$('.SwitcherText').text(user.accShortName);

    }

    function initData() {

        

        //获取用户来电列表显示状态
        // nativeApi.getCallerAuthorShow(function(res){
        //     if(res.state == 1 ){
        //         $("#call-item").removeClass('display_none');
        //         //获取用户来电按钮开关显示状态
        //         nativeApi.getCallerAuthor(function(data) {
        //             //状态开启
        //             if (data.state) $('#call-btn').addClass('cmp-active');
        //             state = data.state;
        //         }, function(e) {
        //             cmp.notification.toast('获取来电显示状态失败', "center");
        //         });
        //     }
        // },function(error){ 
        //     cmp.notification.alert("获取来电列表显示状态失败","center");
        // });
        
        nativeApi.getNavBarInfo(function(data) {
            data = JSON.parse(data);
            data = data.sort(function(a, b) {
                return a.sortNum - b.sortNum
            });
            navData = data;
            $('.cmp-bar-tab').html(showIndexPage(data));
            //获取当前用户设置的页签
            nativeApi.getIndexPage(function(curIndex) {
                curData = JSON.parse(curIndex);
                initIndexPage(data, curData);
            //异常处理 appKey匹配不到的时候会自动匹配message，appKey可以随便写一个
            }, function() {
                initIndexPage(data, {appKey: 'default'});
            });
        });
        // //检查小智权限
        // m3.checkXiaozhiPermission({
        //     success: function() {
        //         $("#xiaoZhi").removeClass("display_none");//显示小致
        //     },
        //     error: function(err) {
        //         if (err.code != 57001) { //没有插件(停用)
        //             $("#xiaoZhi").addClass("display_none");
        //         }
        //         if (err.code != 57007) { //隐藏小致
        //             $("#xiaoZhi").addClass("display_none");
        //         }
        //     }
        // });
        
    };

    function initAccountState(){
        //检查是否配置了关联账号，没有配置则不显示切换企业入口
        nativeApi.getAssociateAccountState(function(res){
            if(res.state == 0){
                $(".Switcher-content").addClass('display_none');
            }else{
                $(".Switcher-content").removeClass('display_none');
                var user = m3.userInfo.getCurrentMember();
                if(user.accShortName)$('.SwitcherText').text(user.accShortName);
            }
        },function(res){
            $(".Switcher-content").addClass('display_none');
            console.log("获取关联账号状态失败:"+res)
        });
    }
    
    function initIndexPage(data, curIndex) {
        var navBarNameOrId = curIndex.appKey,
            activeNavId,
            activeIndex = 0,
            url,
            name,
            activeUrl;
        for (var i = 0;i < data.length;i++) {
            console.log(navBarNameOrId)
            if (navBarNameOrId === data[i].appKey) {
                activeNavId = data[i].appKey;
                activeIndex = i;
                break;
            }
        }
        //如果遍历后没有找到，则是显示第一个为激活页签
        if (!activeNavId) {
            for (var i = 0;i < data.length;i++) {
                if ('55' === data[i].appId) {
                    activeNavId = data[i].appKey;
                    activeIndex = i;
                    m3.userInfo.setIndexPage(activeNavId);
                    nativeApi.setIndexPage(activeNavId);
                    break;
                }
            }
        }
            
        if (cmp.language === 'zh-CN') {
            name = data[activeIndex].chTitle;
        } else {
            name = data[activeIndex].enTitle;
        }
        url = m3.curServerInfo.url + '/mobile_portal' + data[activeIndex].selectedImage;
        $('#' + activeNavId).addClass('icon-active').find('.nav-icon').css('backgroundImage','url(' + url + ')');
        $('.index_name').text(name);
    }
    
    function showIndexPage(data) {
        console.log(data);
        var str = '',
            url,
            name;
        for (var i = 0;i < data.length;i++) {
            //中文
            if (cmp.language === 'zh-CN') {
                name = data[i].chTitle;
            } else {
                name = data[i].enTitle;
            }
            //图片地址
            url = m3.curServerInfo.url + '/mobile_portal' + data[i].normalImage;
            str +=  '<a id="' + data[i].appKey + '" data-appid="' + data[i].appId + '" class="cmp-tab-item" data-index="' + i + '">\
                        <span class="nav-icon" style="background-image:url(' + url + ');"></span>\
                        <p class="cmp-tab-label">' + name + '</p>\
                    </a>';
        }
        return str
    }
    
    

    //事件初始化
    function initEvent() {
        
        $('.cmp-bar-tab').on('tap', 'a', function() {
            var obj = $('.icon-active'),
                index = parseInt(obj.attr('data-index')),
                curId = $(this).attr('id'),
                normalUrl = m3.curServerInfo.url + '/mobile_portal' + navData[index].normalImage;
            obj.find('.nav-icon').css('backgroundImage','url(' + normalUrl + ')');
            m3.userInfo.setIndexPage(curId);
            nativeApi.setIndexPage(curId);
            obj.removeClass('icon-active');
            $(this).addClass('icon-active');
            initIndexPage(navData, {
                appKey: curId
            });
            $(".shadow").trigger('tap');
        });
        
        $(".shadow").off().on("tap", function() {
            $('.cmp-bar-tab').removeClass('fade-down').addClass('fade-up');
            setTimeout(function() {
                $(".indexPage").addClass("display_none");
                $('.cmp-bar-tab').removeClass('fade-up');
            }, 400);
        });
        
        //首页设置
        $("#indexSet").on("tap", function() {
            $(".indexPage").removeClass("display_none");
            $('.cmp-bar-tab').addClass('fade-down');
        });

        //显示应用分类
        $("#showAppCategory").on("touchend", function() {
            var app = true;

            if ($(this).hasClass("cmp-active")) {
                app = "true";
            } else {
                app = "false";
            }
            cmp.webViewListener.fire({ type: "com.seeyon.m3.message.refresh", data: [1] });
            m3.userInfo.setShowCategory(app);
        });
        
        //来电显示
        $('#call-btn').on('touchend', function(e) {
            state = $(this).hasClass('cmp-active');
            nativeApi.setCallerAuthor(state,function(res) {
                  if (state) {
                      $('#call-btn').addClass('cmp-active').find('.cmp-switch-handle').css('-webkit-transform','translate3d(21px, 0px,0)');
                  } else {
                      $('#call-btn').removeClass('cmp-active').find('.cmp-switch-handle').css('-webkit-transform','translate3d(0, 0,0)');
                  }
                },function(e) {
                    state = !state;
                    if (state) {
                        $('#call-btn').addClass('cmp-active').find('.cmp-switch-handle').css('-webkit-transform','translate3d(21px, 0px,0)');
                    } else {
                        $('#call-btn').removeClass('cmp-active').find('.cmp-switch-handle').css('-webkit-transform','translate3d(0, 0,0)');
                    }
                }
            );
        });

        //清除缓存
        $("#clear").on("tap", function() {
            var self = this;
            clearCache();
        });

        //退出登录
        $(".exit").on("tap", function() {
            cmp.notification.alertView({
                title: m3i18n[cmp.language].confirm,
                message: m3i18n[cmp.language].exit,
                buttonTitles: [m3i18n[cmp.language].cancel, m3i18n[cmp.language].ok],
                success: function(index) {
                    //点击取消按钮
                    if (index == 0) {
                        // callback.closeFunc();
                    }
                    //点击确定按钮
                    else if (index == 1) {
                        // callback.closeFunc();
                        setTimeout(function() {
                            logout();
                        }, 300);
                    }
                },
                error: function() {

                }
            });
        });

        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });

        //页面跳转
        pageJump();

        //左上角返回按钮
        backBtn();
    }
    //退出轮训
    var logout = function() {
        var userInfo = m3.userInfo.getCurrentMember();
        var statisticId = cmp.storage.get("statisticId") ? cmp.storage.get("statisticId"):"";
        m3Ajax({
            url: m3.curServerInfo.url + "/mobile_portal/api/verification/logout",
            m3CatchError: false,
            data: JSON.stringify({
                "statisticId": statisticId,
                "userId": userInfo.id
            }),
            showLoading: false,
            success: function(msg) {},
            error: function(err) {}
        });

        //防止退出请求没发送出去就关闭页面
        setTimeout(function() {
            cmp.requestTimer.invalidate({
                "url": ""
            });
            cmp.storage.deleteAll(true);
            cmp.chat.logoutChat({});
            cmp.setCookie({});
            cmp.app.setApplicationIconBadgeNumber({
                badgeNumber: 0
            });

            m3.userInfo.setLoginStatus("false");
            cmp.storage.deleteAll(true);
            //清除应用显示模式
            cmp.storage.delete('isShowList');
            m3.userInfo.setPwd("");
            //原生跳转到login.html
            cmp.server.clearLoginResult({});
        }, 500);
    };


    //清除缓存
    function clearCache() {
        //缓存数据
        var cacheCount = "";
        cmp.notification.alertView({
            title: m3i18n[cmp.language].confirm,
            message: m3i18n[cmp.language].clearCache,
            buttonTitles: [m3i18n[cmp.language].cancel, m3i18n[cmp.language].ok],
            success: function(index) {
                //点击取消按钮
                if (index == 0) {
                    //do something
                }
                //点击确定按钮
                else if (index == 1) {
                    //读取缓存文件大小
                    cmp.app.getCacheLength({
                        success: function(res) {
                            cacheCount = res;
                            // 清除缓存
                            cmp.app.clearCache({
                                success: function() {
                                    cmp.notification.toast(m3i18n[cmp.language].clearCacheSuccess + cacheCount, "center");
                                },
                                error: function() {

                                }
                            })
                        },
                        error: function(err) {

                        }
                    });

                }
            },
            error: function() {

            }
        });
    }

    //点击item，页面跳转
    function pageJump() {
        //进入桌面一键应用
        $("#desktop").on("tap", function() {
            m3.state.go(m3.href.map.my_setApply, parent, m3.href.animated.left);
        });

        //进入账号与安全
        $("#account").on("tap", function() {
            m3.state.go(m3.href.map.my_account, parent, m3.href.animated.left, true);
        });

        //进入小致设置
        $("#xiaoZhi").on("tap", function() {
            m3.state.go(m3.href.map.my_xiaoZhi, parent, m3.href.animated.left, true);
        });

        //进入关于
        $("#about").on("tap", function() {
            m3.state.go(m3.href.map.my_about, parent, m3.href.animated.left, true);
        });


        //进入新消息通知
        $("#newMsg").on("tap", function() {
            m3.state.go(m3.href.map.my_newMessageNotice, parent, m3.href.animated.left, true);
        });
        //进入同步
        $("#sync").on("tap", function() {
            m3.state.go(m3.href.map.my_syncManage, parent, m3.href.animated.left, false);
        });
        //进入消息推送
        $("#msgPro").on("tap", function() {
            m3.state.go(m3.href.map.my_messagePropel, parent, m3.href.animated.left, false);
        });
        //进入切换企业
        $("#Switcher").on("tap", function() {
            nativeApi.openAssociateAccountSwitcher(function(res){
                console.log(res)
            },
            function(res){
                console.log(res)
            });
        });
    }

    //左上角返回按钮
    function backBtn() {
        $("#backBtn").on("tap", function() {
            cmp.href.back();
        });
    }
})();
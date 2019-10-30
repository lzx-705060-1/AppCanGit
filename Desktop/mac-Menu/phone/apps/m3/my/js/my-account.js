/**
 * description: 我的模块——账号与安全
 * author: lizheng
 * createDate: 2017-07-25
 */
;(function() {
    var m3, m3Ajax, m3Db, m3i18n, nativeSdk;
    define(function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        m3Ajax = require('ajax');
        m3Db = require('sqliteDB');
        m3i18n = require('m3i18n');
        nativeSdk = require('native');
        require('zepto');
        initPage();
    });
    
    var user = {};
    var status = "";
    //入口函数
    function initPage() {
        cmp.ready(function() {
            //人员全部信息
            user = m3.userInfo.getCurrentMember();

            initStyle();
            initEvent();
        });
    }

    //样式初始化
    function initStyle() {
        nativeSdk.gestureState(function( ret ) {
            console.log(ret);
            //开启
            if ( ret == 1 ) {
                $(".cmp-switch").addClass("cmp-active");
                $(".cmp-switch-handle").css("transform", "translate(21px, 0px)");
                status = true; 
            //关闭
            } else {
                $(".cmp-switch").removeClass("cmp-active");
                $(".cmp-switch-handle").css("transform", "translate(0px, 0px)");
                status = false;
            }
        }, function() {
            console.log('获取手势状态接口异常');
            //异常是默认关闭
            $(".cmp-switch").removeClass("cmp-active");
            $(".cmp-switch-handle").css("transform", "translate(0px, 0px)");
            status = false;
        });
    }

    //事件初始化
    function initEvent() {
        var pwd = "";
        cmp.backbutton();
        cmp.backbutton.push(function() {
            cmp.href.back(webviewFiremySetting());
        });


        //点击手势密码滑块
        $(".cover_switch").on("click", function() {
            cmp.backbutton.push(setGesture);
            setGesture();
        });

        //进入账号在线管理
        $(".onlineManager").on("tap", function() {
            m3.state.go(m3.href.map.my_onlineManage, "", m3.href.animated.left, false);
        });

        //进入修改密码
        $("#revisePwd").on("tap", function(event) {
            m3.state.go(m3.href.map.my_accountPassword, "", m3.href.animated.left, true);
        });

        //进入关联帐号
        var timer,clickMark = true;
        var accountNumber = document.querySelector('.accountNumber');
        cmp.event.click(accountNumber,function(){
            if(clickMark){
                clearTimeout(timer);
                clickMark = false;
                timer = setTimeout(function(){
                    clickMark = true;
                },700);
                nativeSdk.openAssociateAccountList(function(res){
                    console.log(res)
                },
                function(res){
                    console.log(res)
                });
            }
        });
        //左上角返回按钮
        $("#backBtn").on("tap", function() {
            webviewFiremySetting();
            cmp.href.back();
        });
    }

    function webviewFiremySetting(){
        nativeSdk.notifyWebviewListener('mysetting_didAppear', 'true');
    }
    //手势密码开启或关闭
    function setGesture() {
        cmp.backbutton.pop();
        cmp.notification.prompt(m3i18n[cmp.language].inputPwd, function(index, val, callbackObj) {
            if (!index) {
                if(callbackObj)callbackObj.success();
                return false;
            }
            nativeSdk.checkPSW($("input").val(), function(res) {
                if (res == '0') {
                    callbackObj.error(m3i18n[cmp.language].pwdError);
                    return false;
                }
                callbackObj.success();
                checkPwd();
            })
        }, [m3i18n[cmp.language].cancel, m3i18n[cmp.language].ok], m3i18n[cmp.language].pwd, "", 2, true, 0);
    }

    //开启或关闭手势密码，验证密码
    function checkPwd(callbackObj) {
        if (status) { //关闭手势密码
            status = false;
            $(".cmp-switch").removeClass("cmp-active");
            $(".cmp-switch-handle").css("transform", "translate(0px, 0px)");
            nativeSdk.resetGestureState(function() {
                $('header').removeAttr('style');
            }, function() {
                $('header').removeAttr('style');
            });
        } else { //开启手势密码
            //设置手势密码
            nativeSdk.setGestureState(user.name, function(res) {
                $('header').removeAttr('style');
                status = true;
                $(".cmp-switch").addClass("cmp-active");
                $(".cmp-switch-handle").css("transform", "translate(21px, 0px)");
            }, function(e) {
                if (e.code == 25001) {
                    status = false;
                } else {
                    $('header').removeAttr('style');
                }
            });
            // nativeSdk.setGestureState({
            //     userName: user.name,
            //     showLeftArrow: true, //返回按钮
            //     autoHide: true, //自动关闭
            //     skip: function() {
            //         status = false;
            //     },
            //     success: function(res) {
            //         $('header').removeAttr('style');
            //         status = true;
            //         $(".cmp-switch").addClass("cmp-active");
            //         $(".cmp-switch-handle").css("transform", "translate(21px, 0px)");
            //     },
            //     error: function() {
            //         $('header').removeAttr('style');
            //     }
            // });
        }
    }
})();
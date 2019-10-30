/**
 * description: 我的模块——修改密码
 * author: lizheng
 * createDate: 2017-07-25
 */
;(function() {
    var m3, m3Ajax, m3i18n, nativeSdk;
    define(function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        m3Ajax = require('ajax');
        nativeSdk = require('native');
        m3i18n = require('m3i18n');
        require('zepto');
        initPage();
    });
    
    var level = 1,//新密码强弱等级
        pwdSameAble = false; //是否允许与旧密码相同

    //入口函数
    function initPage() {
        cmp.ready(function() {
            initStyle();
            initEvent();
            initData();
        });
    }

    //样式初始化
    function initStyle() {
        //placeholder国际化
        //旧密码
        document.querySelector("#oldPwd").setAttribute('placeholder', cmp.i18n("my.m3.h5.isoldPassword"));
        //新密码
        document.querySelector("#newPwd").setAttribute('placeholder', cmp.i18n("my.m3.h5.isNewPassword"));
        //再次输入
        document.querySelector("#newPwd2").setAttribute('placeholder', cmp.i18n("my.m3.h5.pwdAgain"));
        //防止输入框获取焦点后header被顶上去
        cmp.HeaderFixed(document.getElementsByTagName("header")[0], document.getElementsByTagName("input"));
        checkHasEffectInput();
    }

    //事件初始化
    function initEvent() {
        //显示新密码强弱程度
        $("#newPwd").on("input", event_MatchPwdStrong);
        $(".cmp-table-view-cell input").on('input blur focus', checkHasEffectInput);
        //点击确定操作
        $(".sure").on("tap", event_RevisePwd);

        //左上角返回按钮
        $("#backBtn").on("tap", function() {
            cmp.href.back();
        });
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });
    }
    // 获取输入框是否都输入了内容
    function checkHasEffectInput() {
        var status = 1;
        var actFn = ['add', 'remove'];
        $(".cmp-table-view-cell input").each(function (i) {
            if (!Boolean(this.value)) {
                status = 0;
            }
        });
        if (status) {
           status = document.querySelector('#newPwd').value == document.querySelector('#newPwd2').value ? 1 : 0;
        }
        $('.sure')[actFn[status]+'Class']('disable');
    }
    //获取允许修改密码的强弱等级和是否允许与旧密码相同
    function initData() {
        // cmp.dialog.loading(true);
        m3Ajax({
            url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/individual/pwdmodify/config",
            type: 'get',
            success: function(msg) {
                // cmp.dialog.loading(false);
                level = parseInt(msg.data.requirePwdStrength);
                pwdSameAble = msg.data.pwdmodify_same_enable == "enable";
            },
            error: function(msg) {
                cmp.dialog.loading(false);
            }
        });
    }

    function event_MatchPwdStrong() {
        var nowpassword = $("#newPwd").val();
        var type = validataPwdInput() || "";
        if (type == "week") {
            $("#newPwd").attr('data-lev','1');
            $("#week").addClass("week");
            $("#middle").removeClass("middle");
            $("#strong").removeClass("strong");
            $("#strongest").removeClass("strongest");
        } else if (type.indexOf("middle") != -1) {
            $("#newPwd").attr('data-lev','2');
            $("#middle").addClass("middle");
            $("#week").addClass("week");
            $("#strong").removeClass("strong");
            $("#strongest").removeClass("strongest");
        } else if (type == "strong") {
            $("#newPwd").attr('data-lev','3');
            $("#strong").addClass("strong");
            $("#week").addClass("week");
            $("#middle").addClass("middle");
            $("#strongest").removeClass("strongest");
        } else if (type == "strongest") {
            $("#newPwd").attr('data-lev','4');
            $("#strongest").addClass("strongest");
            $("#week").addClass("week");
            $("#middle").addClass("middle");
            $("#strong").addClass("strong");
        }

        if (this.value == "") {
            $("#week").removeClass("week");
        }
    }

    function event_RevisePwd() {
        if ($(this).hasClass('disable')) {
           return
        }
        var strongCate, errorMsg;
        strongCate = [
            { type: "week", errorMsg: m3i18n[cmp.language].revisePwdTip1 },
            { type: "week", errorMsg: m3i18n[cmp.language].revisePwdTip1 },
            { type: "strong", errorMsg: m3i18n[cmp.language].revisePwdTip2 },
            { type: "strongest", errorMsg: m3i18n[cmp.language].revisePwdTip3 }
        ];
        var curLev = parseInt($("#newPwd").attr('data-lev'));
        errorMsg = validataPwd();
        if (level > curLev) {
            errorMsg = strongCate[level - 1].errorMsg;
        }
        if (errorMsg) {
            cmp.notification.toast(errorMsg, "center");
            return false;
        }
        var strArr = [$("#oldPwd").val(), $("#newPwd").val(), $("#newPwd2").val()];
        //加密
        nativeSdk.encrypt(strArr, function(res) {
            console.log(res);
            changeServerPwd({
                individualName: m3.userInfo.getCurrentMember().loginName,
                formerpassword: res[0],
                nowpassword: res[1],
                validatepass: res[2]
            })
        });
    }

    //验证输入的新密码处于哪一个等级
    function validataPwdInput(strongType, errMsg) {
        var validator = new m3.Validator();
        
        validator.add($("#newPwd").val(), [{
            strategy: 'isStrong:-1',
            errorMsg: ""
        }]);

        var errorMsg = validator.start();
        return errorMsg;
    }

    //验证提交的密码
    function validataPwd(strongType, errMsg) {
        var validator = new m3.Validator();

        validator.add($('#oldPwd')[0].value, [{
            strategy: 'isNonEmpty',//不能为空
            errorMsg: m3i18n[cmp.language].checkPwdTip1
        }]);

        validator.add($('#newPwd')[0].value, [{
            strategy: 'isNonEmpty',//不能为空
            errorMsg: m3i18n[cmp.language].checkPwdTip2
        }, {
            strategy: 'isPwdMatch',//默认密码规则
            errorMsg: m3i18n[cmp.language].checkPwdTip4
        }]);

        validator.add([$('#newPwd')[0].value, $('#newPwd2')[0].value], [{
            strategy: 'isSame',//是否一样
            errorMsg: m3i18n[cmp.language].checkPwdTip3
        }]);

        validator.add($('#newPwd2')[0].value, [{
            strategy: 'isNonEmpty',//不能为空
            errorMsg: m3i18n[cmp.language].checkPwdTip1
        }]);

        !pwdSameAble && validator.add([$('#oldPwd')[0].value, $('#newPwd')[0].value], [{
            strategy: 'isNotSame',//不能相等
            errorMsg: m3i18n[cmp.language].checkPwdTip5
        }]);

        var errorMsg = validator.start();
        return errorMsg;
    }

    function changeServerPwd(changePwd) {
        cmp.dialog.loading(true);
        m3Ajax({
            url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/individual/modifypwd",
            data: JSON.stringify(changePwd),
            success: function(msg) {
                cmp.dialog.loading(false);
                cmp.notification.toast(m3i18n[cmp.language].revisePwdSuccess, "center");
                setTimeout(function() {
                    cmp.href.back();
                }, 1500);
            },
            error: function(err) {
                cmp.dialog.loading(false);
                cmp.notification.toast(err.message, "center");
            }
        });
    }
})();
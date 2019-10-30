/**
 * description: 我的模块——企业二维码
 * author: Ms
 * createDate: 2017-09-27
 */
;(function() {
    var m3,m3Ajax,userdata,m3i18n,getParam,alertBtns,timerClick = true;
    define(function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        m3Ajax = require('ajax');
        m3i18n = require('m3i18n');
        initPage();
    });
    // 初始化
    function initPage() {
        cmp.ready(function() { 
            userdata = m3.userInfo.getCurrentMember();
            console.log(cmp.href.getParam())
            getParam = cmp.href.getParam();
            alertBtns = [cmp.i18n("cmp.notification.ok")];
            initStyle();
            // sendEmail();
            initEvent();
        });
    } 

    function initStyle(){
        $('#codeValue').attr("placeholder",fI18nData["my.m3.h5.VerificationCode"]);
        $('#headerTitle').text(getParam.title);
        $('#emailValue').text(getParam.value);
        timer();
    }

    //发送邮箱
   function sendEmail(callback){
       cmp.dialog.loading(true);
        var url = m3.curServerInfo.url +'/mobile_portal/seeyon/rest/password/bind/send';
        m3Ajax({
            url:url,
            type:"GET",
            success:function(res){
                cmp.dialog.loading(false);
                if(res.code == "0"){ //邮箱校验成功并已发送邮箱
                    cmp.notification.alert("邮箱校验成功并已发送邮箱",null,null,alertBtns,true);
                    callback && callback();
                }else{
                    cmp.notification.alert(res.message,null,null,alertBtns,true);
                }
            },
            error:function(){

            }
        });
   }


    //事件初始化
    function initEvent() {
         
        //点击绑定按钮
        $('#binding').on("tap",function(){
            var value = $('#codeValue').val();
            if(!value)return;
            var url = m3.curServerInfo.url +'/mobile_portal/seeyon/rest/password/bind/'+value+'';
            m3Ajax({
                url:url,
                type:"GET",
                success:function(res){
                    if(res.code == "0"){ //绑定成功
                        cmp.notification.alert("绑定成功",null,null,alertBtns,true);
                        setTimeout(function(){
                            cmp.webViewListener.fire({
                                type:"myperson_email_bind",  //此参数必须和webview1注册的事件名相同
                                data:"true", //webview2传给webview1的参数
                                success:function(res){
                                    console.log(res);
                                    cmp.href.back();
                                },
                                error:function(res){
                                    console.log(res);
                                }
                            });
                        },1600);
                    }else{
                        cmp.notification.alert(res.message,null,null,alertBtns,true);
                    }
                },
                error:function(){
    
                }
            });
        });
        //重新获取验证码按钮
        var clickMark = true;
        $('#codeTime').on("tap",function(){
            if(clickMark){
                clickMark = false;
                setTimeout(function(){
                    clickMark = true;
                },1000);
                if(timerClick){
                    sendEmail(function(){
                        timer();
                    });
                }
            }
        });


        $('#inputDom').on('focus',function(){
            $('#clearInput').removeClass('cmp-hidden');
        },false);
        $('#clearInput').on('tap',function(){
            $('#inputDom').val("");
            $('#clearInput').addClass('cmp-hidden');
        })
        //左上角返回按钮
        backBtn();
    }
    
    //60秒计时器
    function timer(){
        var time = 60;
        var timers = setInterval(function(){
            time --;
            $("#codeTime").text(time +"s");
            $("#codeTime").removeClass('reset');
            timerClick = false;
            if(time < 1){
                timerClick = true;
                $("#codeTime").text("重新获取");
                $("#codeTime").addClass('reset');
                clearInterval(timers);
            }
        },1000);
    }

    //左上角返回按钮
    function backBtn() {
       document.addEventListener("backbutton",function(){
            cmp.href.back();
       },false);
       $("#backBtn").on("tap", function() {
        cmp.href.back();
        //    cmp.href.close();
       });
    }
})();

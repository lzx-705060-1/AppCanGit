/**
 * description: 我的模块——企业二维码
 * author: Ms
 * createDate: 2017-09-27
 */
;(function() {
    var m3,m3Ajax,userdata,m3i18n;
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

            initEvent();
        });
    }
    //事件初始化
    function initEvent() {
        // cmp.backbutton();
        // cmp.backbutton.push(m3.exitApp);
        makeQrCode();
        //左上角返回按钮
        backBtn();
    }
    
    //制作二维码
    function makeQrCode(){ 
        var personInf = {
            "host":m3.curServerInfo.model +'://'+ m3.curServerInfo.ip,
            "port":m3.curServerInfo.port
            // "note":userdata.accName
        };
        cmp.barcode.makeBarScan({
            data:JSON.stringify(personInf),
            success:function(data){ 
                var img =document.querySelector('.codeImg');
                img.setAttribute("src","data:image/jpeg;base64," + data.image);
                eventTouch(data.image);
            },
            error:function(){
                //网络异常提示
                cmp.notification.toastExtend(m3i18n[cmp.language].networkAbnormal, "bottom", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
            }
       });
    }
    function eventTouch(url){
        var codeImg = document.querySelector('.codeImg');
        cmp.event.touchHold(codeImg,function(e){
            e.stopPropagation();
            var items = [{
                    key:"1",
                    name:"<span style='color: red;'>"+m3i18n[cmp.language].save+"</span>",
                    name2:m3i18n[cmp.language].save
                }];
            cmp.dialog.actionSheet(items, m3i18n[cmp.language].cancel, function (item) {
                if (cmp.system.filePermission) {
                    cmp.att.saveBase64({
                        base64: url,
                        filename: "M3服务器地址" + new Date().getTime() + ".png",
                        type: "png",
                        success: function(result) {
                            //保存成功提示语
                            cmp.notification.toastExtend(m3i18n[cmp.language].saveCodeSuccess, "bottom", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
                        },
                        error: function(error) {
                            //保存失败提示语
                            cmp.notification.toastExtend(m3i18n[cmp.language].saveCodeFail, "bottom", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
                        }
                    })
                } else {
                    cmp.notification.toastExtend(m3i18n[cmp.language].saveCodeBywx, "center", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
                }
            });
        });
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

/**
 * description: 我的模块——二维码
 * author: hbh
 * createDate: 2017-01-10
 */
(function() {
    var m3, m3i18n;
    //人员全部信息
    var data = "";
    var memberData = "";
    var personInf = {};

    //入口函数
    function initPage() {
        cmp.ready(function() {
            data = m3.userInfo.getCurrentMember();
            memberData = cmp.href.getParam();
            initStyle();
            initEvent();
        });
    }

    //样式初始化
    function initStyle() {
        //姓名，超过10位...显示（头像下方显示的人员姓名）
        $(".name").html(data.name.length > 15 ? (data.name.slice(0, 15) + "...") : data.name);

    }

    //事件初始化
    function initEvent() {
        if (memberData) {
            //头像样式
            var headeLogo = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/orgMember/avatar/" + memberData.id + '?maxWidth=100';
            $(".person_head").css({
                "background-image": "url('" + headeLogo + "')",
                "background-size": "cover",
                "background-position": "center center"
            });
            //姓名
            $(".name").html(memberData.name&&memberData.name.length > 15 ? (memberData.name.slice(0, 15) + "...") : memberData.name);
            //制作二维码
            personInf = {
                "name": memberData.name,
                "department": memberData.departmentName || "",
                "job": memberData.levelName || "",
                "phone": memberData.tel || "",
                "email": memberData.email || "",
                "officePhone": memberData.officeNumber || ""
            };
        } else {
            //头像样式
            var personnelHead = m3.userInfo.getCurrentMember().iconUrl+'?t='+ new Date().getTime();
            $(".person_head").css({
                "background-image": "url('" + personnelHead + "')",
                "background-size": "cover",
                "background-position": "center center"
            });
            //姓名
            $(".name").html(data.name&&data.name.length > 15 ? (data.name.slice(0, 15) + "...") : data.name);
            //制作二维码
            personInf = {
                "name": data.name,
                "department": data.departmentName,
                "job": data.levelName,
                "phone": data.tel,
                "email": data.email,
                "officePhone": data.officeNumber
            };
        }

        //制作二维码
        if (cmp.barcode) {
            barcodeCallback()
        } else if(!document.querySelector('#js-barcode')){
            cmp.asyncLoad.js([
                {url: 'http://cmp/v1.0.0/js/cmp-barcode.js', id: 'js-barcode'}
            ], barcodeCallback);
        }
         function barcodeCallback () {
             cmp.barcode.makeBarScan({
                 data: JSON.stringify(personInf),
                 success: function(res) {
                     var img = $("#codeImg");
                     img.attr("src", "data:image/jpeg;base64," + res.image);
                     //长按二维码保存图片
                     cmp.event.touchHold(document.getElementById("codeImg"), function(e) {
                         e.stopPropagation();
                         //提示框
                         cmp.notification.confirm(m3i18n[cmp.language].saveCodeTip, function(index) {
                             if (index == 0) { //点击了取消

                             } else if (index == 1) { //点击了确定
                                 if (cmp.system.filePermission) {
                                     if (cmp.att) {
                                         attCallback()
                                     } else if (!document.querySelector('#js-att')) {
                                         cmp.asyncLoad.js([
                                             {url: 'http://cmp/v1.0.0/js/cmp-att.js', id: 'js-att'}
                                         ], attCallback);
                                     }
                                     function attCallback(){
                                         cmp.att.saveBase64({
                                             base64: res.image,
                                             filename: "M3二维码名片" + new Date().getTime() + ".png",
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
                                     }

                                 } else {
                                     cmp.notification.toastExtend(m3i18n[cmp.language].saveCodeBywx, "center", 1000, { bg: "rgba(0, 0, 0, 0.7)", color: "#fff" });
                                 }
                             }
                         }, "", [m3i18n[cmp.language].cancel, m3i18n[cmp.language].ok]);
                     }, false);
                 }
             });
         }


        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            cmp.href.back();
        });

        //左上角返回按钮
        backBtn();
    }

    //左上角返回按钮
    function backBtn() {
        $("#backBtn").on("tap", function() {
            cmp.href.back();
        });
    }
    define(function(require, exports, module){
        require('zepto');
        m3 = require('m3');
        m3i18n = require('m3i18n');
        // m3DB = require('sqliteDB');
        initPage();
    });
})();

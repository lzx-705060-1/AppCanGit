/**
 * @description 我的模块——我的企业
 * @author Clyne
 * @createDate 2017-07-25
 */
;(function() {
    var m3, m3Ajax, m3i18n,m3Cache;
    define(function(require, exports, module){
        m3 = require('m3');
        require('commons');
        m3Ajax = require('ajax');
        m3i18n = require('m3i18n');
        m3Cache = require('nativeCache');
        initPage();
    });
    
    //人员全部信息
    var data = "";

    //入口函数
    function initPage() {
        cmp.ready(function() {
            //左上角返回按钮
            backBtn();
            data = m3.userInfo.getCurrentMember();
            initStyle();
            initEvent();
        });
    }

    //样式初始化
    function initStyle() {

        var url= m3.curServerInfo.url + '/mobile_portal/seeyon/rest/m3/invoice/list';
        m3Ajax({
            url:url,
            type:"GET",
            success:function(res){
                if(res.code == "200"){
                    var len = res.data.length;
                    if(len > 0){
                        $('.invoiceNum').text(len);
                    };
                    m3Cache.setCache("my_company_invoice_data",res.data,function(res){
                            
                    },function(){

                    });
                    
                }
            },
            error:function(){

            }
        });

        //企业信息
        companyInfo();

    }

    //事件初始化
    function initEvent() {
        //公司logo
        // companyLogo();
        
        //安卓自带返回键
        document.addEventListener("backbutton", function() {
            $('#backBtn').trigger('tap');
            // cmp.href.back();
        });
        //点击服务器二维码
        $("#serverQrcode").on("tap",function(){
            m3.state.go(myUrl+'/layout/my-qrcode.html?cmp_orientation=auto', '', m3.href.animated.left, true);
            // cmp.href.next(myUrl+'/layout/my-qrcode.html');
        });
        //点击发票抬头
        $('#invoicetil').on("tap",function(){
            m3.state.go(m3.href.map.my_company_invoice, null, m3.href.animated.left, true);
        });

    }

    //公司logo
    // function companyLogo() {
    //     var logoUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/contacts/account/" + data.accountId;
    //     m3Ajax({
    //         type: "GET",
    //         url: logoUrl,
    //         success: function(msg) {
    //             if (msg.code == "200") {
    //                 var url = m3.curServerInfo.url + '/mobile_portal' + msg.data.iconUrl;
    //                 if (url.indexOf('fileUpload') != -1) { //后台配置了logo
    //                     url =  m3.curServerInfo.url + '/mobile_portal' + msg.data.iconUrl + "&showType=small";
    //                 }
    //                 // m3.personnelHead(url, "", "", "company");
    //                 $('#logo').removeAttr('style').attr('src', url).css({
    //                     "width": "auto",
    //                     "height": "100%"
    //                 });
    //             }
    //         },
    //         error: function(msg) {
    //             if (msg.code == -110) {
    //                 cmp.dialog.loading({
    //                     status: "nonetwork",
    //                     callback: function() {
    //                         window.location.reload();
    //                     }
    //                 });
    //             } else if (msg.code !== 401 && msg.code !== 1001 && msg.code !== 1002 && msg.code !== 1003 && msg.code !== 1004) {
    //                 cmp.dialog.loading({
    //                     status: "systembusy",
    //                     text: "<span style='color:#999;font-size: 14px;margin-top: 18px;'>" + m3i18n[cmp.language].systemBusy + "</span>",
    //                     callback: function() {
    //                         window.location.reload();
    //                     }
    //                 });
    //             }
    //             $("header.cmp-bar.cmp-bar-nav").css("background-color", "#fff");
    //         }
    //     });
    // }

    //企业信息
    function companyInfo() {
        //企业名称
        // data.accName.length > 15 ? (data.accName.slice(0, 14) + "...") : data.accName
        $("#name").text(data.accName);
        //简称
        $("#shortName").text(data.accShortName);
        //编码
        $("#code").text(data.code);
    }

    //左上角返回按钮
    function backBtn() {
        $("#backBtn").on("tap", function() {
            cmp.href.back();
        });
    }
})();

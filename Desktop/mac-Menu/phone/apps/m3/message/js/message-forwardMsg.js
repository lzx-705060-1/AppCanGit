(function(){
    var m3Error,m3i18n,m3Ajax;
    define(function(require, exports, module) {
        //加载模块
        require('m3');
        require('http://cmp/v/js/cmp-asyncLoad.js');
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        initPage();
    });
    function initPage(){
        cmp.ready(function(){
            cmp.backbutton();
            cmp.backbutton.push(cmp.href.back);

            cmp.dialog.loading();
            var penetratedParams = getPenetratedParams();
            var appId = penetratedParams.appId;
            if(penetratedParams.hasOwnProperty("thirdpartyMessageId")){//第三方消息
                var thirdpartyMessageId = penetratedParams.thirdpartyMessageId;
                m3Ajax({
                    url:cmp.seeyonbasepath + "/rest/cip/thirdpartyMessage/through/" + appId + "/" + thirdpartyMessageId,
                    type:"GET",
                    success:function(msg){
                        console.log(msg);
                        cmp.dialog.loading(false);
                        if (msg.code == 200) {
                            var appParams = msg.data;
                            if(!appParams){
                                cmp.notification.alert("第三方详情穿透参数为空，导致不能穿透",function(){
                                    cmp.href.back();
                                },null,cmp.i18n("confirm"));
                                createABackBtnOnError();
                                return;
                            }
                            m3.loadApp({
                                "appId": appId,
                                "bundle_identifier": appParams.bundle_identifier,
                                "bundle_name": appParams.bundle_name,
                                "team": appParams.team,
                                "version": appParams.version,
                                "appType": appParams.appType,
                                "downloadUrl": appParams.downloadUrl,
                                "entry": appParams.entry,
                                "parameters": "",
                                "isOpenWebview":false,
                                "callback":function(error){
                                    if(error){
                                        createABackBtnOnError();
                                        cmp.href.back();
                                    }else {
                                        cmp.href.next = cmp.href.go;//重置next为go
                                        cmp.storage.save("penetratedAppSuccess","true",true);
                                    }
                                }
                            }, "message");
                        }
                    },
                    error: function(msg) {
                        cmp.dialog.loading(false);
                        if (msg.code == -110) {
                            cmp.dialog.loading({
                                status: "nonetwork",
                                callback: function() {
                                    window.location.reload();
                                }
                            });
                        }
                    }
                })
            }else {//标准应用的消息穿透
                m3.penetrated({
                    appId: appId,
                    type: "message",
                    returnUrl: m3.href.map.message_detail,
                    sendParms: penetratedParams,
                    returnParms: null,
                    openNewPage: 0,
                    callback:function(error){
                        if(error){
                            cmp.notification.alert("无法打开应用,请管理员检查对应应用包配置", function(){
                                cmp.href.back();
                            }, "失败", ["确定"]);
                            createABackBtnOnError();
                        }else {
                            cmp.href.next = cmp.href.goParams;//重置next为goParams-----只传参不入栈
                        }
                    }
                })
            }
        });
    }
    //解析url地址上的参数
    function getPenetratedParams(){
        debugger;
        var penetratedParams = {};
        var urlParams = window.location.search;
        urlParams = decodeURI(urlParams);
        var paramsRegex = /gotoParams=\{"[^\}].*?"\}/;
        var paramsArr = urlParams.match(paramsRegex),
            paramsStr,params;
        if(paramsArr && paramsArr.length){
            paramsStr = paramsArr[0];
            params = paramsStr.replace("gotoParams=","");
            params = params.replace(/\\/g,"");
            try {
                params = JSON.parse(params);
                penetratedParams = cmp.extend(penetratedParams,params);
            }catch (e){
                cmp.notification.alert("解析穿透参数错误，错误原因：" + e.message);
            }
            urlParams = urlParams.replace(paramsStr,"");//把params那坨替换掉
            urlParams = urlParams.replace(/\?/g,"");//把剩下的?和&去掉
            if(urlParams.indexOf("&") != -1){
                urlParams = urlParams.split("&");
                for(var i = 0;i<urlParams.length;i++){
                    var oneParamStr = urlParams[i];
                    if(oneParamStr){
                        var oneParam = {};
                        oneParam[oneParamStr.substring(0,oneParamStr.indexOf("="))] = oneParamStr.substring(oneParamStr.indexOf("=") + 1);
                        penetratedParams = cmp.extend(penetratedParams,oneParam);
                    }
                }
            }else {
                var oneParam = {};
                oneParam[urlParams.substring(0,urlParams.indexOf("="))] = urlParams.substring(urlParams.indexOf("=") + 1);
                penetratedParams = cmp.extend(penetratedParams,oneParam);
            }
        }
        return penetratedParams;
    }
    function createABackBtnOnError(){
        var backBtn = document.getElementById("backBtn");
        if(!backBtn){
            var backHeader =
                '<header id="page_header" class="cmp-bar cmp-bar-nav head-style" style="height: 64px;">'+
                '   <a id="backBtn" href="javascript:void(0)" class="cmp-pull-left left-btn">'+
                '       <span class="see-icon-v5-common-arrow-back"></span>返回'+
                '    </a>'+
                '</header>';
            cmp.append(document.body,backHeader);
            backBtn = document.getElementById("backBtn");
            backBtn.addEventListener("tap",function(){
                cmp.href.back();
            })
        }

    }
})();





(function() {
    var m3, m3Ajax, m3i18n,nativeApi;
    define('m3OfflineMsg', function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        m3Ajax = require('ajax');
        m3i18n = require('m3i18n');
        nativeApi = require("native");
        require('commons');
        init();
    });
    seajs.use('m3OfflineMsg', function() {});

    function init() {
        cmp.ready(function() {

            $("#return").on("tap", function returnParent() {
                cmp.href.close();
            });

            cmp.push.getRemoteNotification({
                success: function(parms) {
                    if (!parms) {
                        alert("cmp.push.getRemoteNotification返回的数据为空");
                        cmp.href.close();
                        return;
                    }

                    // alert("收到离线消息啦~~! \n应用Id: " + parms.appId + "\n消息Id: " + parms.messageId + "\n是否只读(none为可读): " + parms.readOnly);
                    if (parms.appId == "61") {
                        var options = {
                            appId: "61",
                            type: "message",
                            sendParms: { type: "balabla" },
                            returnUrl: "",
                            returnParms: "",
                            openNewPage: 2,
                            callback:function(result){
                                if(result && result.hasOwnProperty("error")){
                                    cmp.notification.confirm(m3i18n[cmp.language].openMsgError, function(index) {
                                        cmp.href.close();
                                    }, ' ', [m3i18n[cmp.language].confirm]);
                                }
                            }
                        }
                        m3.penetrated(options);
                    } else {
                        handleRemoteNotification(parms);
                    }
                },
                error: function(e) {
                    console.log(e);
                    cmp.href.close();
                }
            });

            var handleRemoteNotification = function(parms) {
                var appId = parms.appId;
                var messageId = parms.messageId;
                var readonly = parms.readOnly;
                var url = m3.curServerInfo.url + "/mobile_portal/api/message/penetrateUrl/" + appId + "/" + messageId;
                
                m3Ajax({
                    type: "get",
                    url: url,
                    success: function(msg) {
                        if (msg.code === 200) {
                            //A人员打开了B人员的推送消息
                            if (!msg.data || msg.data.params == null || msg.data.params == 'null' ) {
                                cmp.href.close();
                            }
                            // 屏蔽督办
                            if (msg.data.params.linkType === 'message.link.col.supervise') {
                                cmp.notification.confirm(m3i18n[cmp.language].notSupport, function(index) {
                                    cmp.href.close();
                                }, ' ', [m3i18n[cmp.language].confirm]);
                                return;
                            }
                            if (readonly === "readonly" || !msg.data || !msg.data.params || msg.data.params.length <= 0) {
                                // alert("如果参数为空,或者只读不能打开详情!" + "\n只读: " + readonly + "\n参数: " + JSON.stringify(msg.data.params));
                                cmp.href.close();
                            } else {
                                //第三方
                                if (msg.data.params.appType) {
                                    msg.data.params.appId = msg.data.appId;
                                    var appId = msg.data.appId;
                                    var type = msg.data.params.appType;
                                    if(type){
                                        if(type == "integration_remote_url" || type == "integration_native"){
                                            cmp.dialog.loading();
                                            var thirdpartyMessageId = msg.data.params.thirdpartyMessageId;
                                            var url =cmp.seeyonbasepath + "/rest/cip/thirdpartyMessage/through/" + appId + "/" + thirdpartyMessageId;
                                            m3Ajax({
                                                type:"GET",
                                                url:url,
                                                success:function(res){
                                                    console.log(res);
                                                    cmp.dialog.loading(false);
                                                    if (res.code == 200) {
                                                        var appParams = res.data;
                                                        if(!appParams){
                                                            cmp.notification.alert("第三方详情穿透参数为空，导致不能穿透",function(){
                                                                cmp.href.back();
                                                            },null,cmp.i18n("confirm"));
                                                            createABackBtnOnError();
                                                            return;
                                                        }
                                                        
                                                        // alert(JSON.stringify(appParams));
                                                        m3.loadApp({
                                                            "appId": msg.data.params.appId,
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
                                                        if(type == "integration_native"){
                                                            cmp.href.closePage();
                                                        }
                                                    }
                                                },
                                                error:function(res){
                                                    alert(JSON.stringify(res));
                                                }
                                            });
                                        }else{  //H5应用
                                            msg.data.params.appId = msg.data.appId;
                                            m3.loadApp(msg.data.params, 'message'); 
                                        }
                                    }else{
                                        cmp.notification.confirm(m3i18n[cmp.language].notSupport, function(index) {
                                            cmp.href.close();
                                        }, ' ', [m3i18n[cmp.language].confirm]); 
                                    }
                                    return;
                                }
                                //非第三方
                                var options = {
                                    appId: msg.data.appId,
                                    type: "message",
                                    sendParms: msg.data.params,
                                    returnUrl: "",
                                    returnParms: {
                                        category: appId
                                    },
                                    openNewPage: 2
                                }
                                cmp.href.next = cmp.href.goParams;
                                m3.penetrated(options);
                            }
                        } else {
                            // alert("哦吼~接口报错了:" + JSON.stringify(msg));
                            cmp.href.close();
                        }
                    },
                    error: function(err) {
                        // alert("哦吼~接口报错了:" + err.message);
                        cmp.href.close();
                    }
                });
            };
        });
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

})()
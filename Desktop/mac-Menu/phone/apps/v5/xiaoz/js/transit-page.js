//现在查看以录详情页面之中转页面
(function(){
    var debugModule = !cmp.platform.CMPShell;
    var m3;
    define(function(require, exports, module) {
        m3 = require('m3');
        initPage(debugModule);
    });
    
    function initPage(debugModule){
        cmp.ready(function(){
            cmp.backbutton();
            cmp.backbutton.push(cmp.href.back);
            cmp.storage.delete("CMPFULLSREENHEIGHT",true);
            if(debugModule){
                debugArrangeData(6);
            }else {
                cmp.speechRobot.getSpeechInput({
                    error:function(e){
                        cmp.notification.alert("获取语音输入内容失败",function(){
                            cmp.href.back();
                        })
                    },
                    success:function(params){
                        if(isOpenApp(params)){
                            var appId = params.appId+"";
                            if("62" == appId){//通讯录权限单独判断
                                m3Native.getConfigInfo(function(result) {
                                    result = JSON.parse(result);
                                    if(result.hasAddressBook){
                                        cmp.href.go(m3.href.map.address_index+"&fromApp=xiaozhiSpeechInput")
                                    }else {
                                        tipsNoAppPermission();
                                    }
                                });
                                return;
                            }
                            m3.getDefaultAppByAppId(appId,function(res) {
                                if(!cmp.isEmptyObject(res)){
                                    goAppByAppId(appId);
                                }else {
                                    tipsNoAppPermission();
                                }
                            });
                            
                        }else {
                            params = analysisParams(params);
                            var appId = params.appId;
                            m3.penetrated({
                                appId: appId,
                                type: "message",
                                returnUrl: m3.href.map.message_detail,
                                sendParms: params.sendParms,
                                returnParms: null,
                                openNewPage: 0,
                                callback:function(error){
                                    if(error){
                                        cmp.notification.alert("无法打开应用,请管理员检查对应应用包配置", function(){
                                            cmp.href.back();
                                        }, "失败", ["确定"]);
                                    }else {
                                        cmp.href.next = cmp.href.goParams;//重置next为goParams-----只传参不入栈
                                    }
                                }
                            })
                        }

                    }

                })
            }

        });
    }
    //是否只是打开应用，根据传的参数来决定，只传appId则说明是打开应用，传了其他参数则说明是穿透动作
    function isOpenApp(params){
        return Object.keys(params).length <=1;
    }
    //这块数据分析，以后全部是调应用组的API，需要他们自己匹配，此时客开暂时这样=========================start
    function analysisParams(params){
        var result = {};
        if(cmp.isObject(params)){
            result = assembleParams(params);
        }
        return result;
    }
    function assembleParams(params){
        var appId = params.appId;
        var result = {
            "sendParms":{
                id:params.id,
                linkType:"message.link.cal.view"
            },
            "appId":appId+""
        };
        return result;
    }
    function goAppByAppId(appId){
        cmp.app.getAppEntryUrl({
            appId:appId,
            success:function(res){
                var entryUrl = res.url;
                cmp.href.go(entryUrl);
            }
        })
    }
    function tipsNoAppPermission(){
        cmp.notification.alert("暂无打开此应用权限",function(){
            cmp.href.back();
        },"提示","确定",true);
    }

    //debug模式
    function debugArrangeData(appId){
        var m3 = {};
        window.m3 = m3;
        cmp.asyncLoad.js([xiazPath + "/js/lib/m3-extend.js",xiazPath +"/js/lib/m3Map.js"],function(){
            //日程穿透假数据
            var appInfo = m3.appMap["app_"+appId];
            if(appId == 11){
                appInfo.sendParms = {
                    id:"9107566639724512808",
                    linkType:"message.link.cal.view"
                };

            }else if(appId == 30){
                appInfo.sendParms = {
                    id:"5404793429843118444",
                    linkType:"message.link.cal.view"
                };
            }else if(appId == 6){
                appInfo.sendParms = {
                    id:"6486354757697423199",
                    linkType:"message.link.cal.view"
                };
            }
            appInfo.type = "message";
            m3.penetratedByUrl(appInfo);

        });
    }

    //这块数据分析，以后全部是调应用组的API，需要他们自己匹配，此时客开暂时这样=========================end
})();


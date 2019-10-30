//现在查看以录详情页面之中转页面
(function(){
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        require('m3');
        m3Error = require('error');
        initPage();
    });
    function initPage(){
        cmp.ready(function(){
            cmp.backbutton();
            cmp.backbutton.push(cmp.href.back);
            cmp.speechRobot.getSpeechInput({
                error:function(e){
                    cmp.notification.alert("获取语音输入内容失败",function(){
                        cmp.href.back();
                    })
                },
                success:function(params){
                    //测试回填表单假数据
                    // params ={"extData":{"templateId":"-2455920380647423187",
                    //     "formmain":"formmain_0018",
                    //     "appId":"1"},
                    //     "sendParms":[
                    //     {"name":"field0004","display":"标题","value":"小致录入的标题内容222222"},
                    //     {"name":"field0007","display":"开始时间","value":"2018-08-07 11:00:00"},
                    //     {"name":"field0008","display":"结束时间","value":"2018-08-09 11:00:00"},
                    //     {"name":"field0009","display":"事件内容","value":"事件内容输入22222222222222"},
                    //     {"name":"field0005","display":"预约对象","value":"-6834322893591330345,-375322957224327502"}
                    // ]
                    // };



                    params = analysisParams(params);
                    var appId = params.appId;
                    m3.penetrated({
                        appId: appId,
                        type: "xiaozhiSpeechInput",
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

            })
        });
    }
    //这块数据分析，以后全部是调应用组的API，需要他们自己匹配，此时客开暂时这样=========================start
    function analysisParams(params){
        var result = {};
        if(cmp.isObject(params)){
            if(params.hasOwnProperty("extData") && params.hasOwnProperty("sendParms")){
                var extData = params["extData"],sendParams = params["sendParms"];
                result = assembleParams(extData,sendParams);
            }else{
                result = params;
            }
        }
        return result;
    }
    function assembleParams(extData,sendParams){
        var result = {},formatData = {},initFormData = {},data = {},master={},appId = extData.appId;
        switch (appId+""){
            case "1":
                var templateId = extData.templateId,formmainName = extData.formmain;
                for(var i = 0;i<sendParams.length;i++){
                    var oneParams = sendParams[i];
                    var name = oneParams.name,value = oneParams.value;
                    value = transValueOrgDataFormat(value);
                    master[name] = {
                        "auth": "edit",
                        "extMap": {},
                        "fieldName": name,
                        "ownerTableName": formmainName,
                        "through": false,
                        "value": value["value"],
                        "display":value["display"]
                    }
                }
                data["master"] = master;
                initFormData["data"] = data;
                formatData["initFormData"] = cmp.toJSON(initFormData);
                formatData["openFrom"] = "newCollaboration";
                formatData["templateId"] = templateId;
                break;
            case "11":
                formatData = sendParams;
                break;
        }
        result = {"sendParms":formatData,"appId":appId};
        return result;
    }
    function transValueOrgDataFormat(value){
        var result = {};
        try {
            var tempVal = cmp.parseJSON(value);
            if(cmp.isArray(tempVal)){
                var tempIdArr = [],tempDisplayArr = [];
                for(var i = 0;i<tempVal.length;i++){
                    var item = tempVal[i];
                    tempIdArr.push(item.id);
                    tempDisplayArr.push(item.name);
                }
                result = {
                    "value":tempIdArr.join(","),
                    "display":tempDisplayArr.join(",")
                }
            }

        }catch (e){
            result = {
                "value":value
            }
        }
        return result;
    }
    //这块数据分析，以后全部是调应用组的API，需要他们自己匹配，此时客开暂时这样=========================end
})();


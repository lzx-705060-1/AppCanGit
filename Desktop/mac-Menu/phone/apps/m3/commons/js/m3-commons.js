;(function(){
    document.addEventListener('CMPScanEvent', function(e) {
        var type = e.data.type;
        if (type === 'close') {
            cmp.barcode.holdScan.closeScan();
        } else if (type === 'alert'){
            cmp.barcode.holdScan.notify(e.data.msg || '');
        }
    })
    var m3,m3Ajax,m3i18n;
    var m3Commons = {
        holdScan:function(){
            cmp.barcode.holdScan({
                success: function(result, callbackObj) { //result为扫描到的结果，callbackObj为再次回调方法，包括了sendResult(继续扫描，并显示文字)，close(关闭扫描组件)
                    window.res = result;
                    // var sendResultFun = callbackObj.sendResult; //组件返回开发者，需要在扫描组件上显示文字的回调方法
                    // var closeFun = callbackObj.close; //组件返回开发者，需要关闭扫描组件的回调方法
                    var obj = "";
                    try {
                        obj = JSON.parse(result.text);
                    } catch (err) {

                    }
                    console.log(obj);
                    if (!obj) {
                        //不支持扫描此格式的二维码
                        cmp.barcode.holdScan.notify(m3i18n[cmp.language].notSupport_QR_CODE);
                        // sendResultFun.call(this, m3i18n[cmp.language].notSupport_QR_CODE);
                    } else if (obj.name) {
                        if (obj.officePhone || (obj.phone && obj.phone != "******") || obj.email) {
                            cmp.tel.syncToLocal({
                                success: function(res) {
                                    cmp.event.trigger("closeHoldScan",document);
                                },
                                error: function(err) {
                                    cmp.event.trigger("closeHoldScan",document);
                                },
                                name: obj.name,
                                mobilePhone: obj.phone && obj.phone.replace(/[^0-9]+/g, ''),
                                officePhone: obj.officePhone && obj.officePhone.replace(/[^0-9]+/g, ''),
                                email: obj.email,
                                imageData: ""
                            });
                        } else { //没有任何联系信息，不保存到本地通讯录
                            cmp.barcode.holdScan.notify(m3i18n[cmp.language].notSyncToLocal);
                            // sendResultFun.call(this, m3i18n[cmp.language].notSyncToLocal);
                        }
                    } else if (obj.content && obj.codeType) {
                        //cap4
                        if(obj.codeType=="cap4url" || obj.codeType=="cap4form" ){ 
                            m3.penetrated({
                                appId:"80",
                                type: "barCode",
                                returnUrl: '',
                                returnParms: null,
                                openNewPage: 1,
                                sendParms:obj,
                                isScan:true
                            });
                            return;
                        }
                        if (obj.codeType == "form"&& obj.content.indexOf("moduleId") != -1 ) {//满足这些条件才是表单的url类型的二维码
                            var content = JSON.parse(obj.content.replace("/1.0/", ""));
                            if (content && content.formType) {
                                var restInterface,appId;
                                switch (content.formType){
                                    case 1://有流程表单
                                        restInterface = "barcode/decodeUrl";
                                        appId = "1";
                                        break;
                                    case 2://无流程表单
                                    case 3://基础数据
                                        restInterface = "capForm/decodeUnflowURL";
                                        appId = "47";
                                        break;
                                }
                                var url = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/"+restInterface+"?option.n_a_s=1";
                                m3Ajax({
                                    url: url,
                                    type: "post",
                                    data: cmp.toJSON({ "codeStr": result.text }),
                                    success: function(msg) {
                                        var hrefUrl = window.location.href.split("/");
                                        var returnUrl;
                                        if (hrefUrl[length - 1] == "message.html") {
                                            returnUrl = m3.href.map.message_index;
                                        } else {
                                            returnUrl = m3.href.map.todo_index;
                                        }
                                        var penetratedParams = {
                                            appId:appId,
                                            type: "barCode",
                                            returnUrl: returnUrl,
                                            returnParms: null,
                                            openNewPage: 1,
                                            isScan:true
                                        };
                                        if(content.formType == 1){
                                            if (!msg.error_msg) {
                                                penetratedParams.sendParms = msg.barcodeOptions;
                                                cmp.event.trigger("closeHoldScan",document);
                                                m3.penetrated(penetratedParams);
                                            } else {
                                                cmp.barcode.holdScan.notify(msg.error_msg || '');
                                                // sendResultFun.call(this, msg.error_msg);
                                                return;
                                            }
                                        }else {
                                            var data = msg.data,callFun;
                                            if(data){
                                                var updateAuthList = data.updateAuthList;
                                                if(updateAuthList && updateAuthList.length){//有修改权限时
                                                    if(updateAuthList.length == 1){
														data.showType = "update";
														data.rightId = updateAuthList[0].rightId;
														data.openFrom="scanInput";
                                                        callFun = "cmp.openUnflowFormData";
                                                    }else if(updateAuthList.length > 1){
                                                        callFun = "cmp.selectUnflowRight";
                                                    }
                                                }else {//没有修改权限时，直接查看
												    data.openFrom="scanInput";
                                                    callFun = "cmp.openUnflowFormData";
                                                }
                                                data.needCheckRight = true;
                                                penetratedParams.callFun = callFun;
                                                penetratedParams.sendParms = data;
                                                cmp.event.trigger("closeHoldScan",document);
                                                m3.penetrated(penetratedParams);
                                            }else {//无查看权限时，进行后台返回的数据提示
                                                cmp.barcode.holdScan.notify(msg.message || '');
                                                // sendResultFun.call(this, msg.message);

                                            }
                                        }
                                    },
                                    error: function(msg) {
                                        cmp.barcode.holdScan.notify(msg.message || '');
                                        // sendResultFun.call(this, msg.message);
                                    }
                                });
                            } else {
                                //暂不支持查看该类型表单
                                cmp.barcode.holdScan.notify(m3i18n[cmp.language].notSupport_process_free);
                            }
                        }else {
                            cmp.barcode.holdScan.notify(m3i18n[cmp.language].notSupport_QR_CODE);
                            // sendResultFun.call(this, m3i18n[cmp.language].notSupport_QR_CODE);
                        }
                    } else if(obj.hasOwnProperty("openCmpDebugModule")){//扫码打开debug设置页面
                        var cmpDebugSettingPage = obj.cmpDebugSettingPage;
                        cmp.href.next(cmpDebugSettingPage,null,{openWebViewCatch:true});
                        // if(cmp.os.android){//android 可以马上关闭，ios会打包一起关闭掉，这里不调用
                            cmp.event.trigger("closeHoldScan",document);
                        // }
                    }else if(obj.type == "cmpOfficialWebsite"){  //CMP官网，进行原生页面调试入口
                        var url = obj.url;
                        cmp.href.next(url,null,{openWebViewCatch:true});
                        cmp.event.trigger("closeHoldScan",document);
                    }else {
                        //不支持扫描此格式的二维码
                        cmp.barcode.holdScan.notify(m3i18n[cmp.language].notSupport_QR_CODE);
                        // sendResultFun.call(this, m3i18n[cmp.language].notSupport_QR_CODE);
                    }
                },
                error: function(error, callbackObj) {
                    cmp.event.trigger("closeHoldScan",document);
                }
            });
        },
        /**
         * 设置待办,消息红点
         * @return {[type]} [description]
         */
        getUnreadCount:function(barType){
            m3Ajax({
                type: "GET",
                url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/common/hasPendingAndMessage",
                m3CatchError: false,
                setCache: {
                    key: 'm3-unreadNum'
                },
                success: function(ret) {
                    if (!cmp.storage.get("isFirstLogin", true)) {
                        cmp.storage.save("isFirstLogin", "true", true)
                        cmp.tabBar.setBadge({ "appID": "55", "show": ret.data.message ? true : false });
                        cmp.tabBar.setBadge({ "appID": "58", "show": ret.data.pending ? true : false });
                    } else {
                        if (barType == "message") {
//                            cmp.tabBar.setBadge({ "appID": "55", "show": ret.data.message ? true : false });
                        } else {
                            cmp.tabBar.setBadge({ "appID": "58", "show": ret.data.pending ? true : false });
                        }
                    }
                },
                error: function(e) {
                    // console.log(e);
                }
            });
        },
        //检查有无权限查看个人卡片
        checkLevelScope:function(userId, callback){
            m3Ajax({
                type: "GET",
                customCatchSuccess: true,
                m3CatchError: false,
                url: m3.curServerInfo.url + "/mobile_portal/seeyon/rest/addressbook/canShowPeopleCard/" + userId,
                success: function(res) {
                    console.log(typeof res);
                    console.log(res);
                    console.log('=====');
                    if (typeof res === "boolean") {
                        if (res) {
                            callback(true);
                        } else {
                            callback(false)
                            //cmp.notification.toast("无权限", "center");
                        }
                    } else {
                        alert("接口返回值改了通知一声啊!!!!!!");
                    }
                },
                error: function(e) {
                    callback(true);
                }
            });
        },
        //我的模块人员头像
        personnelHead:function(imgUrl, nameString, nameSelector, form, id){
            var img = $(".person_head img");
            img.attr("src", imgUrl);
            m3.showPic(img);
            if (form == "person" || form == "company") { //我的模块首页\个人信息页\企业页
                $(".blur_bg").css({
                    "background-image": "url('" + imgUrl + "')",
                    "background-repeat": "no-repeat",
                    "background-position": "center"
                });
            }
        }

    };

    define(function(require, exports, module){
        m3 = require("m3");
        m3Ajax = require('ajax');
        m3i18n = require("m3i18n");
        module.exports = m3Commons;
        m3.holdScan = m3Commons.holdScan;
        m3.getUnreadCount = m3Commons.getUnreadCount;
        m3.personnelHead = m3Commons.personnelHead;
        m3.checkLevelScope = m3Commons.checkLevelScope;
    });
})();

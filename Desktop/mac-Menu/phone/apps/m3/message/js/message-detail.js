/*
 * @Author: Mars
 * @Date:   2017-05-25 10:48:00
 * @Last Modified by:   lizhiheng
 * @Last Modified time: 2017-05-24 11:47:44
 */
var messageDetail = {};
(function() {
    var m3Error,m3i18n,m3Ajax,m3DB,canChat,nativeApi,getParam;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        require('m3');
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        nativeApi = require("native");
        initPage();
    });
    function initPage(){
        cmp.ready(function() {
            // cmp.dialog.loading(true);
            getParam = cmp.href.getParam();
            getCanChat();
            initCommon();
            initStyle();
            initEvent();
            initData();
            document.addEventListener("com.seeyon.m3.phone.webBaseVC.didAppear",function (event) {
                refreshContentScroll();
            });
            //iOS的didAppear触发与安卓不一致，Android每次页面切换回触发，iOS仅仅一级页面切换触发
            if ( cmp.os.ios ) {
                document.addEventListener("resume",function(){
                    refreshContentScroll();
                },false);
            }
            cmp.event.orientationChange(function(res){
                refreshContentScroll();
            });
            
        });
    }

    function refreshContentScroll(){
        var headerH = document.querySelector('header.cmp-flex-header').offsetHeight;
        var footerH = document.querySelector('footer.cmp-bar-footer').offsetHeight;
        var contentH = window.innerHeight - headerH - footerH;
        document.querySelector('.cmp-control-content.cmp-active').style.height = contentH+"px";
        cmp.listView("#pullrefresh").refresh();
    }
    //初始化样式
    function initStyle() {
        var _appId = getParam.appId;
        var isString = /[a-z]/i; 
        //不是默认应用或者是表单或者无流程表单都隐藏进入应用按钮
        if(isString.test(_appId) || _appId == "2" || _appId =="47"){ 
            // $('.message-footer').hide();
            cmp.listView("#pullrefresh").refresh();
        }
        //无应用权限隐藏进入应用按钮
        nativeApi.getAppInfoAppId(_appId,function(res){
            var data = JSON.parse(res);
            if(!res || data.isShow == "0"){
                // $('.message-footer').hide();
                refreshContentScroll();
                // $('#entryCollaboration').hide();
            }else{
                $('.message-footer').removeClass('display_none');
                refreshContentScroll();
            };
        },function(res){
            console.log(res);
            // $('.message-footer').hide();
            refreshContentScroll();
        });
        //筛选遮罩层
        var headerHeight = $("header").height();
        $("div.filter").css({
            "top": headerHeight,
            "height": "calc( 100% -" + " " + headerHeight + "px" + ")"
        });
        //标题
        $(".cmp-title").html(messageDetail.messageTitle);
        
    }

    function initCommon() {
        //获取从上一级页面传来的参数
        var param = m3.parseQueryString(this.location.href);
        messageDetail.category = param.appId;
        messageDetail.messageTitle = param.messageTitle;
        console.log(messageDetail);
        // messageDetail.dbId = parms.dbId;
    }

    function initEvent() {
        //清空消息
        $(".cmp-header-right").on("tap", function() {
            m3.state.go('http://message.m3.cmp/v/layout/message-setting.html?cmp_orientation=auto', {
                appId: messageDetail.category,
                title: messageDetail.messageTitle
            }, '', 1);
        });

        var timer;
        //点击穿透
        $("#pullrefresh").on("tap", "li.msg-list", function(e) {
            var objThis = $(this);
            clearTimeout(timer);
            timer = setTimeout(function() {
                if(objThis.hasClass('read-readonly'))return;
                objThis.removeClass('unread');
                // objThis.addClass('binded');
                // objThis.find(".unread-mark").hide();
                openMsgDetial(e, objThis);
            }, 350);
        });

        //全部标为已读
        $("#allread").on("tap",function(){
            cmp.notification.confirm(fI18nData["message.m3.h5.allreadalert"],function(index){
                if(index == 1){
                    var appId = cmp.href.getParam().appId;
                    m3Ajax({
                        url:m3.curServerInfo.url + "/mobile_portal/api/message/update/"+appId +"/1",
                        type:"POST",
                        success:function(res){
                            if(res.code == "200"){
                                $(".toDo_listes").find('.msg-list').removeClass('unread');
                                // $(".toDo_listes").find('.msg-list').addClass('binded');
                                // $(".toDo_listes").find(".unread-mark").hide();//隐藏红色脚标
                            }
                        },
                        error:function(res){
                            console.log(res);
                        }
                    });
                    
                }
            });
            
        });
        //进入应用
        $("#entryCollaboration").on("tap",function(){
            var appId = getParam.appId;
            var key = "newcoll";
            nativeApi.getAppInfoAppId(appId,function(res){
                if(!res){
                    cmp.notification.alert("无权限查看");
                    return;
                };
                m3.loadApp(JSON.parse(res));
            });
            //根据key值获取权限
            // nativeApi.getAuthorityByKey(key,function(res){
            //     if(res == "true"){
            //         m3.getDefaultAppByAppId(appId,function(res){
            //             if(!res)return;
            //             m3.loadApp(res);
            //         });
            //     }else {
            //         cmp.notification.alert("无权限查看");
            //     }
            // });
            
        });

        //返回消息一级页面
        $("#backBtn").on("tap", function returnParent() {
            cmp.webViewListener.fire({
                type: "com.seeyon.m3.message.statusChange",
                data: {
                    appId: messageDetail.category,
                    changeType: "read"
                }
            });
            cmp.href.back();
        });

        cmp.webViewListener.add({
            type: 'com.seeyon.m3.message.statusChange'
        });
        document.addEventListener("com.seeyon.m3.message.statusChange", function(event) {
             if ( event.data.changeType === 'deleteAll') {
                 window.location.reload();
             }
        });

        //安卓自带返回键
        document.addEventListener("backbutton", androidBackBtn);
    }

    function initData() {
        cmp.listView("#pullrefresh", {
            config: {
                pageSize: 20,
                dataFunc: function(params, option) {
                    getMessageCategortData(params, option);
                },
                params: [{}],
                renderFunc: renderMessageCategoryData,
                onePageMaxNum: 140,
                minTime:0,//加载回调的时间
                crumbsID: messageDetail.category,
                reverse:true   //如果是倒序设置此参数为true
            },
            up: {
                contentdown: '', //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
                contentrefresh: '', //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '', //可选，请求完毕若没有更多数据时显示的提醒内容；
                contentnextpage: ''
            },
            down: {
                contentdown: m3i18n[cmp.language]._pullupTipDown, //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: m3i18n[cmp.language].pulldownTipOver, //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: m3i18n[cmp.language].pulldownTipRefresh, //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                contentprepage: m3i18n[cmp.language].pullupTipNextpage,
                contentnomore: m3i18n[cmp.language].pullupTipNomore
            }
        });
    }

    //获取列表数据
    function getMessageCategortData(param, options) {
        var url = m3.curServerInfo.url + "/mobile_portal/api/message/receive/" + messageDetail.category + "?pageSize=20&pageNo=" + param["pageNo"] + "&identifier=" + Date.now().toString();
        m3Ajax({
            type: "GET",
            url: url,
            success: function(msg) {
                console.log(msg);
                cmp.dialog.loading(false);
                $('.cmp-scroll').removeClass('display-none');
                if (msg.code == 200) {
                    if (msg.data.data.length != 0) {
                        for (var i = 0; i < msg.data.data.length; i++) {
                            msg.data.data[i].createTime = m3.showTime(msg.data.data[i].createTime);
                            msg.data.data[i].content = msg.data.data[i].content.replace(/[\r\n]/g, " ");
                        }
                        msg.data.data = arrSort(msg.data.data);
                        options.success(msg.data);
                    } else {
                        //alert('调试代码：数据为空');
                        options.success(msg.data);
                    }
                }
                // refreshContentScroll();
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
        });
    };

    function arrSort(arr) {
        var data = [];
        for (var i = arr.length - 1;i >= 0;i--) {
            data.push(arr[i]);
        }
        return data;
    }
    var count = 0;
    //渲染列表数据
    function renderMessageCategoryData(msg, isRefresh) {
        cmp.webViewListener.fire({
            type: "com.seeyon.m3.message.statusChange",
            data: {
                appId: messageDetail.category,
                changeType: "read"
            }
        });
        var table = $('.toDo_listes');
        $('.cmp-next-page').css('display', 'none!important');
        if (!isRefresh) {
            table.children().eq(0).before(showList(msg));
        } else {
            if(count === 0) {
                count++;
                table.html(showList(msg));
            }
        }
         if(typeof canChat == "undefined"){
             document.addEventListener("getChatVersionOk",function(){
                 if(canChat){
                     bindForwardMsgEvent();
                 }
             })
         }else {
             if(canChat){
                 bindForwardMsgEvent();
             }
         }

        //bindForwardMsgEvent();
        $("#toDo_listes li").each(function() {
            if ($(this).attr("data-model")) {
                $(this).addClass("message-" + messageDetail.category);
            }
        })

        function showList(data) {
            var str = '';
            for (var i = 0; i < data.length; i++) {
                var readClass = '',
                    item = data[i],
                    titleStr = '',
                    contentStr = '',
                    url = item.senderFaceUrl;
                //已读标
                if (item.status !== 'read') readClass = 'unread';
                //拼接
                //messageDetail.messageTitle + fI18nData["message.m3.h5.notice"]  移动协同
                // <div class="userImg" style="background:url('+url+')"; ></div>  --头像
                str += '<li class="timeStamp"><span class="cmp-badge">'+item.createTime+'</span></li>';
                str += '<li class="msg-list ' + readClass + '  read-'+item.readonly+'" data-type="' + item.appType + '" data-id="' + item.messageId + '" data-appid="' + item.appId + '" data-data=\'' + item.gotoParams + '\' data-read="' + item.readonly + '">' + '\
                        <div class="title"><span>'+ item.senderName +'</span></div>\
                        <span class="content textover-8">' + item.content.escapeHTML() + '</span>\
                        <span class="line"></span>';
                str += '<span class="send-info">\
                            <span class="send-detail"><span class="unread-mark"></span>' + fI18nData["message.m3.h5.lookdetail"] + '</span>\
                        </span></li>';
                // str += '' + (item.readonly === "readonly" ? "<i class='cmp-icon iconfont see-icon-m3-notViewed'></i>" : "") + '</li>'; 
                    // <span class="send-user">' + item.senderName + '</span>\
                    // <span class="send-time">' + item.createTime + '</span>\
            }
            return str;
        }

    }
    function getCanChat(){//获取是否能调起致信
        cmp.chat.exec("version",{
            success: function(result){
                canChat = true;
                cmp.event.trigger("getChatVersionOk",document);
            },
            error: function(err) {
                canChat = false;
                cmp.event.trigger("getChatVersionOk",document);
            }
        });
    }
    //绑定转发事件
    function bindForwardMsgEvent(){
        var ul= document.querySelector(".toDo_listes");
        var li = ul.querySelectorAll("li");
        for(var i = 0;i<li.length;i++){
            (function(i){
                var oneMsg = li[i];
                var read = oneMsg.getAttribute("data-read");
                if(read != "readonly") {
                    if(!oneMsg.classList.contains("binded")){
                        cmp.event.touchHold(oneMsg,function(){
                            cmp.notification.infoPopup({
                                btnsInfo:[cmp.i18n("message.m3.h5.forwardMsg")],
                                callback:function(index){
                                    if(index >0) return;
                                    cmp.dialog.loading();
                                    var data = {messageId:oneMsg.getAttribute("data-id")};
                                    m3Ajax({
                                        type: "POST",
                                        url: cmp.seeyonbasepath + "/rest/m3/message/business/data",
                                        data:JSON.stringify(data),
                                        success: function(msg) {
                                            msg = msg.data;
                                            msg.title = messageDetail.messageTitle + fI18nData["message.m3.h5.notice"];
                                            cmp.dialog.loading(false);
                                            cmp.chat.exec("forwardMessage",{
                                                params:msg,
                                                success:function(){
                                                    cmp.notification.toast(cmp.i18n("message.m3.h5.forwardSuccess"));
                                                },
                                                error:function(e){
                                                    if(e && e.code != 36010){//暂时不处理转发取消的情况
                                                        cmp.notification.alert(cmp.i18n("message.m3.h5.forwardFailed"),null,cmp.i18n("message.m3.h5.tips"),cmp.i18n("message.m3.h5.ok"));
                                                    }
                                                }
                                            })
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
                                    });
                                }
                            });
                        });
                        oneMsg.classList.add("binded");
                    }
                }
            })(i);
        }
    }

    //穿透到消息详情
    function openMsgDetial(event, objThis) {
        event.stopPropagation();
        var appid = objThis.attr('data-appid');
        var appInfo = objThis.attr("data-type");
        var read = objThis.attr("data-read");
        var app = JSON.parse(objThis.attr("data-data"));

        if (appInfo != "default") {
            var thirdpartyMessageId = app.thirdpartyMessageId;
            if(thirdpartyMessageId){
                m3Ajax({
                    url:cmp.seeyonbasepath + "/rest/cip/thirdpartyMessage/through/" + appid + "/" + thirdpartyMessageId,
                    type:"GET",
                    success:function(msg){
                        console.log(msg);
                        cmp.dialog.loading(false);
                        if (msg.code == 200) {
                            var appParams = msg.data;
                            if(!appParams){
                                cmp.notification.alert("第三方详情穿透参数为空，导致不能穿透",null,null,cmp.i18n("confirm"));
                                return;
                            }
                            m3.loadApp({
                                "appId": appid,
                                "bundle_identifier": appParams.bundle_identifier,
                                "bundle_name": appParams.bundle_name,
                                "team": appParams.team,
                                "version": appParams.version,
                                "appType": appParams.appType,
                                "downloadUrl": appParams.downloadUrl,
                                "entry": appParams.entry,
                                "parameters": ""
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
            }else {//兼容一下老的服务器版本，
                m3.loadApp({
                    "appId": appid,
                    "bundle_identifier": app.bundle_identifier,
                    "bundle_name": app.bundle_name,
                    "team": app.team,
                    "version": app.version,
                    "appType": app.appType,
                    "downloadUrl": app.downloadUrl,
                    "entry": app.entry,
                    "parameters": ""
                }, "message");
            }


        } else {
            if (read == "readonly") {
                return;
            }

            m3.penetrated({
                appId: appid,
                type: "message",
                returnUrl: m3.href.map.message_detail,
                sendParms: app,
                returnParms: null,
                openNewPage: 1
            })

        }
    }

    //安卓返回键
    function androidBackBtn() {
        var obj = $('.window_alert');
        if (obj.length !== 0) {
            obj.remove();
            $('.cmp-backdrop').remove();
        } else {
            cmp.webViewListener.fire({
                type: "com.seeyon.m3.message.statusChange",
                data: {
                    appId: messageDetail.category,
                    changeType: "read"
                }
            });
            cmp.href.back();
        }
    }
}());

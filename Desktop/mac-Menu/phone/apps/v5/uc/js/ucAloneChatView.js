var $chatView = {
    globalParams : {},
    content: _$(".cmp-control-content"),//聊天区
    chatList : _$("#chat_list"),
    userId: cmp.member.id,
    states: {
        chatType: 'chat',//单人聊天标识
        endTime: '',
        toId: '',
        toName: ''
    },
    emoji : null,
    pos : 0, // 页面初始化位置
    timestamp : null, //记录最新消息的时间戳
    uc_url : "",
    readTime : 0,//标识未读已读的时间戳
    sendMsgId : null,
    optionData :  null,
    toId : cmp.href.getParam().toId
};
cmp.ready(function () {
	//ios隐藏文件按钮
	if(cmp.os.ios){
	     document.getElementById("uc-file").style.display="none";
	 }
	
    // 页面方法入口
    $chatView.init();
  //异步执行检查UC状态
    window.setTimeout(function(){
        uc.checkUCState();
    	},500);
});
// 页面方法入口
$chatView.init = function () {
    // chat.initParams();// 初始化页面参数
    // $chatView.sendAgreement();//发送已读/未读协议
    // chat.loadHisData();// 加载页面数据
    uc.db.getUcMessageMsgAll($chatView.toId, $chatView.userId, function(res){
        chat.initParams();// 初始化页面参数
        $chatView.sendAgreement();//发送已读/未读协议
        // chat.loadHisData();// 加载页面数据
        cmp.listView("#all_chat", {
            config: {
                params: {},
                pageSize: 20,
                renderFunc: chat.renderData,
                dataFunc: function(params, option){
                    var end = null;
                    if ($chatView.states.endTime != "") {
                        end = $chatView.states.endTime;
                    }
                    getRecentChat($chatView.userId, $chatView.states.toId, $chatView.states.chatType, end, function (result) {
                        var dom = getMessageXml(result);
                        var listData = {};
                        if(dom.xmlMsg.length == 0){
                            listData.data = [1];
                        }else{
                            var msg = dom.xmlDoc.getElementsByTagName("message")[0];
                            var msgId = msg.getAttribute("id");
                            var li = document.getElementById(msgId);
                            if (!li) {
                                listData.data = dom.xmlMsg;
                                for (var i = 0; i < listData.data.length; i++) {
                                    if (listData.data[i].querySelector("microtalk")) {
                                        for (var j = 0; j < res.length; j++) {
                                            var messageId = res[j].messageId;
                                            var id = listData.data[i].querySelector("id").textContent;
                                            if (id == messageId) {
                                                listData.data[i].setAttribute("isRead","read");
                                            }
                                        }
                                    }
                                }
                            } else {
                                listData.data = [1];
                            }
                        }
                        listData.total = uc.getElementsByTagName(dom.xmlDoc,"totalnum");                
                        option.success(listData);
                    },function(result){
                        if(result && result.code == "36005"){
                            cmp.notification.alert(result.message,function(){
                                cmp.href.closePage();
                            },"","确定");
                        }
                    });
                },
                isClear: true
            },
            down: {
                contentdown: '',
                contentover: '',
                contentrefresh: '',
                contentprepage: "上一页"
            },
            up: {
                contentdown: '上拉显示更多',
                contentrefresh: '',
                contentnomore: '没有更多',
                contentnextpage: "下一页"
            }
        });
        //聊天页面底部图标居中问题
        if(document.getElementById("uc-file").style.display == "none") {
            var spans = document.querySelectorAll(".uc-chat-toolbar span");
            for (var i=0;i<spans.length;i++) {
                spans[i].style.width = "20%";
            }
        };

        $chatView.initPageEvent();// 初始化页面监听事件
    });
    
    // $chatView.initPageEvent();// 初始化页面监听事件
};
$chatView.sendAgreement = function () {
    chat.listenerReadMsg();// 打开窗口后，告诉服务器此刻已经读了所有消息
    chat.knowOtherReadMsg();// 给对方发送消息后，向服务器发送请求，得知对方最后一次读取消息的时间戳
}
/**
 * 初始化页面各种事件
 *
 */
$chatView.initPageEvent = function () {
    cmp.HeaderFixed("#header",chat.input_text);
    cmp.footerAuto('#footer_num1');
    // 显示聊天窗口名称
    chat.showTitle();
    // 接收对方发送消息
    chat.receiveMsg();
    //返回
    document.getElementById("prev").addEventListener("tap",function(){
        if(location.search.indexOf("?") != -1){
            cmp.href.close();
        }else{
            chat.saveHisCon();
            var number = $ucChatToolsFunction.picture.returnCount;
            var complete = $ucChatToolsFunction.doc.isComplete;
            if ((number && number != 0) || (complete == "false")) {
                var fileMsg = "";
                if (number && number != 0) {
                    fileMsg = "正在发送图片，返回将停止发送，是否返回？";
                } else {
                    fileMsg = "正在发送文件，返回将停止发送，是否返回？";
                }
                cmp.notification.confirm(fileMsg,
                    function(index) {
                        if (index == 1) {
                            cmp.href.back();
                        } else if (index ==0) {
                            
                        } else {

                        }
                    },"",["取消","确定"]);
            } else {
                cmp.href.back();
            }
        }
    });
    cmp.backbutton();
    cmp.backbutton.push(function(){
      if(location.search.indexOf("?") != -1){
            cmp.href.close();
        }else{
            chat.saveHisCon();
            var number = $ucChatToolsFunction.picture.returnCount;
            var complete = $ucChatToolsFunction.doc.isComplete;
            if ((number && number != 0) || (complete == "false")) {
                var fileMsg = "";
                if (number && number != 0) {
                    fileMsg = "正在发送图片，返回将停止发送，是否返回？";
                } else {
                    fileMsg = "正在发送文件，返回将停止发送，是否返回？";
                }
                cmp.notification.confirm(fileMsg,
                    function(index) {
                        if (index == 1) {
                            cmp.href.back();
                        } else if (index ==0) {
                            
                        } else {

                        }
                    },"",["取消","确定"]);
            } else {
                cmp.href.back();
            }
        }
    });
    $("#uc-input-text").on("blur",function (e) {
        $("#chat_list").css("marginTop",0);
    });
    // chat.back("#prev");
    
    // chat.back("#prev");
    //发送文本消息
    // chat.clickKeybord();
    //点击屏幕，隐藏工具栏
    $chatView.content.addEventListener("touchend", chat.hideTools);
    $chatView.content.addEventListener("touchend", chat.hideKeyBorad);
    // 手指滑屏，隐藏工具栏
    chat.figerHideTools();
    //点击屏幕，移出弹出气泡样式
    $chatView.content.addEventListener("tap", chat.removeBubble);
    $chatView.content.addEventListener("touchstart", chat.removeBubble);
    //查看人员卡片
    _$("#peopleCard").addEventListener("tap", $chatView.toPerson);
    // 点击工具栏
    $ucChatToolsFunction.clickChatTools();
    //语音文件点击
    cmp("body").on("tap", ".voice", $ucChatToolsFunction.record.openRecord);
    // 点击输入框，固定页头
    _$("#uc-input-text").addEventListener("tap", chat.headerFixed);
    // 隐藏转发的浮层
    // chat.closeDiv();
    // 获取缓存
    chat.getStorage();
    // 读文件内容
    cmp("#chat_list").on("tap","li",$ucChatToolsFunction.doc.openFile);
    // 点击聊天窗口中的图片，进行查看大图
    cmp("#chat_list").on("tap",".uc-chat-img",$ucChatToolsFunction.picture.lookBigPic);
    // 消息发送失败后，再次点击发送
    cmp("#chat_list").on("tap","li",chat.reSend);
}

/**
 * 查看人员卡片
 */
$chatView.toPerson = function () {
    cmp.href.next("http://my.m3.cmp/v1.0.0/layout/my-person.html?id="+$chatView.states.toId);
};

/**
 * 初始化语音波长
 *
 */
// $chatView.initVoiceLen = function(){
//   var voiceList = querySelectorAll(".voice");
//   if(voiceList.length > 0){
//     for(var i = 0;i < voiceList.length;i ++){
//       voiceCommonFunc.voiceProgressWidth(20,voiceList[i],"icon-other-voice3",".voice");
//     }
//   }
// }

/**
 * 点击语音，播放/停止动画
 */
// $chatView.voiceAnimation = function(event){
//   if(event && event.stopPropagation){
//     event.stopPropagation();
//   }else{
//     window.event.cancelBubble = true;
//   }
//   $chatView.panel.style.display = "none";
//   if($chatView.playFlag){
//     $chatView.timer = voiceCommonFunc.voicePlayAnimation(this,"icon-other-voice");
//     $chatView.playFlag = false;
//   }else{
//     voiceCommonFunc.voiceStopAnimation(this,"icon-other-voice",$chatView.timer);
//     $chatView.playFlag = true;
//   }
// }

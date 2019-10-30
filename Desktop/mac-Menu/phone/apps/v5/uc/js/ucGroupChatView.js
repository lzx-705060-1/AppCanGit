var $chatView = {
    globalParams : {},
    content: _$(".cmp-control-content"),//聊天区
    chatList : _$("#chat_list"),
    userId: cmp.member.id,
    states: {
        chatType: 'groupchat',//群组聊天标识
        endTime: '',
        toId: '',
        toName: ''
    },
    emoji : null,
    pos : 0, // 页面初始化位置
    timestamp : null, //记录最新消息的时间戳
    uc_url : "",
    createGroup : null,
    toId : cmp.href.getParam().toId
};
cmp.ready(function () {
	//ios隐藏文件按钮
	if(cmp.os.ios){
	     document.getElementById("uc-file").style.display="none";
	 }
    // 页面方法入口
    $chatView.init();
});
// 页面方法入口
$chatView.init = function () {
    // chat.initParams();// 初始化页面参数
    // chat.loadHisData();// 加载页面数据
    // //聊天页面底部图标居中问题
    // if(document.getElementById("uc-file").style.display == "none") {
    //     var spans = document.querySelectorAll(".uc-chat-toolbar span");
    //     for (var i=0;i<spans.length;i++) {
    //         spans[i].style.width = "20%";
    //     }
    // };
    // $chatView.initPageEvent();// 初始化页面监听事件
    uc.db.getUcMessageMsgAll("",$chatView.toId, function(res){
        chat.initParams();// 初始化页面参数
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
};
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
            if($chatView.createGroup){
                cmp.href.next(ucPath + "/html/ucIndex.html",{
                    animated : true,
                    direction : "left"
                });
            }else{
                var number = $ucChatToolsFunction.picture.returnCount;
                var complete = $ucChatToolsFunction.doc.isComplete;
                if (number && number != 0 || (!complete)) {
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
        }
    });
    cmp.backbutton();
    cmp.backbutton.push(function(){
      if(location.search.indexOf("?") != -1){
            cmp.href.close();
        }else{
            chat.saveHisCon();
            if($chatView.createGroup){
                cmp.href.next(ucPath + "/html/ucIndex.html",{
                    animated : true,
                    direction : "left"
                });
            }else{
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
        }
    });
    $("#uc-input-text").on("blur",function (e) {
        $("#chat_list").css("marginTop",0);
    });
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
    //查看群资料
    _$("#uc-property-group").addEventListener("tap", $chatView.toGroupInfo);
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
$chatView.toGroupInfo = function(){
  var param = {
      groupId : $chatView.states.toId,
      groupName : $chatView.states.toName,
      block : $chatView.states.block,
      index : $chatView.globalParams.createGroup ? $chatView.globalParams.createGroup : false
  };
  cmp.href.next(ucPath + "/html/ucGroupInfo.html", param, {
    animated : true,
    direction : "left"
  });
};
var isFirstAt = true;
function shyaringan(event) {
    var newStr = _$("#uc-input-text").value;
    var oldStr = _$("#uc-input-copy").value;
    if(oldStr+"@" == newStr){
        if (isFirstAt) {
            chat.createAtDialog();
            isFirstAt = false;
        }
        chat.openAtDialog();
    }
    _$("#uc-input-copy").value = newStr;
}
$chatView.reFreshGroupMember = function (){
    ucGroupApi.groupMemberList(cmp.member.id,$chatView.states.toId,$chatView.states.toName,function (result) {
        var obj = getIqXml(result);
        var groupMembers = obj.xmlDoc.getElementsByTagName("jid");//列表
        var nowGroupMap = {memberNum:groupMembers.length,memberMap : {}};
        if(groupMembers != null && nowGroupMap.memberNum > 0){
            for(var i = 0; i < nowGroupMap.memberNum ; i++){
                var member = groupMembers[i];
                var memberInfo = {
                    id : member.getAttribute("J").split("@")[0],
                    name : "",
                    sort : "",
                    img : ""
                };
                nowGroupMap.memberMap[memberInfo.id] = memberInfo;
            }
            cmp.storage.save("nowGroupMap",cmp.toJSON(nowGroupMap),true);
        }else{
            cmp.notification.alert("群成员读取出错！",function(){
                cmp.href.back();
            },"","确定");
        }
    },function(data){
    	var domParser = new DOMParser();
        var xmlDoc = domParser.parseFromString(data, 'text/xml');
        var dataxml = xmlDoc.getElementsByTagName("error");
        if(dataxml.length!=0){
            var datacode=dataxml[0].getAttribute("code");
           if(datacode == "36005"){
                cmp.notification.alert("",function(){
                    cmp.href.closePage();
                },"","确定");
            }else if(datacode == "404"){
                uc.db.delGroupMessage($chatView.states.toId,function(userId){
                  cmp.notification.alert("您已不在该群中!",function(){
                        cmp.href.back();
                    },"","确定");          
                });
            } 
        }
    });
}
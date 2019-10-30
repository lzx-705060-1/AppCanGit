var $message = {
  ul : _$("ul#message_list"), // 消息列表
  params : {},// 参数
  page : {},
  states : {
      page: 'ucIndex',
      endTime:''
  },
  groupIdList : []
};
cmp.ready(function() {
  
  initCloseGroupIdList();// 获取所有被屏蔽群的id集合
  $message.reloadPage();// 显示搜索框 
  // $message.calendar();// 显示日期
  $message.initEvent();// 初始化事件
  $message.receiveMsg();// 接收消息
  params=cmp.href.getBackParam();
  if(params&&params!=null&&!params.isReload){
     console.log("不异步加载最新消息");
   }else{
    //异步执行服务消息加载
    window.setTimeout(function(){
    		asynchronousLoad();
        uc.checkUCState();
    	},500);
  uc.checkChatListener();
  uc.userInfo.setUcServerIp();
   }
});

//异步加载 fut
function asynchronousLoad(){
  var end = null;
  if($message.states.endTime != ""){
    end = $message.states.endTime;
  }
  getRecentChatRecord(uc.userInfo.getId(),end,function(result){
    var domParser = new DOMParser();
    var xmlDoc = domParser.parseFromString(result, 'text/xml');
    var ms = xmlDoc.getElementsByTagName("message");
    var total = xmlDoc.getElementsByTagName("totalnum")[0].innerHTML;
    var listData = {};
    listData.data = ms;
    listData.total = total;
    if (listData.data && listData.data.length > 0) {
        uc.db.insertUcIndexMsgList(uc.userInfo.getId(),listData.data, function(res) {
            uc.db.getUcIndexMsgList(function(res) {
              if($message.ul.childElementCount<1){
                 // console.log("长度为0，初始化页面");
                $message.reloadPage();
              }else{
                // console.log("长度为"+$message.ul.childElementCount);
                //循环
                var len = res.length;
                for(var i = 0; i < len; i ++){
                   addItem(res[i]);
                }
                
              }
            });
        });
    }
  },function(result){
    if (result) {
      if(result.code == "36005"){
        console.log("连接失败！");
  //      cmp.notification.alert(result.message,function(){
  //          cmp.href.closePage();
  //      },"","确定");
  //      uc.checkUCState();
      }
    } else {
      cmp.notification.toast("加载服务器消息失败","center",2000);
    }
    
  });
}

function _$(id) {
  if (id) {
    return document.querySelector(id);
  }
  return null;
}
// 获取所有被屏蔽群的id集合
function initCloseGroupIdList(){
  ucGroupApi.getCloseGroupIdList(cmp.member.id,function(data){
    var domParser = new DOMParser();
    var xmlDoc = domParser.parseFromString(data, 'text/xml');
    var iq = xmlDoc.getElementsByTagName("iq")[0];
    var groups = iq.getElementsByTagName("groups")[0];
    var g = groups.getElementsByTagName("group");
    var gLen = g.length;
    if(gLen > 0){
      for(var i = 0;i < gLen; i++){
        $message.groupIdList.push(uc.innerHTML(g[i]));
      }
    }
  },function(data){
    if(data.code == "36005"){
//        cmp.notification.alert(data.message,function(){
//            cmp.href.closePage();
//        },"","确定");
    	console.error(data.message);
    }
  });
}


$message.receiveMsg = function(){
    // var groutchat="<message xmlns=\"jabber:client\" from=\"1710255815@group.localhost\" to=\"1909473625151127758@localhost\" t=\"2017-03-23T16:28:01.402042+08:00\" id=\"-3690516995302798297409060B8D57C\" type=\"groupchat\"><body>3669852</body><name>6</name><toname>123456</toname><atList></atList><groupname>123456</groupname><user>-3690516995302798297@localhost</user></message>";
    // var chat="<message xmlns=\"jabber:client\" from=\"-3690516995302798297@localhost/mobile\" to=\"1909473625151127758@localhost\" t=\"2017-03-23T16:31:09.336042+08:00\" id=\"-369051699530279829734BFB5CF8A4F\" type=\"chat\"><body>123456</body><name>6</name><toname>1</toname><undefined></undefined></message>";
    document.addEventListener("UC_getMessage", function (res) {
      var data = res.data;
      var result = data.params;
      var domParser = new DOMParser();
      var xmlDoc = domParser.parseFromString(result, 'text/xml');
      var dataxml = xmlDoc.getElementsByTagName("message");
      //console.log(dataxml);
      if(dataxml && dataxml.length > 0){
        if(dataxml[0].getAttribute("type") && dataxml[0].getAttribute("type") != null){
          var noData = document.querySelector(".StatusContainer");
          if (noData) {
            noData.style.display = "none";
          }
          var msgInfo=uc.getFormatMsgInfo(uc.userInfo.getId(),dataxml[0],$message.groupIdList);
          
          if(dataxml[0].getAttribute("type") == 'add_group'||msgInfo.rover){
            console.log("不处理此类消息!");
          }else if(dataxml[0].getAttribute("type") == 'destroy_group'||dataxml[0].getAttribute("type") == 'kitout_group'){
            uc.db.delGroupMessage(msgInfo.userId,function(userId){
              if(userId&&userId!='undefined'){
                delItem(userId);
              }            
            });
          }else if(dataxml[0].getAttribute("type") == 'group_info_notice_update'){
            //群公告更新暂时不做任何处理
          }else if(dataxml[0].getAttribute("type") == 'group_info_update' || dataxml[0].getAttribute("type") == 'add_group'){
            //PC端修改群名称，群描述和增加删减群成员时，移动端暂不处理
          }else{ //普通消息
            
            //默认未读数为1
            msgInfo.count=1;
            uc.db.insertUcIndexMsg(msgInfo,false, function(res) {
              uc.db.getUcIndexMsg(msgInfo.userId ,function(resultObj){
                //添加子元素
                addItem(resultObj);
                //如果列表小于1，做一次全局刷新
                if($message.ul.childElementCount<1){
                  location.reload();
                }
             });
            });
          }
        }
      } else {
        cmp.notification.toast("加载服务器消息失败","center",2000);
      }
    });
  }


//添加元素
function addItem(msgInfo){
console.log("this------------")
console.log(msgInfo.body)
var pendingTPL = uc.innerHTML(document.getElementById("ms_list_li"));
  var msgObject=formateMessageForHtml(msgInfo);
  if(msgObject!=null){
     var li = document.getElementById(msgObject.userId);
    var html;
    if(li!=null){
        document.getElementById("message_list").removeChild(li);
     }
    
    html = cmp.tpl(pendingTPL,msgObject);
    html=parseDom(html)[0];  
    // 插入消息到列表
    addMsgLi(html,msgObject.toTop);
    // 添加侧滑功能
    $message.addSlide(msgObject.toId,msgObject.toTop);
  }
}
//删除元素
function delItem(itemId){
  var pendingTPL = uc.innerHTML(document.getElementById("ms_list_li"));

  var li = document.getElementById(itemId);
  if(li!=null){
      document.getElementById("message_list").removeChild(li);
   }
  
}



// 更新消息列表
function addMsgLi(html,isTopLi){
    var topEle = $message.ul.querySelectorAll("li[class~=uc-top]");
    if(topEle.length != 0){
      // 如果接收的消息是置顶的，那么始终插入到列表的第一位
      if(isTopLi){
        $message.ul.insertBefore(html, $message.ul.firstChild);
      }else{
        // 否则，插入到置顶消息的后第一位
        $message.ul.insertBefore(html, topEle[topEle.length - 1].nextElementSibling);
      }
    }else{
      $message.ul.insertBefore(html, $message.ul.firstChild);
    }
}
/**
 * 初始化页面事件
 * 
 */
$message.initEvent = function(){
  $message.initGroupCom();// 发起群组交流
  $message.initSingleChat();// 发起单人交流
  $message.openAddIcon();// 点击头部加号，打开加号页面
  $message.closeAddIcon();// 点击加号页面的叉子，关闭加号页面
  $message.putTop();// 置顶功能
  $message.delet();// 删除功能
  $message.markRead();// 标为已读
  $message.listenTopToOther();
  $message.listenCancelTopToOther();
}

$message.reloadPage = function(){
  // 搜索暂不做
  // var searchDiv = document.getElementById("search");
  // var reSearchDiv = document.getElementById("reSearch");
  // if ($message.page.condition != undefined) {
  // searchDiv.style.display = "none";
  // reSearchDiv.style.display = "block";
  // if ($message.page.condition != "publishDate") {
  // _$("#searchText").style.display = "block";
  // _$("#searchDate").style.display = "none";
  // _$("#cmp_search_title").innerHTML = $message.page.text;
  // _$("#searchResultSpan").innerHTML = $message.page.textHTML;
  // _$("#searchTextValue").value = _$("#searchResultSpan").innerText;
  // $message.page.textfield1 = _$("#searchResultSpan").innerText;
  // } else {
  // _$("#searchText").style.display = "none";
  // _$("#searchDate").style.display = "block";
  // _$("#cmp_search_title").innerHTML = $message.page.text;
  // _$("#searchDateBeg").value = $message.page.textfield1;
  // _$("#searchDateEnd").value = $message.page.textfield2;
  // }
  // cmp.backbutton.pop();
  // } else {
  // searchDiv.style.display = "block";
  // reSearchDiv.style.display = "none";
  // }
  $message.loadData();
}

$message.loadData = function() {
  cmp.listView("#all_uc", {
    config: {
      captionType:0,
      height: 60,// 可选，下拉状态容器高度
      pageSize: 20,
      params: {} ,
      renderFunc: renderList,
      dataFunc: function(params,option){  // 请求数据的函数
        uc.db.initTables(function() {
          uc.db.getUcIndexMsgList(function(res) {
            var listData = {};
            listData.total = res.length;
            listData.data = res;
            option.success(listData);
            });
      });
      },
      isClear: true
    },
    down: {
      contentdown: "下拉刷新",// cmp.i18n("下拉刷新"),
      contentover: "释放刷新",// cmp.i18n("释放刷新"),
      contentrefresh: ""// cmp.i18n("松开刷新")
    },
    up: {
      contentdown: "加载更多",// cmp.i18n("加载更多"),
      contentrefresh: "加载更多",// cmp.i18n("加载更多"),
      contentnomore: "没有更多"// cmp.i18n("没有更多")
    }
  });
  $message.jumpToChatView();
  $message.prevPage();
};

/**
 * 渲染row
 * fut
 * @param listData
 * @param isRefresh
 *            <iq id="-8014359079243331327"
 *            to="-8014359079243331327@localhost/mobile"
 *            from="-8014359079243331327@localhost" type="result"> <query>
 *            <totalnum>1</totalnum>
 *         <messages total='1' current='1'>
 *             <message type='chat' from='-8014359079243331327@localhost' to='-6385491944625976858@localhost' timestamp='2017-01-23T14:23:48.738239+08:00'>
 *                 <body>你好</body>
 *                 <name>aoh</name>
 *                 <toname>1</toname>
 *                 <count>2</count>
 *                 <unread>0</unread>
 *             </message>
 *         </messages>
 *     </query>
 * </iq>
 */
function renderList(listData,isRefresh){
  if(isRefresh){
      $message.ul.innerHTML = "";
  }
  var pendingTPL = uc.innerHTML(document.getElementById("ms_list_li"));

  var memberIdList = [];
  var len = listData.length;
  for(var i = 0; i < len; i ++){
      var msg = listData[len - i - 1];
      
      var result=formateMessageForHtml(msg);
      if(result!=null){
        var html = cmp.tpl(pendingTPL, result);
        $message.ul.innerHTML = $message.ul.innerHTML + html;

        if(i == (listData.total - 1)){
            $message.states.endTime = msg.dateTime;
        }
        // 添加侧滑功能
        $message.addSlide(result.toId,result.toTop);
      }

    
  }
}

function formateMessageForHtml(msg){
    if(msg.fromJid==null){
      return null;
    }
    var emoji = new $emoji();
    // 取缓存，聊天窗口的草稿
    var uc_chat = cmp.storage.get("uc_chat",true);
    if(uc_chat){
      uc_chat = JSON.parse(uc_chat);
    }
    var result = {
          userId:msg.userId,
          toId : msg.toJid != null ? msg.toJid.split("@")[0] : "",
          type : msg.msgType,
          from : msg.fromJid.split("@")[0],
          time : returnTime2(msg.dateTime),
          gn : msg.groupName ? true : false,
          count : msg.count,
          block : msg.block,// 屏蔽群组消息标识 1:屏蔽 0:没屏蔽
          timestamp : msg.dateTime
        };
    //判断群组
     // var isGroup=msg.groupName ? true : false;   
     if(msg.toJid==null&&msg.userId!=null){
        if (msg.msgType==='groupchat') {
          result.toId=msg.toJid=msg.userId+"@group.localhost";
          // msg.toJid =msg.userId+"@group.localhost";
        }else{
          result.toId=msg.toJid=msg.userId+"@localhost";
          // msg.toJid=msg.userId+"@localhost"
        }
     }
     if(msg.toJid.indexOf("group")>0||msg.fromJid.indexOf("group")>0){
        result.imgsrc=uc.getGroupAvatarUrl(msg.userId,msg.groupName,100);
      } else{
        result.imgsrc=uc.getSingleAvatarUrl(msg.userId,100);
      }

      if(msg.body!=null){
        result.content = emoji.emojiToM3(msg.body.replace(/&amp;nbsp;/g,"&nbsp;").replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;").replace(/&lt;br\/&gt;/g,"<br/>"));
        result.content = result.content.escapeHTML().replace(/&amp;nbsp;/g,"&nbsp;");
      }
      if(result.toId == uc.userInfo.getId()){
          // 最后一条信息是对方回复的情况
          result.toId = msg.fromJid.split("@")[0];
          result.name = msg.toName;
          if(result.gn){
            result.toname = msg.toName;
            result.name = msg.fromName;
          }else{
            result.toname = msg.fromName;
          }
      }else{
          result.toname =msg.toName;
          result.name =msg.fromName;
      }

      //转义符号替换
      if(result.toname!=null){
        result.toname=uc.htmlEncodeByRegExp(result.toname);
      }
      
      // 显示：[草稿]aa
      if(uc_chat && uc_chat[result.toId]){
          result.hasEdit = true;
          result.hisc = uc_chat[result.toId];// 取聊天窗口中文本框内的值
      }else{
          result.hasEdit = false;
      }
      // 判断置顶
      var stick = msg.stick;
      if(stick == 1){
        result.toTop = true;
        result.s_time = msg.stickTime;
      }else{
        result.toTop = false;
      }
      result.toname = result.toname.replace(/(^[&nbsp;]*)|([&nbsp;]*$)/g,"");
  return result;

}


// 添加置顶、标为已读、删除 aoh
$message.addSlide = function(id,flag){
    var list = document.getElementById(id);
    var newDir = document.createElement('div');

    newDir.className = "cmp-slider-right cmp-disabled";
    newDir.innerHTML = "<a id='top_"+id+"' class='cmp-btn cmp-btn-grey cmp-icon uc-top'>" + (flag ? "取消置顶" : "置顶") + "</a>";
    newDir.innerHTML += "<a id='unread_"+id+"' class='cmp-btn cmp-btn-yellow cmp-icon uc-readed'>标为已读</a>";
    
    newDir.innerHTML += "<a id='del_"+id+"' class='cmp-btn cmp-btn-red cmp-icon uc-del'>删除</a>";
    list.appendChild(newDir);
}

// 标为已读 fut
$message.markRead = function(){
  cmp($message.ul).on("touchend", "a.cmp-btn-yellow", function (e) {
    //阻止默认行为
    e.preventDefault();
    //通过绑定的事件编号 unread_-8852939267754474108 查询到需要修改的dom对象；
    var _self = this;
    if(_self.getAttribute("id")!=null){
      var li_id = _self.getAttribute("id").split('_')[1];
      uc.db.updateUnreader(li_id,function(result){
        var unreadEle = document.getElementById('count_'+li_id);
        unreadEle.setAttribute("class" ,"");
        unreadEle.innerHTML="";
        unreadEle.previousElementSibling.className = "cmp-ellipsis";
        var type = "";
        var isGroup = _self.getAttribute("data-gn");
        if(isGroup == "true"){
          type = "groupchat";
        }else {
          type = "chat";
        }
        sendToServerLastReadMsgTime(uc.userInfo.getId(), li_id, type,function(res){});
      });
    }
    $message.resume(_self);
  });
}


// 置顶功能 aoh fut
$message.putTop = function(){
  cmp($message.ul).on("touchend", "a.cmp-btn-grey", function(e) {
    e.preventDefault();
    var currentLi = this;
    var parEle;
    if(this.getAttribute("id")!=null){
      var li_id=this.getAttribute("id").split('_')[1];
      parEle=document.getElementById(li_id);
    }else{
      parEle=this.parentNode.parentNode;

    }
    var stickTime = new Date().getTime();
    if (currentLi.innerHTML == "置顶") {
      var toId = parEle.getAttribute("id");
    
      //更新数据库状态
      uc.db.updateStick(toId,1,stickTime,function(res){
       //删除老的item对象，在最上面插入
        parEle.className+=" delete";
        setTimeout(function(){
          $message.ul.removeChild(parEle);
          parEle.className = parEle.className.replace(" delete","");
          parEle.className+=" uc-top show";
          $message.ul.insertBefore(parEle,$message.ul.childNodes[0]);
          currentLi.innerHTML = "取消置顶";
          $message.resume(currentLi);
        },400);
      });
      //向致信服务端发送数据,置顶该条数据
      listSideslipApi.topFun.topMsg(uc.userInfo.getId(), toId, stickTime, function(result){});
         
    } else if(currentLi.innerHTML == "取消置顶") {
      var toId = parEle.getAttribute("id");
      currentLi.innerHTML = "置顶";
      $message.resume(currentLi);
      
      //更新数据库状态
      uc.db.updateStick(toId,0,null,function(res){
         //向致信服务端发送数据,取消置顶该条数据
        listSideslipApi.topFun.cancelTop(uc.userInfo.getId(), toId, stickTime, function(r){});
        location.reload();
        
      });
     
    }
  });
};

// 删除功能 aoh fut
$message.delet = function(){
  cmp($message.ul).on("touchend", "a.cmp-btn-red", function(e) {
    e.preventDefault();
    var parEle;
    if(this.getAttribute("id")!=null){
      var li_id=this.getAttribute("id").split('_')[1];
      parEle=document.getElementById(li_id);
    }else{
      parEle=this.parentNode.parentNode;

    }
    var toId = parEle.getAttribute("id");
    var time = parEle.getAttribute("data-timestamp");
    var noData = document.querySelector(".StatusContainer");
    uc.db.updateState(toId,0,function(){
      parEle.className += " delete";
      setTimeout(function(){
        $message.ul.removeChild(parEle);
        if (noData) {noData.style.display = "block";}
      },400);
    });
    
    // listSideslipApi.delFun.delList(toId,time,function(){}); 为什么要删除消息列表协议？？？
  });
}

// 点击左滑操作后恢复原样
$message.resume = function(target) {
  target.parentNode.previousSibling.previousSibling.style.webkitTransform = "translate3d(0px, 0px, 0px)";
  target.style.webkitTransform = "translate3d(0px, 0px, 0px)";
  var len = target.parentNode.childNodes;
  for(var i = 0;i < len.length;i++){
    len[i].style.webkitTransform = "translate3d(0px, 0px, 0px)";
  }
}
// 发起群组交流
$message.initGroupCom = function(){
  cmp(".uc-add").on("tap","#groupChat",function(e){
    cmp.href.next(ucPath + "/html/ucGroupList.html", {
      animated : true,
      direction : "left"
    });
  });
}
// 发起单人交流
$message.initSingleChat = function(){
  _$("#aloneChat").addEventListener("tap",function(){
    cmp.selectOrg("select",{
      type:2,
      flowType:1,
      fillBackData:[],
      excludeData:[{id:cmp.member.id,name:cmp.member.name,type:"member",display:"none"}],// 去掉自己
      jump:false,
      maxSize:1,
      minSize:1,
      selectType:"member",
      lightMemberPermission:true,
      callback:function(result){
        var resultObj = JSON.parse(result);
        var orgResult = resultObj.orgResult;
        if (orgResult.length > 0) {
          var peo = orgResult[0];
          var param = {
            "toId":peo.id,
            "chatType":"chat",
            "toName" : peo.name,
            "path" : "/html/ucAloneChatView.html"
          };
          //添加一条初始化聊天信息
          var msgInfo=uc.initChatMessageToDate(peo.id,peo.name,'chat',null);
          uc.db.insertUcIndexMsg(msgInfo,true, function(res){
            console.log("新增聊天数据");
            //进入详情
            toChat(param);
          });
          
          // cmp.selectOrgDestory("select");
        }
      }
    });
  },false);
}


/**
 * 列表添加点击事件
 */
$message.jumpToChatView = function() {
  cmp("#message_list").on('tap', "li", function(e) {
    var id = this.getAttribute("id");
    var type = this.getAttribute("data-type");
    var toId = this.getAttribute("id");
    var toName = this.getAttribute("data-toName");
    var gn = this.getAttribute("data-gn");// 群名称
    var block = this.getAttribute("data-block");
    var param = {
      "msgId":id,
      "toId":toId,
      "toName" : toName,
      "block" : block
    };

    // 更新数据库中的未读状态
    uc.db.updateUnreader(toId,function(res){
      if(gn == "true"){
        param.chatType = "groupchat";
        param.path = "/html/ucGroupChatView.html";
      }else{
        param.chatType = "chat";
        param.path = "/html/ucAloneChatView.html";
      }
       toChat(param);
    });
   
  });
};
// 跳转到聊天窗口
function toChat(params){
  cmp.href.next(ucPath + params.path, params,{
    animated : true,
    direction : "left"
  });
}

/**
 * 返回方法
 */
$message.prevPage = function() {
  cmp("header").on('tap', "#prev", function(e) {
      cmp.href.closePage();
  });
  cmp.backbutton();
  cmp.backbutton.push(function(){
      cmp.href.closePage();
  });
}
// 监听其他端推送过来的置顶消息
$message.listenTopToOther = function(){
  var toId = "";
  var stickTime = "";
  listSideslipApi.topFun.topToOther(cmp.member.id, toId, toId.split("@")[0], stickTime,function(data){
    // console.log(data)
  },function(data){
    if(data.code == "36005"){
//        cmp.notification.alert(data.message,function(){
//            cmp.href.closePage();
//        },"","确定");
    	console.error(data.message);
    }
  });
}
// 监听其他端推送过来的取消置顶消息
$message.listenCancelTopToOther = function(){
  var toId = "";
  var stickTime = "";
  listSideslipApi.topFun.cancelTopToOther(cmp.member.id, toId, toId.split("@")[0], stickTime,function(data){
    // console.log(data)
  },function(data){
    if(data.code == "36005"){
//        cmp.notification.alert(data.message,function(){
//            cmp.href.closePage();
//        },"","确定");
    	console.error(data.message);
    }
  });
}
// 点击头部加号，打开加号页面
$message.openAddIcon = function(){
  cmp("header").on('tap', "#add", function(e) {
    _$(".cmp-bar").className = "cmp-bar cmp-bar-nav cmp-flex-header blur";
    _$("#all_uc").className = "cmp-scroll-wrapper blur";
    _$(".uc-add").style.display = "block";
  });
}
// 点击加号页面的叉子，关闭加号页面
$message.closeAddIcon = function(){
  cmp(".uc-add").on('tap', ".uc-close", function(e) {
    _$(".cmp-bar").className = "cmp-bar cmp-bar-nav cmp-flex-header";
    _$("#all_uc").className = "cmp-scroll-wrapper";
    _$(".uc-add").style.display = "none";
  });
}
// 显示日期
// $message.calendar = function() {
//   var date = new Date;
//   var year = date.getFullYear();
//   var month = date.getMonth() + 1;
//   var week = date.getDay();
//   var day = date.getDate();
//   var str = "星期";
//   switch (week) {
//     case 0 :
//         str += "日";
//         break;
//     case 1 :
//         str += "一";
//         break;
//     case 2 :
//         str += "二";
//         break;
//     case 3 :
//         str += "三";
//         break;
//     case 4 :
//         str += "四";
//         break;
//     case 5 :
//         str += "五";
//         break;
//     case 6 :
//         str += "六";
//         break;
//   }

//   _$("#year").innerHTML = year;
//   _$("#month").innerHTML = month;
//   _$("#week").innerHTML = str;
//   _$("#day").innerHTML = day;
// }
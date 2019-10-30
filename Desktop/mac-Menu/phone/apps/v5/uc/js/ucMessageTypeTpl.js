/*
  分为7种消息类型：文本、语音、图片、名片、文档、新闻、关联文档
  接收的data参数里面有5个对象，分别为：
  memberId: 当前用户的id，用当前用户id和接收数据data里面的消息from(分为sendid和receiveid)判断，
            相同的话即自己发送消息，不同是其他人发送消息。
  chatType: 指单人聊天还是群组聊天
  msgType: 指消息类型，例如文本消息、语音消息、图片消息等
  from: 指当时发送消息的人员id
  body: 接收消息内容
  chatId: 指本条消息的id
  name:当前消息的人员名称
  var data = {
        memberId:chat.userId,
        from:chat.userId,
        chatType:"chat",
        msgType:"text"
        body:val,
        chatId:chatid,
        time:"20:03",
        name:"张三"
      }
*/ 
function msgType (data) {
  var li = "";
  if(data.memberId == data.from){
    li = "<li class=\"cmp-table-view-cell\" id=\"" + data.chatId + "\" timestamp='" + data.timestamp + "' isown=\"true\">";
  }
  else{
    li = "<li class=\"cmp-table-view-cell\" id=\"" + data.chatId + "\" timestamp='" + data.timestamp + "' isown=\"false\">";
  }
  // 时间戳
  if(data.msgType == "time"){
    li += "<div class=\"uc-chat-date\">" + data.body + "</div></li>";
    return li;
  }
  //系统消息
  if(data.msgType == "system"){
    li += "<div class=\"uc-chat-system\">" + data.body + "</div></li>";
    return li;
	}
  // 文本
  else if(data.msgType == "text") {
    if(data.memberId == data.from){
      li += "<div class=\"uc-me-text\"><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-me-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow1\"></i>"
              +"<div class=\"uc-me-chat-base\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<span class=\"uc-chat-text\">" + data.body + "</span>";
                if(data.chatType == "chat"){
                  li += "<span class=\"uc-chat-read-state " + data.readStateClass + "\">" + data.readState + "</span>"
                }
                li += "<textarea class=\"uc-copy-text\" id=\"text_" + data.chatId + "\">" + data.body + "</textarea>"
              +"</div></div></div>"
          +"<div class=\"uc-m-h\"><img src=\"" + cmp.member.iconUrl + "\" class=\"uc-me-chat-head\" /></div>"
        +"</div>";
    }else{
      li += "<div class=\"uc-other-text\"><div class=\"uc-o-h\"><img src=\"" + data.headSrc + "\" class=\"uc-other-chat-head\" id=\"h_" + data.toId + "\" /></div><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-o-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow2\"></i>"
              +"<div class=\"uc-other-chat-base\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<span class=\"uc-chat-text\">" + data.body + "</span>"
                +"<textarea class=\"uc-copy-text\" id=\"text_" + data.chatId + "\">" + data.body + "</textarea>"
              +"</div>"
            +"<div>"
          +"</div>"
        +"</div>";
    }
    li += "</li>";
    return li;
  }
  // 语音
  else if(data.msgType == "voice"){
    if(data.memberId === data.from){
      li += "<div class=\"uc-me-voice\"><div class=\"uc-chat-base\" style=\"display:none;\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-me-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow1\"></i>"
              +"<div data-tmp=\"" + data.isNative + "\" class=\"voice uc-me-chat-base\" id=\"" + data.body.id + "\" src=\"" + data.body.src + "\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\" data-to=\"" + data.toJid + "\">"
                + "<span class=\"vtime\">" + data.body.times + "</span>''<img class=\"uc-record\" src=\"../img/voice/me-voice3@2x.png\" alt=\"\" />";
                if(data.chatType == "chat"){
                  li += "<span class=\"uc-chat-read-state " + data.readStateClass + "\">" + data.readState + "</span>"
                }
              li += "</div></div></div>"
          +"<div class=\"uc-m-h\"><img src=\"" + cmp.member.iconUrl + "\" class=\"uc-me-chat-head\" /></div>"
        +"</div>";
    }else{
      li += "<div class=\"uc-other-voice\"><div class=\"uc-o-h\"><img src=\"" + data.headSrc + "\" class=\"uc-other-chat-head\" id=\"h_" + data.toId + "\" /></div><div class=\"uc-chat-base\" style=\"display:none;\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-o-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
                +"<i class=\"uc-bubble-arrow uc-arrow2\"></i>"
                +"<div data-tmp=\"" + data.isNative + "\" class=\"voice uc-other-chat-base\" id=\"" + data.body.id + "\" src=\"" + data.body.src + "\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\" data-to=\"" + data.toJid + "\">"
                  +"<img class=\"uc-record\" src=\"../img/voice/o-voice3@2x.png\" alt=\"\" /><span class=\"vtime\">" + data.body.times + "</span>''"
                  +"<span class=\"" + (data.isRead == 'read' ? 'uc-chat-unread-dot-over' : 'uc-chat-unread-dot' ) + "\"></span>"
                +"</div>"
              +"</div>"
            +"</div>"
          +"</div>";
    }
    li += "</li>";
    return li;
  }
  // 图片
  else if(data.msgType == "image"){
    if(data.memberId === data.from){
      li += "<div class=\"uc-me-picture\"><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-me-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow1\"></i>"
              +"<div class=\"uc-me-chat-base\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<div class=\"uc-me-p-overflow\">"
                      +"<img src='" + data.imgUrl + "'  imgId = '" + data.mId + "' imgTitle = '" + data.mTitle + "' imgLoad=\"true\" class=\"uc-chat-img\" />"
                  +"<div class=\"imgMask\"></div>"
                +"</div>";
                if(data.chatType == "chat"){
                  li += "<span class=\"uc-chat-read-state " + data.readStateClass + "\">" + data.readState + "</span>"
                }
              li += "</div></div></div>"
          +"<div class=\"uc-m-h\"><img src=\""+ cmp.member.iconUrl +"\" class=\"uc-me-chat-head\" /></div>"
        +"</div>";
    }else{
      li += "<div class=\"uc-other-picture\"><div class=\"uc-o-h\"><img src=\"" + data.headSrc + "\" class=\"uc-other-chat-head\" id=\"h_" + data.toId + "\" /></div><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-o-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow2\"></i>"
              +"<div class=\"uc-other-chat-base\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                    +"<img src='" + data.imgUrl + "'  imgId = '" + data.mId + "' imgTitle = '" + data.mTitle + "' imgLoad=\"true\" class=\"uc-chat-img\" />"
                +"<div class=\"imgMask\"></div>"
              +"</div>"
            +"</div>"
          +"</div>"
        +"</div>";
    }
    li += "</li>";
    return li;
  }
  // 名片
  else if(data.msgType === "card"){
    if(data.memberId === data.from){
      li += "<div class=\"uc-me-card\" data-type=\"card\"><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-me-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow1\"></i>"
              +"<div class=\"uc-me-chat-base uc-card\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<div class=\"uc-info\">"
                  +"<img src=\"../img/head.png\" class=\"uc-card-head cmp-pull-left\" />"
                  +"<div class=\"cmp-pull-left uc-card-width\">"
                    +"<h3 class=\"uc-card-name\">王淅王淅王淅王淅王淅</h3>"
                    +"<span class=\"uc-card-phone\">13123948931312394893</span>"
                  +"</div>"
                +"</div>"
                +"<p class=\"uc-card-b\">本地名片</p>";
                if(data.chatType == "chat"){
                  li += "<span class=\"uc-chat-read-state " + data.readStateClass + "\">" + data.readState + "</span>"
                }
              li += "</div></div></div>"
          +"<div class=\"uc-m-h\"><img src=\"" + cmp.member.iconUrl + "\" class=\"uc-me-chat-head\" /></div>"
        +"</div>";
    }else{
      li += "<div class=\"uc-other-card\" data-type=\"card\"><div class=\"uc-o-h\"><img src=\"" + data.headSrc + "\" class=\"uc-other-chat-head\" id=\"h_" + data.toId + "\" /></div><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-o-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow3\"></i>"
              +"<div class=\"uc-other-chat-base\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<div class=\"uc-info\">"
                  +"<img src=\"\" class=\"uc-card-head\" />"
                  +"<div class=\"uc-card-width\">"
                    +"<h3 class=\"uc-card-name\">王淅王淅王淅王淅王淅</h3>"
                    +"<span class=\"uc-card-phone\">13123948931312394893</span>"
                  +"</div>"
                +"</div>"
                +"<p class=\"uc-card-b\">本地名片</p>"
              +"</div>"
            +"</div>"
          +"</div>"
        +"</div>";
    }
    li += "</li>";
    return li;
  }
  // 离线文档
  else if(data.msgType === "filetrans"){
    if(data.memberId === data.from){
      li += "<div class=\"uc-me-doc\"><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-me-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow1\"></i>"
              +"<div class=\"uc-me-chat-base uc-doc\" data-type=\"" + data.msgType + "\" data-fid=\"" + data.fid + "\" data-path=\"" + data.path + "\" data-from=\"" + data.from + "\" data-size=\"" + data.fileSize + "\">"
                +"<div class=\"cmp-icon-document " + data.icon + "\"></div>"
                +"<div class=\"uc-doc-info\">"
                  +"<h3 class=\"uc-doc-name\">"+ data.fname +"</h3>"
                  +"<div class=\"uc-doc-state\">"
                    +"<div class=\"uc-doc-size cmp-pull-left\">"+ data.size +"</div>"
                    +"<div class=\"uc-doc-s cmp-pull-right\"></div>"
                  +"</div>"
                +"</div>";
                if(data.chatType == "chat"){
                  li += "<span class=\"uc-chat-read-state " + data.readStateClass + "\">" + data.readState + "</span>"
                }
              li += "</div></div></div>"
          +"<div class=\"uc-m-h\"><img src=\"" + cmp.member.iconUrl + "\" class=\"uc-me-chat-head\" /></div>"
        +"</div>";
    }else{
      li += "<div class=\"uc-other-doc\"><div class=\"uc-o-h\"><img src=\"" + data.headSrc + "\" class=\"uc-other-chat-head\" id=\"h_" + data.toId + "\" /></div><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-o-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow3\"></i>"
              +"<div class=\"uc-other-chat-base uc-doc\" data-type=\"" + data.msgType + "\" data-fid=\"" + data.fid + "\" data-path=\"" + data.path + "\" data-from=\"" + data.from + "\" data-size=\"" + data.fileSize + "\">"
                +"<div class=\"cmp-icon-document " + data.icon + "\"></div>"
                +"<div class=\"uc-doc-info\">"
                  +"<h3 class=\"uc-doc-name\">"+ data.fname +"</h3>"
                  +"<div class=\"uc-doc-state\">"
                    +"<div class=\"uc-doc-size cmp-pull-left\">"+ data.size +"</div>"
                    +"<div class=\"uc-doc-s cmp-pull-right\"></div>"
                  +"</div>"
                +"</div>"
              +"</div>"
            +"</div>"
          +"</div>"
        +"</div>";
    }
    li += "</li>";
    return li;
  }
  // 新闻
  else if(data.msgType === "new"){
    if(data.memberId === data.from){
      li += "<div class=\"uc-me-new\" data-type=\"new\"><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-me-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow1\"></i>"
              +"<div class=\"uc-me-chat-base uc-new\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<h3 class=\"uc-new-name\">看电视就付款角度看附件的空间法的空间</h3>"
                +"<div class=\"uc-new-info\">"
                  +"<div class=\"cmp-pull-left\">上海区市场部</div>"
                  +"<div class=\"cmp-pull-right\" style=\"margin-top:5px\">"
                    +"<img class=\"uc-new-img\" src=\"../img/img4.jpg\" />"
                  +"</div>"
                +"</div>";
                if(data.chatType == "chat"){
                  li += "<span class=\"uc-chat-read-state " + data.readStateClass + "\">" + data.readState + "</span>"
                }
              li += "</div></div></div>"
          +"<div class=\"uc-m-h\"><img src=\"" + cmp.member.iconUrl + "\" class=\"uc-me-chat-head\" /></div>"
        +"</div>";
    }else{
      li += "<div class=\"uc-other-new\" data-type=\"new\"><div class=\"uc-o-h\"><img src=\"" + data.headSrc + "\" class=\"uc-other-chat-head\" id=\"h_" + data.toId + "\" /></div><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-o-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow3\"></i>"
              +"<div class=\"uc-other-chat-base uc-new\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<h3 class=\"uc-new-name\">看电视就付款角度看附件的空间法的空间法肯定积分看角度看附件看见</h3>"
                +"<div class=\"uc-new-info\">"
                  +"<div class=\"cmp-pull-left\">上海区市场部</div>"
                  +"<div class=\"cmp-pull-right\" style=\"margin-top:5px\">"
                    +"<img class=\"uc-new-img\" src=\"../img/img4.jpg\" />"
                  +"</div>"
                +"</div>"
              +"</div>"
            +"</div>"
          +"</div>"
        +"</div>";
    }
    li += "</li>";
    return li;
  }
  // 关联文档
  else if(data.msgType === "a8"){
    if(data.memberId === data.from){
      li += "<div class=\"uc-me-a8\" data-type=\"a8\"><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-me-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow1\"></i>"
              +"<div class=\"uc-me-chat-base uc-a8\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<div class=\"uc-a8-info\">"
                  +"<div class=\"uc-doc-icon iconfont icon-PC-teamwork cmp-pull-left\"></div>"
                  +"<h3 class=\"cmp-pull-left uc-a8-name\">看电视就付款角度看附件的空间法的空间</h3>"
                +"</div>"
                +"<div class=\"uc-a8-n\">[协同]上海区市场部</div>";
                if(data.chatType == "chat"){
                  li += "<span class=\"uc-chat-read-state " + data.readStateClass + "\">" + data.readState + "</span>"
                }
              li += "</div></div></div>"
          +"<div class=\"uc-m-h\"><img src=\"" + cmp.member.iconUrl + "\" class=\"uc-me-chat-head\" /></div>"
        +"</div>";
    }else{
      li += "<div class=\"uc-other-a8\" data-type=\"a8\"><div class=\"uc-o-h\"><img src=\"" + data.headSrc + "\" class=\"uc-other-chat-head\" id=\"h_" + data.toId + "\" /></div><div class=\"uc-chat-base\">";
      if(data.chatType == "groupchat"){
        li += "<div class=\"uc-o-username\">" + data.name + "</div>";
      }
      li += "<div class=\"position_relative\">"
              +"<i class=\"uc-bubble-arrow uc-arrow3\"></i>"
              +"<div class=\"uc-other-chat-base uc-a8\" data-type=\"" + data.msgType + "\" data-from=\"" + data.from + "\">"
                +"<div class=\"uc-a8-info\">"
                  +"<div class=\"uc-doc-icon iconfont icon-PC-teamwork cmp-pull-left\"></div>"
                  +"<h3 class=\"uc-a8-name\">看电视就付款角度看附件的空间法的空间</h3>"
                +"</div>"
                +"<div class=\"uc-a8-n\">[协同]上海区市场部</div>"
              +"</div>"
            +"</div>"
          +"</div>"
        +"</div>";
    }
    li += "</li>";
    return li;
  }
}
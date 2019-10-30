/**
 *  聊天
 *  @param option  参数集
 *  id  消息id
 *  toId 指向id
 *  toName 指向id的姓名
 *  chatType 聊天类型 单人 群
 *  content 内容
 *  errorFunc 失败的回调方法
 *  single dog single dog single all thd day~
 *  <message from="2481121618130258326@localhost/mobile" to="2753297105921130843@localhost" type="chat">
 *       <name>hd1</name>
 *       <body>Ddgf</body>
 *       <toname>hd2</toname>
 *  </message>
 */
function chatForSingleDog(option) {
    var aMessage = newJSJaCMessage();
    var jid = uc.userInfo.getId();
    if(jid==null){
    		console.error("jid不能为空");
    		return ;
    }
    aMessage.setFrom(jid + "@localhost/mobile");
    aMessage.setID(option.id);
    if(option.chatType == 'chat'){
        aMessage.setTo(option.toId + "@localhost");
        aMessage.setType("chat");
    }else if(option.chatType == 'groupchat'){
        aMessage.setTo(option.toId + "@group.localhost");
        aMessage.setType("groupchat");
        if(option.atList){
            var atList = aMessage.buildNode("atList");
            for(var i = 0;i<option.atList.length;i++){
                atList.appendChild(aMessage.buildNode('at', option.atList[i]));
            }
        }

    }
    aMessage.setBody(option.content);
    aMessage.setName(cmp.member.name);
    aMessage.appendNode(aMessage.buildNode('toname', option.toName));
    if(option.atList.length > 0){
        aMessage.appendNode(atList);
    }
    sendMsg(option.id,aMessage.xml(),null,option.errorFunc);
}

/**
 *  系统消息
 *  @param option  参数集
 *  id  消息id
 *  toId 指向id
 *  toName 指向id的姓名
 *  chatType 聊天类型 单人 群
 *  content 内容
 *  errorFunc 失败的回调方法
 *  single dog single dog single all thd day~
 *  <message from="2481121618130258326@localhost/mobile" to="2753297105921130843@localhost" type="chat">
 *       <name>hd1</name>
 *       <body>Ddgf</body>
 *       <toname>hd2</toname>
 *  </message>
 */
function chatForSysMessage(option) {
    var aMessage = newJSJaCMessage();
    var jid = cmp.member.id;
    aMessage.setFrom(jid + "@localhost/mobile");
    aMessage.setID(option.id);
    if(option.chatType == 'chat'){
        aMessage.setTo(option.toId + "@localhost");
        aMessage.setType("system");
    }else if(option.chatType == 'groupchat'){
        aMessage.setTo(option.toId + "@group.localhost");
        aMessage.setType("system");
        if(option.atList){
            var atList = aMessage.buildNode("atList");
            for(var i = 0;i<option.atList.length;i++){
                atList.appendChild(aMessage.buildNode('at', option.atList[i]));
            }
        }

    }
    aMessage.setBody(option.content);
    aMessage.setName(cmp.member.name);
    aMessage.appendNode(aMessage.buildNode('toname', option.toName));
    if(option.atList){
        aMessage.appendNode(atList);
    }
    sendMsg(option.id,aMessage.xml(),null,option.errorFunc);
}

/**
 * 发语音消息
 * @param toId
 * @param toName
 * @param chatType
 * @param fileName
 * @param recordTime
 * @param errorFunc
 * <message from="2481121618130258326@localhost/mobile" to="2753297105921130843@localhost" type="microtalk" id="microtalk_1">
 *   <name>hd1</name>
 *   <toname>hd2</toname>
 *   <microtalk xmlns="microtalk">
 *     <id>2351776293</id>
 *     <size>3</size>
 *   </microtalk>
 * </message>
 */
function chatForVoice(toId,toName,chatType,fileName,recordTime,id,errorFunc){
    var aMessage = newJSJaCMessage();
    var jId = cmp.member.id;

    aMessage.setFrom(jId + "@localhost/mobile");
    aMessage.setID(id);
    if(chatType == 'chat'){
        aMessage.setTo(toId + "@localhost");
    }else if(chatType == 'groupchat'){
        aMessage.setTo(toId + "@group.localhost");
    }
    aMessage.setType("microtalk");
    aMessage.setName(cmp.member.name);
    aMessage.appendNode(aMessage.buildNode('toname', toName));

    var microTalk = aMessage.buildNode('microtalk');
    microTalk.setAttribute("xmlns","microtalk");
    microTalk.appendChild(aMessage.buildNode('id', fileName));
    microTalk.appendChild(aMessage.buildNode('size', recordTime));
    aMessage.appendNode(microTalk);
    sendMsg(jId,aMessage.xml(),null,errorFunc);
}
/**
 * 发图片消息
 * @param toId
 * @param toName
 * @param chatType
 * @param fileId
 * @param fileName
 * @param errorFunc
 * <message from="2481121618130258326@localhost/mobile" to="2753297105921130843@localhost" type="image" id="image_1">
 *     <name>hd1</name>
 *     <toname>hd2</toname>
 *     <image xmlns="image">
 *         <id>3241353559</id>
 *         <id_thumbnail>3241353559_1</id_thumbnail>
 *         <name>2016112414241364.png</name>
 *         <size>60</size>
 *         <hash>4f71215587711e98f5ec9fbd5cb434db</hash>
 *         <date>2016-11-24T14:24:13.659000+08:00</date>
 *         <desc/>
 *     </image>
 * </message>
 */
function chatForImage(toId,toName,chatType,fileId,fileName,id,date,fileSize,errorFunc){
    var aMessage = newJSJaCMessage();
    var jId = cmp.member.id;

    aMessage.setFrom(jId + "@localhost/mobile");
    aMessage.setID(id);
    if(chatType == 'chat'){
        aMessage.setTo(toId + "@localhost");
    }else if(chatType == 'groupchat'){
        aMessage.setTo(toId + "@group.localhost");
    }
    aMessage.setType("image");
    aMessage.setName(cmp.member.name);
    aMessage.appendNode(aMessage.buildNode('toname', toName));

    var image = aMessage.buildNode('image');
    image.setAttribute("xmlns","image");
    image.appendChild(aMessage.buildNode('id', fileId));
    image.appendChild(aMessage.buildNode('id_thumbnail', fileId + "_1"));
    image.appendChild(aMessage.buildNode('name', fileName));
    image.appendChild(aMessage.buildNode('size',fileSize));
    image.appendChild(aMessage.buildNode('desc'));
    image.appendChild(aMessage.buildNode('date', date));
    aMessage.appendNode(image);
    sendMsg(jId,aMessage.xml(),null,errorFunc);
}
/**
 * 发附件消息
 * @param toId
 * @param toName
 * @param chatType
 * @param fileId
 * @param fileName
 * @param errorFunc
 * <message from="2481121618130258326@localhost/mobile" to="2753297105921130843@localhost" type="filetrans" id="filetrans_1">
 *    <name>hd1</name>
 *    <toname>hd2</toname>
 *    <filetrans xmlns="filetrans">
 *      <id>3823263968</id>
 *      <name>表单.txt</name>
 *      <size>1</size>
 *      <hash/>
 *      <date>2016-11-24T14:51:35.081000+08:00</date>
 *      <desc/>
 *    </filetrans>
 *  </message>
 */
function chatForFile(toId,toName,chatType,fileId,fileName,fileSize,id,errorFunc){
    var aMessage = newJSJaCMessage();
    var jId = cmp.member.id;

    aMessage.setFrom(jId + "@localhost/mobile");
    aMessage.setID(id);
    if(chatType == 'chat'){
        aMessage.setTo(toId + "@localhost");
    }else if(chatType == 'groupchat'){
        aMessage.setTo(toId + "@group.localhost");
    }
    aMessage.setType("filetrans");
    aMessage.setName(cmp.member.name);
    aMessage.appendNode(aMessage.buildNode('toname', toName));

    var file = aMessage.buildNode('filetrans');
    file.setAttribute("xmlns","filetrans");
    file.appendChild(aMessage.buildNode('id', fileId));
    file.appendChild(aMessage.buildNode('name', fileName));
    file.appendChild(aMessage.buildNode('size',fileSize));
    file.appendChild(aMessage.buildNode('desc'));
    aMessage.appendNode(file);
    sendMsg(jId,aMessage.xml(),null,errorFunc);
}
/**
 * 撤消消息
 * @param id
 * @param msgId
 * @param jId
 * @param name
 * @param toId
 * @param toName
 * @param successFunc
 * @param errorFunc
 * <message type='cancel_chat' id=’123456’ from=”1234@localhost” to=”1234@localhost”>
 *     <to>111@localhost</to>  //真实接收者
 * 	   <msgid></msgid> //被撤回的消息id
 * 	   <name></name>
 * 	   <toname></toname>
 * </message>
 */
function cancelChat(id,msgId,toId,toName,successFunc,errorFunc){
    var aMessage = newJSJaCMessage();
    var jId = cmp.member.id;

    aMessage.setFrom(jId + "@localhost/mobile");
    aMessage.setID(id);
    aMessage.setTo(jId + "@localhost");
    aMessage.setType("cancel_chat");
    aMessage.setName(cmp.member.name);
    aMessage.appendNode(aMessage.buildNode('msgid', msgId));
    aMessage.appendNode(aMessage.buildNode('to', toId + "@localhost"));
    aMessage.appendNode(aMessage.buildNode('toname', toName));

    sendMsg(id,aMessage.xml(),successFunc,errorFunc);
}



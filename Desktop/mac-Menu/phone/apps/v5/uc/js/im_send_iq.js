//发送消息，无返回
/**
 * 发送消息的方法
 * @param id
 * @param xml
 * @param successFunc 成功回调
 * @param errorFunc 失败回调
 */
function sendMsg(id, xml, successFunc, errorFunc) {
    console.log("请求发送");
    cmp.chat.sendMessage({
        id: id,
        data: xml,
        success: function () {
            if (successFunc) {
                successFunc();
            }
            console.log("success");
        },
        error: function (e) {
            if (errorFunc) {
                errorFunc(e);
            }
            console.log(e);
        }
    });
    if(cmp.webviewListener){
   	 	cmp.webViewListener.fire({ type: "com.seeyon.m3.uc.didReciveLatestMess", data: data });
    }
}
//发送IQ，有返回
function sendIQ(id, xml, successFunction, errorFunction) {
//    console.log("请求发送");
    cmp.chat.sendMessage({
        id: id,
        data: xml,
        success: function (data) {
//            console.log("请求结果：" + data);
            if (successFunction) {
                successFunction(data);
            }
        },
        error: function (e) {
            console.log(e);
            if (errorFunction) {
                errorFunction(e);
            }
        }
    });
}

/**
 * 获取最新聊天消息
 * @param jid 当前人员ID
 * @param endTime 首次为空；加载更多时，按时间由近及远排序，最后一条的消息时间
 * @param successFunction 回调
 */
function getRecentChatRecord(jid, endTime, successFunction,errorFunc) {
    console.log("获取最新聊天消息");
    var iq = new JSJaCIQ();
    iq.setIQ(jid + "@localhost", 'get', 'recently:msg:query');
    iq.setFrom(jid + "@localhost/mobile");
    var query = iq.setQuery('recently:msg:query');
    query.appendChild(iq.buildNode('begin_time'));
    query.appendChild(iq.buildNode('type', ""));
    query.appendChild(iq.buildNode('end_time'), endTime == null ? '' : endTime);
    query.appendChild(iq.buildNode('count', '', '20'));
    console.log("获取最新聊天消息:" + iq.xml());

    sendIQ('recently:msg:query', iq.xml(), successFunction,errorFunc);
}

/**
 * 获取最新聊天消息
 * @param jid 当前人员ID
 * @param endTime 首次为空；加载更多时，按时间由近及远排序，最后一条的消息时间
 * @param successFunction 回调
 */
function getRecentChatRecord_ext(jid, endTime,count, successFunction,errorFunc) {
    console.log("获取最新聊天消息");
    var iq = new JSJaCIQ();
    iq.setIQ(jid + "@localhost", 'get', 'recently:msg:query');
    iq.setFrom(jid + "@localhost/mobile");
    var query = iq.setQuery('recently:msg:query');
    query.appendChild(iq.buildNode('begin_time'));
    query.appendChild(iq.buildNode('type', ""));
    query.appendChild(iq.buildNode('end_time'), endTime == null ? '' : endTime);
    query.appendChild(iq.buildNode('count', '', count));
    console.log("获取最新聊天消息:" + iq.xml());

    sendIQ('recently:msg:query', iq.xml(), successFunction,errorFunc);
}
/**
 * 取聊天页历史记录
 * @param jId
 * @param toId
 * @param type chat/groupchat
 * @param endTime
 * @param successFunction
 * <iq from="2481121618130258326@localhost/mobile" to="2753297105921130843@localhost" id="history_msg" type="get">
 *     <query xmlns="history:msg:query">
 *         <begin_time/>
 *         <end_time/>
 *         <count>20</count>
 *     </query>
 * </iq>
 */
function getRecentChat(jId, toId, type, endTime, successFunction,errorFunc) {
//    console.log("取聊天页历史记录");
    var iq = new JSJaCIQ();
    if(type == 'chat'){
        iq.setIQ(toId + "@localhost", 'get', "history:msg:query");
    }else if(type == 'groupchat'){
        iq.setIQ(toId + "@group.localhost", 'get', "history:msg:query");
    }
    iq.setFrom(jId + "@localhost/mobile");
    var query = iq.setQuery('history:msg:query');
    query.appendChild(iq.buildNode('begin_time'));
    query.appendChild(iq.buildNode('end_time', endTime == null ? '' : endTime));
    query.appendChild(iq.buildNode('count', '', '20'));
//    console.log("获取最新聊天消息:" + iq.xml());

    sendIQ("history:msg:query", iq.xml(), successFunction,errorFunc);
}
/**
 * 客户端向服务器发送更新最后已读消息协议
 * @param jId
 * @param toId
 * @param endTime
 * @param successFunction
 * <iq from="2481121618130258326@localhost/mobile" to="224060217177789@localhost"  id=" 123" type="set">
 *   <query xmlns="seeyon:msg_read:set"></query>
 * </iq>
 */
function sendToServerLastReadMsgTime(jId, toId, type, successFunction,errorFunc){
    var iq = new JSJaCIQ();
    if(type == "chat"){
        iq.setIQ(toId + "@localhost", "set", "seeyon:msg_read:set");
    }else if(type == "groupchat"){
        iq.setIQ(toId + "@group.localhost", "set", "seeyon:msg_read:set");
    }
    iq.setFrom(jId + "@localhost/mobile");
    var query = iq.setQuery("seeyon:msg_read:set");
    console.log(iq.xml());
    sendIQ("seeyon:msg_read:set", iq.xml(), successFunction,errorFunc);
}
/**
 * 客户端向服务器请求最后的已读时间协议
 * @param jId
 * @param toId
 * @param endTime
 * @param successFunction
 * <iq from="2481121618130258326@localhost/mobile" to="224060217177789@localhost" id="321 "type="get">
 *   <query xmlns="seeyon:msg_read:get"></query>
 * </iq>
 */
 function requestLastReadMsgTime(jId, toId, type, successFunction,errorFunc){
    var iq = new JSJaCIQ();
    if(type == "chat"){
        iq.setIQ(toId + "@localhost", "get", "seeyon:msg_read:get");
    }else if(type == "groupchat"){
        iq.setIQ(toId + "@group.localhost", "get", "seeyon:msg_read:get");
    }
    iq.setFrom(jId + "@localhost/mobile");
    var query = iq.setQuery("seeyon:msg_read:get");
    console.log(iq.xml());
    sendIQ("seeyon:msg_read:get", iq.xml(), successFunction,errorFunc);
 }

//群相关IQ接口
var ucGroupApi = {
    /**
     * 新建群组
     * @param jId 当前人员ID
     * @param groupName 群组名
     * @param groupType 暂不用，只有4
     * @param memberIdList 人员列表
     * @param successFunc 成功回调
     * <iq from="2481121618130258326@localhost/mobile" to="group.localhost" id="group1" type="get">
     *     <query xmlns="seeyon:group:create">
     *         <group_info>
     *             <group_name>12345</group_name>
     *             <group_type>4</group_type>
     *             <group_member_num>3</group_member_num>
     *             <group_members>
     *                 <group_member>2481121618130258326@localhost</group_member>
     *                 <group_member>-4391750254679538565@localhost</group_member>
     *                 <group_member>2753297105921130843@localhost</group_member>
     *             </group_members>
     *         </group_info>
     *     </query>
     * </iq>
     */
    createGroup: function (jId, groupName, groupType, memberIdList, successFunc,errorFunc) {
        console.log("新建群组" + groupName);
        var iq = new JSJaCIQ();
        iq.setIQ("group.localhost", 'get', "seeyon:group:create");
        iq.setFrom(jId + "@localhost/mobile");

        var query = iq.setQuery('seeyon:group:create');

        var group_members = iq.buildNode("group_members");
        for (var i = 0; i < memberIdList.length; i++) {
            group_members.appendChild(iq.buildNode('group_member', memberIdList[i] + "@localhost"));
        }
        var group_info = iq.buildNode("group_info");
        group_info.appendChild(iq.buildNode('group_name', groupName));
        group_info.appendChild(iq.buildNode('group_type', 4));
        group_info.appendChild(iq.buildNode('group_member_num', memberIdList.length));
        group_info.appendChild(group_members);

        query.appendChild(group_info);
        console.log("新建群组信息:" + iq.xml());

        sendIQ("seeyon:group:create", iq.xml(), successFunc,errorFunc);
    },

    /**
     * 群增加人员
     * @param jId
     * @param groupId
     * @param groupName
     * @param memberIdList
     * @param successFunc 成功回调
     * <iq from="2481121618130258326@localhost/mobile" to="2240602171@group.localhost" id="seeyon:group:add" type="set">
     *     <query xmlns="seeyon:group:add">
     *         <group_members>
     *             <group_member>-4391750254679538565@localhost</group_member>
     *         </group_members>
     *     </query>
     * </iq>
     */
    addMember: function (jId, groupId, groupName, memberIdList, successFunc,errorFunc) {
        console.log("群" + groupName + "增加人员");
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'set', "seeyon:group:add");
        iq.setFrom(jId + "@localhost/mobile");

        var query = iq.setQuery('seeyon:group:add');

        var group_members = iq.buildNode("group_members");
        for (var i = 0; i < memberIdList.length; i++) {
            group_members.appendChild(iq.buildNode('group_member', memberIdList[i] + "@localhost"));
        }
        query.appendChild(group_members);
        console.log("群组加人员信息:" + iq.xml());

        sendIQ("seeyon:group:add", iq.xml(), successFunc,errorFunc);

    },

    /**
     * 群删除人员
     * @param jId
     * @param groupId
     * @param groupName
     * @param memberIdList
     * @param successFunc 成功回调
     *<iq from="2481121618130258326@localhost/mobile" to="2240602171@group.localhost" id="seeyon:group:remove" type="set">
     *    <query xmlns="seeyon:group:remove">
     *        <group_members>
     *            <group_member>-4391750254679538565@localhost</group_member>
     *        </group_members>
     *    </query>
     *</iq>
     */
    delMember: function (jId, groupId, groupName, memberIdList, successFunc,errorFunc) {
        console.log("群" + groupName + "删除人员");
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'set', "seeyon:group:remove");
        iq.setFrom(jId + "@localhost/mobile");

        var query = iq.setQuery('seeyon:group:remove');

        var group_members = iq.buildNode("group_members");
        for (var i = 0; i < memberIdList.length; i++) {
            group_members.appendChild(iq.buildNode('group_member', memberIdList[i] + "@localhost"));
        }
        query.appendChild(group_members);
        console.log("群组删除人员信息:" + iq.xml());

        sendIQ("seeyon:group:remove", iq.xml(), successFunc,errorFunc);
    },

    /**
     * 解散群
     * @param jId
     * @param groupId
     * @param groupName
     * @param successFunc 成功回调
     * <iq from="2481121618130258326@localhost" to="3332524431@group.localhost" id="seeyon:group:destroy" type="set">
     *     <query xmlns="seeyon:group:destroy"></query>
     * </iq>
     */
    delGroup : function (jId, groupId, groupName, successFunc,errorFunc) {
        console.log("群" + groupName + "解散");
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'set', "seeyon:group:destroy");
        iq.setFrom(jId + "@localhost/mobile");
        iq.setQuery('seeyon:group:destroy');
        console.log("群组解散信息:" + iq.xml());

        sendIQ("seeyon:group:destroy", iq.xml(), successFunc,errorFunc);
    },

    /**
     * 退出群
     * @param jId
     * @param groupId
     * @param groupName
     * @param successFunc 成功回调
     * <iq from="2481121618130258326@localhost" to="3332524431@group.localhost" id="seeyon:group:destroy" type="set">
     *     <query xmlns="seeyon:group:destroy"></query>
     * </iq>
     */
    exitGroup : function (jId, groupId, groupName, successFunc,errorFunc) {
        console.log("退出群" + groupName);
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'set', "seeyon:group:exit");
        iq.setFrom(jId + "@localhost/mobile");
        iq.setQuery('seeyon:group:exit');
        console.log("退出群信息:" + iq.xml());

        sendIQ("seeyon:group:exit", iq.xml(), successFunc,errorFunc);
    },

    /**
     * 重命名群组
     * @param jId
     * @param groupId
     * @param groupName
     * @param newGroupName
     * @param successFunc
     */
    renameGroup : function (jId, groupId, groupName, newGroupName, successFunc,errorFunc) {
        console.log("重命名群组" + groupName  + "为" + newGroupName);
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'set', "seeyon:group:rename");
        iq.setFrom(jId + "@localhost/mobile");

        var query = iq.setQuery('seeyon:group:rename');


        var group_info = iq.buildNode("group_info");
        group_info.appendChild(iq.buildNode('group_name', newGroupName));

        query.appendChild(group_info);
        console.log("重命名群组信息:" + iq.xml());

        sendIQ("seeyon:group:rename", iq.xml(), successFunc,errorFunc);
    },

    /**
     * 群组详情
     * @param jId
     * @param groupId
     * @param groupName
     * @param successFunc
     * <iq from="2753297105921130843@localhost/mobile" to="2699966664@group.localhost" id="seeyon:group:query:info" type="get">
     *     <query xmlns="seeyon:group:query:info"></query>
     * </iq>
     */
    groupInfo : function (jId, groupId, groupName, successFunc,errorFunc) {
        console.log("群组:" + groupName  + "详情查询");
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'get', "seeyon:group:query:info");
        iq.setFrom(jId + "@localhost/mobile");
        iq.setQuery('seeyon:group:query:info');
        console.log("查询群组信息:" + iq.xml());

        sendIQ("seeyon:group:query:info", iq.xml(), successFunc,errorFunc);
    },
    /**
     * 群组列表
     * @param jId
     * @param successFunc
     * <iq from="2753297105921130843@localhost/mobile" to="group.localhost" id="seeyon:group:query:info" type="get">
     *     <query xmlns="seeyon:group:query:info"></query>
     * </iq>
     */
    groupList : function (jId, successFunc,errorFunc) {
        console.log("群组列表查询");
        var iq = new JSJaCIQ();
        iq.setIQ("group.localhost", 'get', "seeyon:group:query:info");
        iq.setFrom(jId + "@localhost/mobile");
        iq.setQuery('seeyon:group:query:info');
        console.log("查询群组列表信息:" + iq.xml());

        sendIQ("seeyon:group:query:info", iq.xml(), successFunc,errorFunc);
    },

    /**
     * 群人员详情
     * @param jId
     * @param groupId
     * @param groupName
     * @param successFunc
     * <iq from="2753297105921130843@localhost/mobile" to="2699966664@group.localhost" id="seeyon:group:query:member" type="get">
     *     <query xmlns="seeyon:group:query:member"></query>
     * </iq>
     */
    groupMemberList : function (jId, groupId, groupName, successFunc,errorFunc) {
//        console.log("群组:" + groupName  + "成员列表查询");
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'get', "seeyon:group:query:member");
        iq.setFrom(jId + "@localhost/mobile");
        iq.setQuery('seeyon:group:query:member');
//        console.log("群成员信息:" + iq.xml());

        sendIQ("seeyon:group:query:member", iq.xml(), successFunc,errorFunc);
    },
    /**
     * 获取群公告
     * <iq from="group.localhost" to="1740226716329003342@localhost/ucpc" id="47_71603187" type="result">
     *     <query xmlns="seeyon:group:query:info">
     *      <groups total="1" current="1">
     *        <update_time>1487918105</update_time>
     *        <version>1</version>
     *         <group_info I="4228758249@group.localhost" NA="致信" T="4" NI="1740226716329003342@localhost" C="2017-2-22:17-28-15" USE="yes" ISPUBLIC="0" MOOD="致信转有11" P="PF300993440" NO="2222222222222222222" NOI="1687923224" NOT="2017-02-24T14:35:05.000000+08:00"/>
     *       </groups>
     *     </query>
     * </iq>
     * 
     * 
     */
    getGroupNotice : function(){

    },
    /**
     * 编辑群公告
     * <iq type="set" id="1000005" from="1740226716329003342@localhost" to="4228758249@group.localhost">
     *     <query xmlns="seeyon:group:notice">
     *       <notice I="3658191038" V="2222222222222222222"/>
     *     </query>
     *  </iq>
     */
    editGroupNotice : function(jId,groupId,noticeId,content,successFunc,errorFunc){
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'set', "seeyon:group:notice");
        iq.setFrom(jId + "@localhost/mobile");
        var q = iq.setQuery('seeyon:group:notice');
        var notice = iq.buildNode('notice');
        if(noticeId){
            notice.setAttribute("I",noticeId);
        }
        notice.setAttribute("V",content);
        q.appendChild(notice);
        console.log(iq.xml());
        sendIQ("seeyon:group:notice", iq.xml(), successFunc,errorFunc);
    },
    /**
     * 获取群图片
     * <iq from="2481121618130258326@localhost/mobile" to="2240602171@group.localhost" id="xxxxx " type="get">
     *     <query xmlns="seeyon:group:get:pictures"></query>
     * </iq>
     */
    getGroupPic : function(jId,groupId,successFunc,errorFunc){
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'get', "seeyon:group:get:pictures");
        iq.setFrom(jId + "@localhost/mobile");
        iq.setQuery('seeyon:group:get:pictures');
        console.log(iq.xml());
        sendIQ("seeyon:group:get:pictures", iq.xml(), successFunc,errorFunc);
    },
    /**
     * 获取群文件
     * <iq type="get" id="25_608140" from="1740226716329003342@localhost" to="4228758249@group.localhost">
     *    <query xmlns="seeyon:group:file">
     *       <update_time>1488263394</update_time>
     *    </query>
     * </iq>
     */
    getGroupFiles : function(jId,groupId,successFunc,errorFunc){
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'get', "seeyon:group:file");
        iq.setFrom(jId + "@localhost/mobile");
        var q = iq.setQuery('seeyon:group:file');
        q.appendChild(iq.buildNode('update_time', 0));
        console.log(iq.xml());
        sendIQ("seeyon:group:file", iq.xml(), successFunc,errorFunc);
    },
    /**
     * 开启屏蔽群组消息协议
     * <iq from="760214426234537232@localhost" to="3434454group.localhost" type="set" id="JSJaCID_8">
     *   <query xmlns="seeyon:group:block"/>
     * </iq>
     */
    closeGroupMsg : function(jId,groupId,successFunc,errorFunc){
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'set', "seeyon:group:block");
        iq.setFrom(jId + "@localhost/mobile");
        var q = iq.setQuery('seeyon:group:block');
        console.log(iq.xml());
        sendIQ("seeyon:group:block", iq.xml(), successFunc,errorFunc);
    },
    /**
     * 关闭屏蔽群组消息协议
     * <iq from="760214426234537232@localhost" to="3434454group.localhost" type="set" id="JSJaCID_8">
     *   <query xmlns="seeyon:group:unblock"/>
     * </iq>
     */
    resiveGroupMsg : function(jId,groupId,successFunc,errorFunc){
        var iq = new JSJaCIQ();
        iq.setIQ(groupId + "@group.localhost", 'set', "seeyon:group:unblock");
        iq.setFrom(jId + "@localhost/mobile");
        var q = iq.setQuery('seeyon:group:unblock');
        console.log(iq.xml());
        sendIQ("seeyon:group:unblock", iq.xml(), successFunc,errorFunc);
    },
    /**
     * 获取所有屏蔽过消息的群id
     * <iq from="760214426234537232@localhost" to="group.localhost" type="get" id="JSJaCID_8">
     *   <query xmlns="seeyon:get:group:block"/>
     * </iq>
     */
    getCloseGroupIdList : function(jId,successFunc,errorFunc){
        var iq = new JSJaCIQ();
        iq.setIQ(jId + "@localhost", 'get', "seeyon:get:group:block");
        iq.setFrom(jId + "@localhost/mobile");
        var q = iq.setQuery('seeyon:get:group:block');
//        console.log(iq.xml());
        sendIQ("seeyon:get:group:block", iq.xml(), successFunc,errorFunc);
    }
};

//聊天取上传url
var chatFileUploadUrl = {
    /**
     * 取录音文件上传路径
     * @param from
     * @param to
     * @param fileName
     * @param successFunction
     * <iq from="2481121618130258326@localhost/mobile" to="localhost" id="microtalk_1" type="get">
     *     <query xmlns="microtalk" type="get_upload_url" to="2240602171@group.localhost">
     *         <name>2016112417233879.mp3</name>
     *         <date>2016-11-24T17:23:38.794000+08:00</date>
     *     </query>
     * </iq>
     */
    uploadVoice : function (from,to,fileName,successFunction,errorFunc) {
        console.log("取录音文件"+ fileName +"上传路径");
        var iq = new JSJaCIQ();
        iq.setIQ(to + "@localhost", 'get', 'microtalk');
        iq.setFrom(from + "@localhost/mobile");
        var query = iq.setQuery('microtalk');
        query.setAttribute("type","get_upload_url");
        query.appendChild(iq.buildNode('name',fileName));
        query.appendChild(iq.buildNode('date', new Date().toString()));
        console.log("xml:" + iq.xml());

        sendIQ('microtalk', iq.xml(), successFunction,errorFunc);
    },
    /**
     * 取文件上传路径
     * @param from
     * @param to
     * @param fileName
     * @param size
     * @param successFunction
     * <iq xmlns="jabber:client" from="2481121618130258326@localhost/mobile" to="filetrans.localhost" id="filetrans_1" type="get">
     *   <query xmlns="filetrans" type="get_picture_upload_url" to="2753297105921130843@localhost">
     *     <name>2016112414241364.png</name>
     *     <size>60</size>
     *     <hash>4f71215587711e98f5ec9fbd5cb434db</hash>
     *     <date>2016-11-24T14:24:13.659000+08:00</date>
     *     <type>group</type>
     */
    uploadImg : function (from,groupId,fileName,size,type,fileType,successFunction,errorFunc) {
        console.log("取图片文件"+ fileName +"上传路径");
        var ftype = fileType ? "get_upload_url" : "get_picture_upload_url";
        var iq = new JSJaCIQ();
        iq.setIQ("filetrans.localhost", 'get', 'filetrans');
        iq.setFrom(from + "@localhost/mobile");
        var query = iq.setQuery('filetrans');
        query.setAttribute("type",ftype);
        query.appendChild(iq.buildNode('name',fileName));
        query.appendChild(iq.buildNode('size',size));
        query.appendChild(iq.buildNode('date', new Date().toString()));
        if(type == "groupchat"){
            query.appendChild(iq.buildNode('type', "group"));
            query.appendChild(iq.buildNode('to', groupId));
        }
        console.log("xml:" + iq.xml());

        sendIQ('filetrans', iq.xml(), successFunction,errorFunc);
    }
};

var chatFileDownload = {
    /**
     * 取文件下载地址
     * @param jId
     * @param fileId
     * @param isImg
     * @param successFunc
     * @param errorFunc
     * <iq from="2481121618130258326@localhost/mobile" to="filetrans.localhost" id="filetrans_1" type="get">
     *   <query xmlns="filetrans" type="get_download_url">
     *       <id>1031762306</id>
     *   </query>
     * </ip>
     */
    getDownloadUrl : function(jId , fileId, ftype,successFunc,errorFunc){
        switch(ftype){
            case "image":
                var action = "get_picture_download_url";
                var type = "filetrans";
                break;
            case "microtalk":
                var action = "get_download_url";
                var type = "microtalk";
                break;
            case "filetrans":
                var action = "get_download_url";
                var type = "filetrans";
                break;
        }
        console.log("取文件ID:"+ fileId +" 的下载路径");
        var iq = new JSJaCIQ();
        iq.setIQ((ftype == "image" || ftype == "filetrans") ? "filetrans.localhost" : "localhost", 'get', 'filetrans_1');
        iq.setFrom(jId + "@localhost/mobile");
        var query = iq.setQuery(type);
        query.setAttribute("type",action);
        query.appendChild(iq.buildNode('id',fileId));
        console.log("xml:" + iq.xml());

        sendIQ('filetrans_1', iq.xml(), successFunc,errorFunc);
    }
};

// 最近聊天消息列表的侧滑功能(删除、置顶/取消置顶、标为已读)
var listSideslipApi = {
    topFun : {
        /**
         * 客户端向服务器发送消息置顶协议
         * @param jid 本人id 
         * @param toId 
         * @param endTime 置顶的当时时间戳
         * @param successFunction
         * <iq from="2481121618130258326@localhost/mobile" to="224060217177789@localhost" id=" 123" type="set">
         *     <query xmlns="seeyon:recently:msg:stick">
         *         <time>1487062117093</time>
         *     </query>
         * </iq>
         */
        topMsg : function(jid, toId, endTime, successFunction,errorFunc){
            var iq = new JSJaCIQ();
            iq.setIQ(toId + "@localhost", 'set', 'seeyon:recently:msg:stick');
            iq.setFrom(jid + "@localhost/mobile");
            var query = iq.setQuery('seeyon:recently:msg:stick');
            query.appendChild(iq.buildNode('time',endTime));
            console.log("获取置顶xml内容:" + iq.xml());
            sendIQ('seeyon:recently:msg:stick', iq.xml(), successFunction,errorFunc);
        },
        /**
         * 服务器推送给其他客户端结果协议
         * @param jid 本人id 
         * @param stick_id 置顶对方人的id，只要@之前的数字
         * @param toId 
         * @param endTime 置顶的当时时间戳
         * @param successFunction
         * <iq from="2481121618130258326@localhost/mobile" to="224060217177789@localhost" id=" 123" type="result">
         *     <query xmlns="seeyon:recently:msg:stick">
         *         <stick_id>123456</ stick_id >
         *         <time>1487062117093</time>
         *     </query>
         * </iq>
         */
        topToOther : function(jid,toId,stick_id,endTime,successFunction,errorFunc){
            var iq = new JSJaCIQ();
            iq.setIQ(toId + "@localhost", 'result', 'seeyon:recently:msg:stick');
            iq.setFrom(jid + "@localhost/mobile");
            var query = iq.setQuery('seeyon:recently:msg:stick');
            query.appendChild(iq.buildNode('stick_id',stick_id));
            query.appendChild(iq.buildNode('time',endTime));
//            console.log("获取监听其他客户端置顶xml内容:" + iq.xml());
            sendIQ('seeyon:recently:msg:stick', iq.xml(), successFunction,errorFunc);
        },
        /**
         * 客户端向服务器发送取消置顶协议
         * @param jid 本人id 
         * @param toId 
         * @param endTime 置顶的当时时间戳
         * @param successFunction
         * <iq from="2481121618130258326@localhost/mobile" to="224060217177789@localhost" id=" 123" type="set">
         *     <query xmlns="seeyon:recently:msg:cancel:stick">
         *         <time>1487062117093</time>
         *     </query>
         * </iq>
         */
        cancelTop : function(jid, toId, endTime, successFunction,errorFunc){
            var iq = new JSJaCIQ();
            iq.setIQ(toId + "@localhost", 'set', 'seeyon:recently:msg:cancel:stick');
            iq.setFrom(jid + "@localhost/mobile");
            var query = iq.setQuery('seeyon:recently:msg:cancel:stick');
            query.appendChild(iq.buildNode('time',endTime));
            console.log("获取取消置顶xml内容:" + iq.xml());
            sendIQ('seeyon:recently:msg:cancel:stick', iq.xml(), successFunction,errorFunc);
        },
        /**
         * 服务器主动推送到其他端取消置顶协议
         * @param jid 本人id 
         * @param toId 
         * @param stick_id 置顶对方人的id，只要@之前的数字
         * @param endTime 置顶的当时时间戳
         * @param successFunction
         * <iq from="2481121618130258326@localhost/mobile" to="224060217177789@localhost" id=" 123" type="result">
         *     <query xmlns="seeyon:recently:msg:cancel:stick">
         *         <time>1487062117093</time>
         *         <stick_id>123456</ stick_id >
         *     </query>
         * </iq>
         */
        cancelTopToOther : function(jid,toId,stick_id,endTime,successFunction,errorFunc){
            var iq = new JSJaCIQ();
            iq.setIQ(toId + "@localhost", 'result', 'seeyon:recently:msg:cancel:stick');
            iq.setFrom(jid + "@localhost/mobile");
            var query = iq.setQuery('seeyon:recently:msg:cancel:stick');
            query.appendChild(iq.buildNode('time',endTime));
            query.appendChild(iq.buildNode('stick_id',stick_id));
//            console.log(iq.xml());
            sendIQ('seeyon:recently:msg:cancel:stick', iq.xml(), successFunction,errorFunc);
        }
    },
    /**
     * 删除列表记录
     * @param jId
     * @param toId
     * @param isGroup
     * @param time
     * @param successFunc
     * @param errorFunc
     * <iq xmlns="jabber:client" from="760214426234537232@localhost" to="760214426234537232@localhost" type="set" id="delete:recently:msg">
     *   <query xmlns="delete:recently:msg:query">
     *       <delete_record_time>2017-03-07T09:33:10.357061+08:00</delete_record_time>
     *       <query_record_time>2016-07-13T16:46:53.673472+08:00</query_record_time>
     *       <type/>
     *   </query>
     * </iq>
     * 备注：to的值必须是from的值，并且去掉"/mobile"；然后from的值可以为空，也可以设置jid的值
     *
     */
    delFun : {
        delList : function(jId,time,successFunc,errorFunc){
            console.log("删除列表记录");
            var iq = new JSJaCIQ();
            var to = jId + "@localhost";
            iq.setIQ(to, 'set', "delete:recently:msg:query");
            iq.setFrom("");
            var query = iq.setQuery('delete:recently:msg:query');
            query.appendChild(iq.buildNode('delete_record_time', time));
            query.appendChild(iq.buildNode('query_record_time', time));
            query.appendChild(iq.buildNode('type'));
            console.log("删除列表记录:" + iq.xml());
            sendIQ("delete:recently:msg:query", iq.xml(), successFunc,errorFunc);
        }
    }
};

/**
 * 聊天页面删聊天记录
 * @param jId
 * @param toId
 * @param isGroup
 * @param time
 * @param successFunc
 * @param errorFunc
 * <iq xmlns="jabber:client" from="1837121229865107467@localhost" to="1837121229865107467@localhost" type="set" id="delete:history:msg">
 *     <query xmlns="delete:history:msg:query">
 *         <delete_record_time xmlns="">2017-03-03T11:28:23.936973+08:00</delete_record_time>
 *         <query_record_time xmlns="">2017-03-03T11:28:23.936973+08:00</query_record_time>
 *     </query>
 * </iq>
 *
 *
 */
function delChat(jId,toId,isGroup,time,successFunc,errorFunc){
    console.log("删除聊天信息历史记录");
    var iq = new JSJaCIQ();
    var to = isGroup? toId + "@group.localhost" : toId + "@localhost";
    iq.setIQ(to, 'set', "delete:history:msg:query");
    iq.setFrom(jId + "@localhost/mobile");
    var query = iq.setQuery('delete:history:msg:query');
    query.appendChild(iq.buildNode('delete_record_time', time));
    query.appendChild(iq.buildNode('query_record_time', time));
    console.log("删除聊天信息历史记录:" + iq.xml());
    sendIQ("delete:history:msg:query", iq.xml(), successFunc,errorFunc);
}
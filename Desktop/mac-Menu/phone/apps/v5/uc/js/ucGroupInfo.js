var params = {};
var $groupInfo = {
    isAdmin: false,
    adminId:"",
    userId: cmp.member.id,
    gNo : "",//群公告内容
    NOI : "",//群公告id
    block : null,
    groupName : "",
    groupMemberLength : null,  //群成员人数
    membersList : []
};
cmp.ready(function () {
    if(cmp.href.getBackParam()){
        params = cmp.href.getBackParam();
    }else{
        params = cmp.href.getParam();
    }
    // 返回
    back();

    // 加载页面数据
    loadData();

    // 点击群图片跳转到群图片页面
    groupPic();

    // 点击群文件跳转到群文件页面
    groupFile();

    // 屏蔽群消息
    initRecieve();
});
function _$(id) {
    if (id) {
        return document.querySelector(id);
    }
    return null;
}
function back(){
    _$("#prev").addEventListener("tap", function () {
        cmp.href.back(1,{"data":{groupName : uc.htmlDecodeByRegExp($groupInfo.groupName)}});
    });
    // 物理返回
    cmp.backbutton();
    cmp.backbutton.push(function(){
        cmp.href.back(1,{"data":{groupName : uc.htmlDecodeByRegExp($groupInfo.groupName)}});
    });
}
function loadData() {
    // 加载群信息上半部分
    ucGroupApi.groupInfo(
        cmp.member.id,
        params.groupId,
        params.groupName,
        infoDataCallback,
        function(data){
            if(data.code == "36005"){
                cmp.notification.alert(data.message,function(){
                    cmp.href.closePage();
                },"","确定");
            }
        });
    cmp.listView("#property", {});
}
/**
 * 群信息回调
 * @param result
 */
function infoDataCallback(result){
    var obj = getIqXml(result);
    var groupInfo = obj.xmlDoc.getElementsByTagName("group_info");
    if(groupInfo != null && groupInfo.length > 0){
        var g = groupInfo[0];
        var name = uc.htmlEncodeByRegExp(g.getAttribute("NA"));
        var pic = g.getAttribute("P");
        var adminId = g.getAttribute("NI").split("@")[0];
        $groupInfo.adminId = adminId;
        $groupInfo.gNo = g.getAttribute("NO");
        $groupInfo.NOI = g.getAttribute("NOI");
        $groupInfo.groupName = name;
        _$(".uc-group-top-name").innerHTML = name;//群名
        _$(".uc-group-input-name").innerHTML = name;//群名
        if(pic != "" && pic != null){
            _$(".uc-group-head").setAttribute("src",pic);//头像
        }else{
            var path = cmp.serverIp + "/seeyon/rest/orgMember/groupavatar?groupId=" + g.getAttribute("I").split("@")[0] + "&groupName=" + encodeURI(encodeURI(name)) + "&maxWidth=200&ucFlag=yes";
            _$(".uc-group-head").setAttribute("src",path);//头像
        }
        if(adminId == $groupInfo.userId){
            $groupInfo.isAdmin = true; //确定自己是否是管理员

            // 点击群组名称调用修改群组名称页面
            changeGroupName();

            //管理员页面改动
            _$(".uc-group-btn").innerHTML = "解散该群组";
        }
        // 退群 解散 判断
        exitGroup();
        
        // 加载群成员
        ucGroupApi.groupMemberList(
            cmp.member.id,
            params.groupId,
            params.groupName,
            memberListDataCallback,
            function(data){
                if(data.code == "36005"){
                    cmp.notification.alert(data.message,function(){
                        cmp.href.closePage();
                    },"","确定");
                }
            }
        );
        // 点击群公告跳转到群公告页面
        groupNotice();
    }else{
        //无groupinfo
        cmp.notification.alert("找不到",function(){
            cmp.href.back();
        },"","确定");
    }
}
/**
 * 群成员信息回调
 * @param result
 * group_members
 */
function memberListDataCallback(result){
    var obj = getIqXml(result);
    var groupMembers = obj.xmlDoc.getElementsByTagName("jid");//列表
    var mLen = groupMembers.length;
    $groupInfo.groupMemberLength = mLen;
    var maxNum = 48;
    if(groupMembers != null && mLen > 0){
        var memberHeadTpl = document.getElementById("memberHeadLi").innerHTML;
        var memberListHtml = "";
        _$(".uc-g-m-num").innerHTML = mLen;
        var memberIdList = [];
        var sortMList = sortMemberList(groupMembers);
        for(var i = 0; i < mLen ; i++){
            var member = sortMList[i];
            var mid = member.getAttribute("J").split("@")[0];
            var memberInfo = {
                id : mid,
                name : "",
                src : uc.getSingleAvatarUrl(mid,100)
            };
            memberIdList.push(memberInfo.id);
            if(i <= maxNum){
                var html = cmp.tpl(memberHeadTpl, memberInfo);
                memberListHtml += html;
            }
        }
        // 清空已选人员列表
        var nextLi = _$(".add");
        var members = document.querySelectorAll(".uc-group-m-list");
        if(members.length > 0){
            for(var i = 0;i < members.length; i ++){
                removeElement(members[i]);
            }
        }
        cmp.before(nextLi,memberListHtml);

        // 设置人员名字
        showPeoName(memberIdList);

        _$(".uc-group-m-add").style.display = "block";// 显示添加群组人员按钮
        // 点击加号，调用选人组件
        addGroupMember();

        if($groupInfo.isAdmin){
            _$(".uc-group-m-sub").style.display = "block";// 显示删除群组人员按钮
            // 删除群成员
            delGroupMember();
        }
        if(mLen > maxNum){
            var more = _$(".more_member");
            if (!more) {
                var pul = _$(".uc-group-member");
                pul.innerHTML += "<div class=\"more_member\">查看更多群成员 <span class=\"icon iconfont icon-PC-left-arrow\"></span></div>";
                jumpToMore();
            }
        }
    }else{
        //无groupinfo
        cmp.notification.alert("群成员读取出错！",function(){
            cmp.href.back();
        },"","确定");
    }
}

function memberListDataCallback1(result){
    var obj = getIqXml(result);
    var groupMembers = obj.xmlDoc.getElementsByTagName("jid");//列表
    var mLen = groupMembers.length;
    var maxNum = 48;
    if(groupMembers != null && mLen > 0){
        var memberHeadTpl = document.getElementById("memberHeadLi").innerHTML;
        var memberListHtml = "";
        _$(".uc-g-m-num").innerHTML = mLen;
        var memberIdList = [];
        var sortMList = sortMemberList(groupMembers);
        for(var i = 0; i < mLen ; i++){
            var member = sortMList[i];
            var mid = member.getAttribute("J").split("@")[0];
            var memberInfo = {
                id : mid,
                name : "",
                src : uc.getSingleAvatarUrl(mid,100)
            };
            memberIdList.push(memberInfo.id);
            if(i <= maxNum){
                var html = cmp.tpl(memberHeadTpl, memberInfo);
                memberListHtml += html;
            }
        }
        // 清空已选人员列表
        var nextLi = _$(".add");
        var members = document.querySelectorAll(".uc-group-m-list");
        if(members.length > 0){
            for(var i = 0;i < members.length; i ++){
                removeElement(members[i]);
            }
        }
        cmp.before(nextLi,memberListHtml);

        // 设置人员名字
        showPeoName(memberIdList,function(param){
            $groupInfo.membersList = param;
            for (var i = 0; i < param.length; i++) {
                $groupInfo.membersList[i].type = "member";
            }
        });
        if(mLen > maxNum){
            var more = _$(".more_member");
            if (!more) {
                var pul = _$(".uc-group-member");
                pul.innerHTML += "<div class=\"more_member\">查看更多群成员 <span class=\"icon iconfont icon-PC-left-arrow\"></span></div>";
                jumpToMore();
            }
        }
    }else{
        //无groupinfo
        cmp.notification.alert("群成员读取出错！",function(){
            cmp.href.back();
        },"","确定");
    }
}

// 排序，将群组放到数组的第一位
function sortMemberList(mList){
    var newMemberList = [];
    for(var i = 0;i < mList.length;i++){
        var m = mList[i];
        if(m.getAttribute("J").split("@")[0] == $groupInfo.adminId){
            newMemberList.unshift(mList[i]);
        }else{
            newMemberList.push(mList[i]);
        }
    }
    return newMemberList;
}

function jumpToMore(){
    cmp(".uc-group-member").on("tap", ".more_member", function (e) {
        var param = {
            groupId : params.groupId,
            groupName : params.groupName,
            isAdmin : $groupInfo.isAdmin
        };
        cmp.href.next(ucPath + "/html/ucShowMoreGroupMember.html", param,{
            animated : true,
            direction : "left"
        });
    });
}
function changeGroupName(){
    // 如果是群组，才可以修改群名称
    if($groupInfo.isAdmin){
        cmp(".uc-group-name").on("tap", ".uc-group-input-name", function (e) {
            var param = {
                groupId : params.groupId,
                groupName : _$(".uc-group-input-name").innerHTML
            };
            cmp.href.next(ucPath + "/html/ucChangeGroupName.html", param, {
                animated: true,
                direction: "left"
            });
        });
    }
}
function groupNotice(){
    cmp(".uc-group-data").on("tap", ".uc-group-notice", function (e) {
        var param = {
            groupId : params.groupId,
            groupName : params.groupName,
            noticeId : $groupInfo.NOI,
            isAdmin : $groupInfo.isAdmin,
            gNotice : $groupInfo.gNo
        };
        cmp.href.next(ucPath + "/html/ucGroupNotice.html", param, {
            animated: true,
            direction: "left"
        });
    });
}
function groupPic(){
    cmp(".uc-group-data").on("tap", ".uc-group-pic", function (e) {
        var param = {
            groupId : params.groupId
        };
        cmp.href.next(ucPath + "/html/ucGroupPic.html", param, {
            animated: true,
            direction: "left"
        });
    });
}
function groupFile(){
    cmp(".uc-group-data").on("tap", ".uc-group-file", function (e) {
        var param = {
            groupId : params.groupId
        };
        cmp.href.next(ucPath + "/html/ucGroupFile.html", param, {
            animated: true,
            direction: "left"
        });
    });
}
function delGroupMember(){
    cmp(".uc-group-member").on("tap", ".uc-group-m-sub", function (e) {
        var param = {
            groupId : params.groupId,
            groupName : params.groupName
        };
        cmp.href.next(ucPath + "/html/ucDelGroupMember.html", param, {
            animated: true,
            direction: "left"
        });
    });
}
function addGroupMember(){
    ucGroupApi.groupMemberList(cmp.member.id,params.groupId,params.groupName,function(result){
        var obj = getIqXml(result);
        var groupMembers = obj.xmlDoc.getElementsByTagName("jid");//列表
        var mLen = groupMembers.length;
        if(groupMembers != null && mLen > 0){
            var memberList = [];
            for(var i = 0; i < mLen ; i++){
                var member = groupMembers[i];
                var memberInfo = {
                    id : member.getAttribute("J").split("@")[0],
                    name : "",
                    type : "member"
                };
                memberList.push(memberInfo);
            }

            // 添加群成员
            cmp(".uc-group-members").on("tap", ".uc-group-m-add", function (e) {
                if ($groupInfo.groupMemberLength >= 300) {
                    cmp.notification.alert("群成员人数已达300人上限",function(){},"","确定");
                } else {
                    cmp.selectOrg("select",{
                        type:2,
                        flowType:2,
                        fillBackData:$groupInfo.membersList,
                        excludeData:memberList,
                        jump:false,
                        maxSize:300,
                        minSize:1,
                        selectType:"member",
                        lightMemberPermission:true,
                        callback:function(result){
                            var resultObj = JSON.parse(result);
                            var orgResult = resultObj.orgResult;
                            var memberIdList = [];
                            if (orgResult.length > 0) {
                                for(var i = 0;i<orgResult.length;i++){
                                    var peo = orgResult[i];
                                    memberIdList[i] = peo.id;
                                }
                                // cmp.selectOrgDestory("select");
                                // 向后台提交数据
                                ucGroupApi.addMember(cmp.member.id,params.groupId,params.groupName,memberIdList,function (result) {
                                    ucGroupApi.groupMemberList(
                                        cmp.member.id,
                                        params.groupId,
                                        params.groupName,
                                        memberListDataCallback1,
                                        function(data){
                                            if(data.code == "36005"){
                                                cmp.notification.alert(data.message,function(){
                                                    cmp.href.closePage();
                                                },"","确定");
                                            }
                                        }
                                    );
                                });
                            }
                        }
                    });
                }
              },false);
        }else{
            //无groupinfo
            cmp.notification.alert("群成员读取出错！",function(){
                cmp.href.back();
            },"","确定");
        }
    },function(data){
        if(data.code == "36005"){
            cmp.notification.alert(data.message,function(){
                cmp.href.closePage();
            },"","确定");
        }
    });
}
function exitGroup(){
    _$(".uc-group-btn").addEventListener("tap", function (e) {
        if($groupInfo.isAdmin){
            var confirm = cmp.notification.confirm("确定要解散当前群组吗？",function(index){
                if(index == 1){
                    ucGroupApi.delGroup(cmp.member.id,params.groupId,params.groupName,function (result) {
                    	//本地数据删除群组消息 
                    	uc.db.delGroupMessage(params.groupId,function(resid){
                    			console.log("退");
                                if(params.index){//从创建群组页面返回到列表页面
                                    cmp.href.back(3);
                                }else{
                                    cmp.href.back(2);
                                }
                    	  });
                    },function(data){
                        if(data.code == "36005"){
                            cmp.notification.alert(data.message,function(){
                                cmp.href.closePage();
                            },"","确定");
                        }
                    });
                }else if(index == 0){
                }
            },"确认",["取消","确定"]);

        }else{
            var confirm = cmp.notification.confirm("确定要退出当前群组吗？",function(index){
                if(index == 0){
                    ucGroupApi.exitGroup(cmp.member.id,params.groupId,params.groupName,function (result) {
                     	//本地数据删除群组消息 
                    	uc.db.delGroupMessage(params.groupId,function(resid){
                    		console.log("散");
                            if(params.index){//从创建群组页面返回到列表页面
                                cmp.href.back(3);
                            }else{
                                cmp.href.back(2);
                            }
                    	});

                    },function(data){
                        if(data.code == "36005"){
                            cmp.notification.alert(data.message,function(){
                                cmp.href.closePage();
                            },"","确定");
                        }
                    });
                }else if(index == 1){
                }
            },"确认",["确定","取消"]);

        }
    });
}
function removeElement(_element){
    var _parentElement = _element.parentNode;
    if(_parentElement){
        _parentElement.removeChild(_element);
    }
}
//初始化接收不提醒
function initRecieve() {
    var ele1 = _$(".uc-group-check").firstElementChild;
    var ele2 = _$(".uc-group-check").firstElementChild.firstElementChild;
    var block = cmp.storage.get("groupInfoBlock");
    if(block == "1"){
        ele1.className += " cmp-active";
        ele2.style = "transform: translate(21px, 0px)";
    }else{
        ele1.className.replace(" cmp-active","");
        ele2.style = "transform: translate(0px, 0px)";
    }
    // _$(".uc-group-check").addEventListener("touchmove", function (e) {
    //     sendShieldAgreement(this);
    // });
    _$("#uc-recieve-block").addEventListener("toggle", function (e) {
        // sendShieldAgreement(this);
        console.log(this.className);
        if (this.className.indexOf("cmp-active") != -1) {
            ucGroupApi.closeGroupMsg(cmp.member.id,params.groupId,function(data){
                cmp.storage.save("groupInfoBlock", 1);
            },function(data){
                if(data.code == "36005"){
                    cmp.notification.alert(data.message,function(){
                        cmp.href.closePage();
                    },"","确定");
                }
            });
        } else {
            ucGroupApi.resiveGroupMsg(cmp.member.id,params.groupId,function(data){
                cmp.storage.save("groupInfoBlock", 0);
            },function(data){
                if(data.code == "36005"){
                    cmp.notification.alert(data.message,function(){
                        cmp.href.closePage();
                    },"","确定");
                }
            });
        }
    });
}

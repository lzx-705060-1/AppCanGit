var params = {};
var groupMembersList = [];//保存已选人员数据[{'id':123456,'name':'sdf','type':'member'}]
var groupMemberLength = null;
cmp.ready(function () {
    params = cmp.href.getParam();
    // 返回
    back();
    // 加载页面数据
    loadData();
});
function _$(id) {
    if (id) {
        return document.querySelector(id);
    }
    return null;
}
function back(){
    _$("#prev").addEventListener("tap", function () {
        cmp.href.back();
    });
    document.addEventListener("backbutton",function(){
        cmp.href.back();
    });
}
function loadData() {
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
    cmp.listView("#property", {});
}
/**
 * 群成员信息回调
 * @param result
 * group_members
 */
function memberListDataCallback(result){
    var obj = getIqXml(result);
    var groupMembers = obj.xmlDoc.getElementsByTagName("jid");
    var mLen = groupMembers.length;
    groupMemberLength = mLen;
    if(groupMembers != null && mLen > 0){
        var memberHeadTpl = document.getElementById("memberHeadLi").innerHTML;
        var memberListHtml = "";
        _$("#title").innerHTML = "群成员(" + mLen + ")人";
        var mList = [];
        for(var i = 0; i < mLen ; i++){
            var member = groupMembers[i];
            var mid = member.getAttribute("J").split("@")[0];
            var memberInfo = {
                id : mid,
                name : "",
                src : uc.getSingleAvatarUrl(mid,100)
            };
            var html = cmp.tpl(memberHeadTpl, memberInfo);
            memberListHtml += html;
            mList.push(memberInfo.id);
        }

        var ul = _$(".uc-group-members");
        ul.innerHTML = "";//先清空原来历史记录
        ul.innerHTML = memberListHtml + ul.innerHTML;

        _$(".uc-group-m-add").style.display = "block";//显示添加群成员按钮
        // 点击加号，调用选人组件
        addMember();
        
        if(params.isAdmin){
            _$(".uc-group-m-sub").style.display = "block";//显示删除群成员按钮
            delMember();// 删除群成员
        }
        showPeoName(mList,function(param){
            groupMembersList = param;
            for (var i = 0; i < param.length; i++) {
                groupMembersList[i].type = "member";
            }
        });
    }else{
        cmp.notification.alert("群成员读取出错！",function(){
            cmp.href.back();
        },"","确定");
    }
}

function delMember(){
    cmp(".uc-fun-btn").on("tap", ".uc-group-m-sub", function (e) {
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
function addMember(){
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

            cmp(".uc-fun-btn").on("tap", ".uc-group-m-add", function (e) {
                if (groupMemberLength >= 300) {
                    cmp.notification.alert("群成员人数已达300人上限",function(){},"","确定");
                } else {
                    cmp.selectOrg("select",{
                        type:2,
                        flowType:2,
                        fillBackData:groupMembersList,
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
                                cmp.selectOrgDestory("select");
                                // 向后台提交数据
                                ucGroupApi.addMember(cmp.member.id,params.groupId,params.groupName,memberIdList,function (result) {
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
                                });
                            }
                        }
                    });
                }
            },false);
        }else{
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
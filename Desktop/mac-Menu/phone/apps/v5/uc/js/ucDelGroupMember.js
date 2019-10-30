var params = {};
cmp.ready(function() {
	params = cmp.href.getParam();
    // 加载所有人员
	loadData();
	// 返回
	backPage();
    // 物理返回
    document.addEventListener("backbutton",function(){
        cmp.href.back();
    });
    // 确定删除
    confirmDelMember();
});
function _$(id) {
	if (id) {
		return document.querySelector(id);
	}
	return null;
}
function backPage(){
	_$("#prev").addEventListener("tap", function(){
	  	cmp.href.back();
	});
}
function loadData() {
	cmp.listView("#uc_delM", {});
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
    if(groupMembers != null && mLen > 0){
        var memberHeadTpl = document.getElementById("memberHeadLi").innerHTML;
        var memberListHtml = "";
        var memberList = [];
        for(var i = 0; i < mLen ; i++){
            var member = groupMembers[i];
            var mId = member.getAttribute("J").split("@")[0];
            if(cmp.member.id != mId){//不展现管理员
                var memberInfo = {
                    id : mId,
                    name : "",
                    src : uc.getSingleAvatarUrl(mId,100)
                };
                var html = cmp.tpl(memberHeadTpl, memberInfo);
                memberListHtml += html;
                memberList.push(memberInfo.id);
            }
        }
        var ul = _$(".uc-del-group-member");
        ul.innerHTML = memberListHtml + ul.innerHTML;
        showPeoName(memberList);
    }else{
        cmp.notification.alert("群成员读取出错！",function(){
            cmp.href.back();
        },"","确定");
    }
}
// 确定删除群成员功能
function confirmDelMember(){
    _$("#uc_confirm").addEventListener("tap", function(){
        var memberIdList = [];
        var mList = _$(".uc-del-group-member").querySelectorAll("input");
        for (var i=0,checkedStatus=[];i<mList.length;i++) {
            (mList[i].checked == true) && (checkedStatus.push(true))
        }
        var mLen = mList.length;
        if(mLen > 0){
            for(var i = 0; i < mLen; i++){
                var m = mList[i];
                if(m.checked){
                    memberIdList[i] = m.getAttribute("id");
                }
            }
        }
        if(memberIdList.length > 0){
            if(mLen == 1 || mLen == checkedStatus.length){
                cmp.notification.alert("群成员不能为空！",function(){},"","确定");
            }else{
                ucGroupApi.delMember(
                    cmp.member.id, 
                    params.groupId,
                    params.groupName, 
                    memberIdList, 
                    function(data){
                        cmp.href.back(1, {groupId : params.groupId,groupName : params.groupName});
                    },
                    function(data){
                        if(data.code == "36005"){
                            cmp.notification.alert(data.message,function(){
                                cmp.href.closePage();
                            },"","确定");
                        }
                    }
                ); 
            }
        }else{
            cmp.notification.alert("请选择要删除的人员！",function(){},"","确定");
        }
    });
}
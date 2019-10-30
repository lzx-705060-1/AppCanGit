var serverAdress = uc.getCurServerInfo().serverurl;
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
    cmp.dialog.loading();
    cmp.ajax({
        type: "GET",
        url: serverAdress + "/seeyon/rest/uc/rong/groups/bygid/" + params.groupId,
        success: function (msg) {
            cmp.dialog.loading(false);
            memberListDataCallback(msg);
        },
        error: function (msg) {
            cmp.dialog.loading(false);
            console.log(msg);
            //进行错误处理
            if (msg && msg.message) {
                cmp.notification.alert(msg.message,function(){
                    cmp.href.back();
                },"",cmp.i18n("uc.m3.h5.ok"));
            } else {
                cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetMemberData"),function(){
                    cmp.href.back();
                },"",cmp.i18n("uc.m3.h5.ok"));
            }
        }
    });

	cmp.listView("#uc_delM", {});

}
/**
 * 群成员信息回调
 * @param result
 * group_members
 */
function memberListDataCallback(result){
    var groupInfo = result.group;
    var groupMembers = groupInfo.ma;
    var gAdminId = groupInfo.ci;
    var mLen = groupMembers.length;
    groupMemberLength = mLen;

    if(groupMembers != null && mLen > 0){
        var memberHeadTpl = document.getElementById("memberHeadLi").innerHTML;
        var memberListHtml = "";
        var memberList = [];
        for(var i = 0; i < mLen ; i++){
            var member = JSON.parse(groupMembers[i]);
            var mId = member.id;
            var sortId = member.sortId;
            var mName = member.name;
            // if(gAdminId != mId){//不展现管理员
                var memberInfo = {
                    id : mId,
                    name : mName,
                    sortId : sortId,
                    admin : gAdminId,
                    src : serverAdress + "/seeyon/rest/orgMember/avatar/"+mId+"?maxWidth=100"
                };
                memberList.push(memberInfo);
            // }
        }

        // var sortMemberList = memberList.sort(function(a,b){return a.sortId - b.sortId;});
        for (var t = 0 ; t < memberList.length ; t ++) {
            var html = cmp.tpl(memberHeadTpl, memberList[t]);
            memberListHtml += html;
        }
        
        var ul = _$(".uc-del-group-member");
        ul.innerHTML = ul.innerHTML + memberListHtml;
    }else{
        cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetMemberData"),function(){
            cmp.href.back();
        },"",cmp.i18n("uc.m3.h5.ok"));
    }
}
// 确定删除群成员功能
function confirmDelMember(){
    _$("#uc_confirm").addEventListener("tap", function(){
        var memberIdList = [];
        var mList = _$(".uc-del-group-member").querySelectorAll("input");
        for (var i = 0, checkedStatus = []; i < mList.length; i++) {
            (mList[i].checked == true) && (checkedStatus.push(true))
        }
        var mLen = mList.length;
        if(mLen > 0){
            for(var i = 0; i < mLen; i++){
                var m = mList[i];
                if(m.checked){
                    memberIdList.push(m.getAttribute("id"));
                }
            }
        }
        if(memberIdList.length > 0){
            cmp.dialog.loading();
            cmp.ajax({
                type: "POST",
                url: serverAdress + "/seeyon/rest/uc/rong/groups/remove",
                data:JSON.stringify({
                    groupId: params.groupId,
                    memberId: memberIdList.join(",")
                }),
                success: function (msg) {
                    cmp.dialog.loading(false);
                    console.log(msg);
                    removedCallback(memberIdList);
                },
                error: function (msg) {
                    cmp.dialog.loading(false);
                    console.log(msg);
                    //进行错误处理
                    if (msg && msg.message) {
                        cmp.notification.alert(msg.message,function(){
                            
                        },"",cmp.i18n("uc.m3.h5.ok"));
                    } else {
                        cmp.notification.alert(cmp.i18n("uc.m3.h5.failedDeleteGroupMembers"),function(){
                            
                        },"",cmp.i18n("uc.m3.h5.ok"));
                    }
                }
            });
        }else{
            cmp.notification.alert("请选择要删除的人员！",function(){},"",cmp.i18n("uc.m3.h5.ok"));
        }
    });
}

// 删除人员回调函数
function removedCallback (memberIdList) {
    var parent = _$(".uc-del-group-member");
    for (var i = 0 ; i < memberIdList.length ; i++) {
        var dom = document.getElementById(memberIdList[i]).parentNode.parentNode;
        parent.removeChild(dom);
    }
}





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
    // 确定
    confirm();
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
            memberListDataCallback(msg)
        },
        error: function (msg) {
            cmp.dialog.loading(false);
            console.log(msg)
            //进行错误处理
            if (msg && msg.message) {
                cmp.notification.alert(msg.message,function(){
                    cmp.href.back();
                },"","确定");
            } else {
                cmp.notification.alert("群成员加载失败",function(){
                    cmp.href.back();
                },"","确定");
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
            if(gAdminId != mId){//不展现管理员
                var memberInfo = {
                    id : mId,
                    name : mName,
                    sortId : sortId,
                    src : serverAdress + "/seeyon/rest/orgMember/avatar/"+mId+"?maxWidth=100"
                };
                memberList.push(memberInfo);
            }
        }

        var sortMemberList = memberList.sort(function(a,b){return a.sortId - b.sortId;});
        for (var t = 0 ; t < sortMemberList.length ; t ++) {
            var html = cmp.tpl(memberHeadTpl, sortMemberList[t]);
            memberListHtml += html;
        }
        
        var ul = _$(".uc-group-member");
        ul.innerHTML = ul.innerHTML + memberListHtml;
    }else{
        cmp.notification.alert("群成员读取出错！",function(){
            cmp.href.back();
        },"","确定");
    }
}
// 确定转移群主
function confirm(){
    _$("#uc_confirm").addEventListener("tap", function(){
        var memberIdList = [];
        var mList = _$(".uc-group-member").querySelectorAll("input");
        var newAdminId = "";
        for (var i = 0; i < mList.length; i++) {
            (mList[i].checked == true) && (newAdminId = mList[i].getAttribute("id"))
        }

        if(!newAdminId){
            cmp.notification.alert("请选择要转移为群主的人员",function(){},"","确定");
        }else{
            cmp.dialog.loading();
            cmp.ajax({
                type: "POST",
                url: serverAdress + "/seeyon/rest/uc/rong/groups/update",
                data:JSON.stringify({
                    groupId: params.groupId,
                    creatorId: newAdminId
                }),
                success: function (msg) {
                    cmp.dialog.loading(false);
                    console.log(msg);
                    cmp.ajax({
                        type: "POST",
                        url: serverAdress + "/seeyon/rest/uc/rong/groups/quit",
                        data:JSON.stringify({
                            groupId: params.groupId,
                            memberId: params.userId
                        }),
                        success: function (msg) {
                            console.log(msg);
                            cmp.chat.backPage({
                                index: "1",
                                type: "quitGroup",
                                data: JSON.stringify({
                                    groupId: params.groupId
                                }),
                                refresh: true,
                                success:function(){
                                    console.log("退出群组成功")
                                },
                                error:function(){
                                    console.log("退出群组失败")
                                }
                            })
                          },
                        error: function (msg) {
                            console.log(msg);
                            //进行错误处理
                        }
                    });
                },
                error: function (msg) {
                    cmp.dialog.loading(false);
                    console.log(msg);
                    //进行错误处理
                    if (msg && msg.message) {
                        cmp.notification.alert(msg.message,function(){},"","确定");
                    } else {
                        cmp.notification.alert("转移群主失败",function(){},"","确定");
                    }
                }
            });
        }
    });
}






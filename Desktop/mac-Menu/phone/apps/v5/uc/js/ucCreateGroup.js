var params = {};
var memberData =[{
    id:cmp.member.id,
    name:cmp.member.name,
    type:"member"
}];
cmp.ready(function() {
    cmp.description.init(_$("#uc-group-name"));
	initPage();
	// 返回
	backPage();
});
function _$(id) {
  if (id) {
    return document.querySelector(id);
  }
  return null;
}
function backPage(){
    document.getElementById("prev").addEventListener("tap", function(){
        var gn = _$("#uc-group-name").value;
        var ms = _$("#uc-alread-members").querySelectorAll("li");
        if(gn != "" || ms.length > 2){
            cmp.notification.confirm("是否放弃创建群组？", function (index) {
                if (index == 1) {
                    cmp.href.back();
                }
            });
        }else{
            cmp.href.back();
        }
    });
}
// 初始化清空群组名称
function initClearBtn(e){
    var _self = e;
    var clear = _self.nextElementSibling;
    if(_self.value != ""){
        clear.style.display = "block";
        clear.addEventListener("click", function() {
            clear.style.display = "none";
            _self.value = "";
            _self.focus();
        });
    }else{
        clear.style.display = "none";
    }
}
//初始化界面
function initPage() {
    cmp.listView('#changeName', {
        config: {
            pageSize: 10,
            params: cmp.href.getParam(),
            renderFunc: renderData
        }
    });
    // 选人组件
    selectMemberEventListener(memberData);
    // 渲染页面
    var data = JSON.stringify({
        "orgResult":[{
            name:cmp.member.name,
            id:cmp.member.id,
            account: cmp.member.accountId,
            post: cmp.member.postName,
            type: "Member"}]
        });
    renderData(data,true);
    document.getElementById("cmp-control").addEventListener("touchend",function(){document.getElementById("uc-group-name").blur();})
    document.getElementById("uc-group-name").addEventListener("touchend",function(){event.stopPropagation()})
    // 确定创建群组
    creGroup(memberData);
}

/**
 * 获取选人，进行渲染
 * @param result
 * @param isRefresh
 */
function renderData(result, isRefresh) {
	var resultObj = JSON.parse(result);
    for(var i = 0;i < resultObj.orgResult.length;i++){
        resultObj.orgResult[i].src = uc.getSingleAvatarUrl(resultObj.orgResult[i].id,100);
    }
	var listTpl = uc.innerHTML(_$("#member_li_tpl"));
    var table = _$('#li-select-member');
    var html = cmp.tpl(listTpl, resultObj.orgResult);
    //是否刷新操作，刷新操作直接覆盖数据
    if (isRefresh && StringUtil.isEmpty(uc.innerHTML(table))) {
        table.innerHTML = html;
    } else {
        // 清空已选人员列表
        var members = querySelectorAll(".select_member");
        if (members.length > 0) {
            for (var i = 0; i < members.length; i++) {
                removeElement(members[i]);
            }
        }
        cmp.before(table, html);
    }
}

function returnRangeData(memberAuthScope, mdata) {
	for (var i = 0; i < mdata.length; i++) {
		memberData[i] = mdata[i];
	}
	params.memberAuthScope = memberAuthScope;
	_$("#members_value").value = mdata;
	
}
function selectMemberEventListener(memberData){
	_$("#li-select-member").addEventListener("tap",function(){
        cmp.selectOrg('select',{
            type:2,
            flowType:2,
            fillBackData:memberData,
            excludeData:[{id:cmp.member.id,name:cmp.member.name,type:"member"}],
            jump:false,
            maxSize:300,
            minSize:2,
            selectType:'member',
            permission:false,
            lightMemberPermission:true,
            callback:function(result){
            	var resultObj = JSON.parse(result);
            	var orgResult = resultObj.orgResult;
				if (orgResult.length > 0) {
					returnRangeData("Part", orgResult);
				}
				cmp.selectOrgDestory("select");
                result.src = uc.getSingleAvatarUrl(cmp.member.id,100);
				renderData(result,true);
            }
        });
    },false);
}
function creGroup(memberData){
    _$("#uc-confirm").addEventListener("tap", function () {
        _$("#uc-group-name").blur();
        var groupName = _$("#uc-group-name").value.replace(/(^\s*)|(\s*$)/g,""); 
        var memList = document.querySelector("#uc-alread-members").querySelectorAll(".select_member").length;
        if(groupName == ""){
            cmp.notification.alert("请输入群名称！",function(){},"","确定");
        }else if(memList == 1){
            cmp.notification.alert("群组至少包含两名群成员！",function(){},"","确定");
        }else{
            var memberList = [];
            for (var i = 0; i < memberData.length; i++) {
                memberList[i] = memberData[i].id;
            }
            ucGroupApi.createGroup(cmp.member.id, groupName, 4, memberList, function (result) {
                var obj = getIqXml(result);
                var groupInfo = obj.xmlDoc.getElementsByTagName("group_info");
                if(groupInfo != null && groupInfo.length > 0){
                    var value = groupInfo[0].getAttribute("I");
                    if(value != null){
                        var tempId = value.split("@")[0];
                        if(tempId != null && tempId != 'undefined'){
                            var params = {
                                "toId":tempId,
                                "toName" : groupName,
                                "chatType" : "groupchat",
                                "createGroup" : true //标识是不是从创建群组页面到群聊天窗口中，需要返回到哪里的一个标识
                            };
                            var msgInfo=uc.initChatMessageToDate(tempId,groupName,'groupchat',groupName);
                            uc.db.insertUcIndexMsg(msgInfo,true, function(res){
	                            cmp.href.next(ucPath + "/html/ucGroupChatView.html", params,{
	                                animated : true,
	                                direction : "left"
	                            });
                            });
                        }
                    }
                }
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

function removeElement(_element){
    var _parentElement = _element.parentNode;
    if(_parentElement){
        _parentElement.removeChild(_element);
    }
}


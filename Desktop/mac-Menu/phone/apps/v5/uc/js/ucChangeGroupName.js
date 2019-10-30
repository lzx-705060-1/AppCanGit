var params = {};
cmp.ready(function() {
    params = cmp.href.getParam();
    cmp.listView("#changeName", {});
    cmp.description.init(document.getElementById("uc-group-name"));
    //返回
    back();
    cmp.backbutton();
    cmp.backbutton.push(function(){
        if(location.search.indexOf("?") != -1){
            cmp.href.close();
        }else{
            cmp.href.back();
        }
    });
    // 显示群名称
    showGroupName();

    // 点击确定按钮
    confirm();
    //异步执行检查UC状态
    window.setTimeout(function(){
        uc.checkUCState();
    	},500);
});
function back(){
  document.getElementById("prev").addEventListener("tap", function(){
    cmp.href.back();
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

function clearGroupName (e) {
    if (e) {
        var _self = e;
        var _input = document.getElementById("uc-group-name");
        if (_input.value != "") {
            _self.style.display = "none";
            _input.value = "";
            _self.focus();
        }
    } else {

    }
}

function showGroupName(){
    var gn = document.getElementById("uc-group-name");
    gn.value = uc.htmlDecodeByRegExp(params.groupName);
    gn.focus();
}
function confirm(){
    document.querySelector(".uc-confirm").addEventListener("click",function(){
        var newGroupName = document.getElementById("uc-group-name").value.replace(/(^\s*)|(\s*$)/g,"");
        if (newGroupName) {
            ucGroupApi.renameGroup(cmp.member.id, params.groupId, params.groupName, newGroupName, function(result){
                var param = {
                    groupId : params.groupId,
                    groupName : newGroupName
                };
                newGroupName=uc.htmlEncodeByRegExp(newGroupName);
                uc.db.updateGroupName(params.groupId,newGroupName,function(resId){
                    sendSysTextToServer(params.groupId,newGroupName,'groupchat',uc.userInfo.getRealName()+'将群名称修改为《'+newGroupName+'》(系统消息)');
                        if(resId&&resId!='undefined'){
                            cmp.href.back(param);
                        }
                });
            },function(data){
                if(data.code == "36005"){
                    cmp.notification.alert(data.message,function(){
                        cmp.href.closePage();
                    },"","确定");
                }
            });
        } else {
            cmp.notification.alert("群组名称不能为空",function(){
                document.getElementById("uc-group-name").focus();
            },"","确定");
        }
    });
}

//发送系统文本消息
function sendSysTextToServer(toId,toName,chatType,content){
    chatForSysMessage({
        id:cmp.buildUUID(),
        toId:toId,
        toName:toName,
        chatType:chatType,
        content:content,
        errorFunc : function(data){
            console.log(data);
        }
    });
}
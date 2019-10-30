var serverAdress = uc.getCurServerInfo().serverurl;
var prePagePath = ""; // 快捷操作发起聊天时传递过来的当前页面的路径，用来选人控件点击取消按钮时返回到正确页面
var groupName = "";
var departmentId = [];
var groupMembersNameList = [];
var groupMembersId = [];
var membersName = [];
var memberData =[{
    id:cmp.member.id,
    name:cmp.member.name,
    type:"member"
}];

cmp.ready(function() {
    ucCommon.ucGetGroupTotal({
        success: function () {
            initPage();
        }
    });
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
    document.addEventListener("backbutton", function() {
        cmp.href.back();
    });
}

//初始化界面
function initPage() {
    // 选人组件
    selectMember(memberData);
    
    // 确定创建群组
    // creGroup(memberData);
}


function returnRangeData(mdata) {
    groupName = "";
    departmentId = [];
    groupMembersNameList = [];
    groupMembersId = [];
    membersName = [];
	for (var i = 0; i < mdata.length; i++) {
        if (mdata[i].type != 'Department') {
            groupMembersId.push(mdata[i].id);
            groupMembersNameList.push(mdata[i].name);
        } else {
            // 如果选择了部门需要给接口传递部门id
            departmentId.push(mdata[i].id);
        }
        membersName.push(mdata[i].name);
    }	
}
function selectMember(memberData){
    // cmp.dialog.loading();
    ucCommon.ucSelectMember({
        minSize: 2,
        maxSize: ucCommon.ucGroupTotal - memberData.length,
        callback: function(result){
            cmp.chat.exec('getRongConfig',{
                success: function(res){
                    console.log(res)
                    ucCommon.ucGroupTotal = res.groupsize;
                    var resultObj = JSON.parse(result);
                    var orgResult = resultObj.orgResult;
                    if (orgResult.length > 0) {
                        returnRangeData(orgResult);
                    }
                    cmp.selectOrgDestory("select");
                    if (departmentId && (departmentId.length < 1)) {
                        if (groupMembersId && groupMembersId.length <= 2) { //发起单人聊天
                            var toMember = {};
                            var orgResult = JSON.parse(result).orgResult;
                            for (var j = 0 ; j < orgResult.length ; j++) {
                                if (orgResult[j].id != cmp.member.id) {
                                    toMember.id = orgResult[j].id;
                                    toMember.name = orgResult[j].name;
                                }
                            }
                            cmp.chat.start({
                                title: toMember.name,
                                id: toMember.id,
                                clearPrePage: true,
                                type: "member",
                                success: function(){
                                    
                                },
                                error: function(){

                                }
                            })
                        }
                    }
                    if ((departmentId && (departmentId.length > 0)) || (groupMembersId && groupMembersId.length > 2)) { // 发起群组聊天
                        var isAlert = false;
                        if (departmentId && (departmentId.length > 0)) {
                            if ((departmentId.length + groupMembersId.length) > ucCommon.ucGroupTotal) {isAlert = true;}
                        }
                        if ((departmentId.length < 1) && (groupMembersId.length > ucCommon.ucGroupTotal)) {isAlert = true;}
                        if (isAlert) {
                            cmp.notification.alert('群组最大人数: ' + ucCommon.ucGroupTotal,function(){
                                selectMember(memberData);
                            },"","确定");
                        }
                        // 用群成员名拼接群名
                        var gNamelist = [];
                        if (membersName && membersName.length != 0) {
                            for (var i = 0; i < membersName.length; i++) {
                                if (i <= 3) {
                                    gNamelist.push(membersName[i].slice(0,4));
                                }
                            }
                            groupName = gNamelist.join(",");
                        }
                        // 调用创建群租接口
                        cmp.dialog.loading();
                        cmp.ajax({
                            type: "POST",
                            data: JSON.stringify({
                                groupName: groupName,
                                description: "",
                                groupMembers: groupMembersId.join(","),
                                membersName: groupMembersNameList.join(","),
                                departmentId: departmentId.join(",")
                            }),
                            url: serverAdress + "/seeyon/rest/uc/rong/groups/create",
                            success: function (msg) {
                                console.log(msg)
                                cmp.dialog.loading(false);
                                if(msg && msg.status === 'ok' && msg.code === '6110'){
                                // 创建\跳转到群组聊天窗口
                                    cmp.chat.start({
                                        title: groupName,
                                        id: String(msg.groupId),
                                        clearPrePage: true,
                                        type: "group",
                                        success: function(){
                                            
                                        },
                                        error: function(){
                                            //进行错误处理
                                            if (msg && msg.code && msg.code == 501) {
                                                cmp.notification.alert('群组最大人数: ' + ucCommon.ucGroupTotal + ',已超出最大人数',function(){
                                                    selectMember(memberData);
                                                },"","确定");
                                            } else {
                                                if (msg && msg.message) {
                                                    cmp.notification.alert(msg.message,function(){
                                                        selectMember(memberData);
                                                    },"","确定");
                                                } else {
                                                    cmp.notification.alert('发起聊天失败,稍后重新选取发起聊天对象',function(){
                                                        selectMember(memberData);
                                                    },"","确定");
                                                }
                                            }
                                        }
                                    })
                                }else if(msg && msg.code){
                                    var title = ''
                                    switch(msg.code){
                                        case 6111:
                                            title = '群组名称输入有误或包含非法字符，请重新输入！'
                                            break;
                                        case 6112:
                                            title = '创建群组失败，数据异常！'
                                            break;
                                        case 6113:
                                            title = '创建群组失败，超出群组最大限定人数！'
                                            break;
                                        case 6114:
                                            title = '群组不存在！'
                                            break;
                                        case 6115:
                                            title = '群组更新失败！'
                                            break;
                                        case 6116:
                                            title = '移除出群组失败！'
                                            break;
                                        case 6117:
                                            title = '解散群组失败！'
                                            break;
                                        case 6118:
                                            title = '退出群组失败！'
                                            break;
                                        default:
                                            title = '群组创建失败！(服务器错误)'
                                    }

                                    cmp.notification.alert(title,function(){
                                        selectMember(memberData);
                                    },"","确定");
                                }
                            },
                            error: function (msg) {
                                cmp.dialog.loading(false);
                                console.log(msg)
                                //进行错误处理
                                if (msg && msg.code && msg.code == 501) {
                                    cmp.notification.alert('群组最大人数: ' + ucCommon.ucGroupTotal + ',已超出最大人数',function(){
                                        selectMember(memberData);
                                    },"","确定");
                                } else {
                                    if (msg && msg.message) {
                                        cmp.notification.alert(msg.message,function(){
                                            selectMember(memberData);
                                        },"","确定");
                                    } else {
                                        cmp.notification.alert('发起聊天失败,稍后重新选取发起聊天对象',function(){
                                            selectMember(memberData);
                                        },"","确定");
                                    }
                                }
                            }
                        })
                    }
                },
                error: function(error){
                    console.log(error)
                    cmp.notification.alert('获取群组最大人数失败',function(){},"","确定");
                }
            })
        },
        closeCallback: function(result){
            cmp.href.back();
        }
    }, memberData);
}
// function creGroup(memberData){
//     _$("#uc-confirm").addEventListener("tap", function () {
//         _$("#uc-group-name").blur();
//         var groupName = _$("#uc-group-name").value.replace(/(^\s*)|(\s*$)/g,""); 
//         var memList = document.querySelector("#uc-alread-members").querySelectorAll(".select_member").length;
//         // if(groupName == ""){
//             // cmp.notification.alert("请输入群名称！",function(){},"","确定");

//         if(memList == 1){
//             cmp.notification.alert("群组至少包含两名群成员！",function(){},"","确定");
//         }else{
//             if (groupName == "") {
//                 var gNamelist = [];
//                 for (var p=0;p<groupMembersNameList.length;p++) {
//                     if (p<=3) {
//                         gNamelist.push(groupMembersNameList[p].slice(0,4));
//                     }
//                 }
//                 groupName = gNamelist.join(",");
//             }
//             var memberIdList = [], memberNameList = [];
//             for (var i = 0; i < memberData.length; i++) {
//                 memberIdList.push(memberData[i].id);
//                 memberNameList.push(memberData[i].name);
//             }
//             cmp.ajax({
//                 type: "POST",
//                 data: JSON.stringify({
//                     groupName: groupName,
//                     description: "",
//                     groupMembers: memberIdList.join(","),
//                     membersName: memberNameList.join(",")
//                 }),
//                 url: serverAdress + "/seeyon/rest/uc/rong/groups/create",
//                 success: function (msg) {

//                 },
//                 error: function (msg) {
//                     console.log(msg)
//                     //进行错误处理
//                 }
//             })
//         }
//     });
// }

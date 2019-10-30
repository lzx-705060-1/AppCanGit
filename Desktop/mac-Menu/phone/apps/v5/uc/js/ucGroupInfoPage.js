var serverAdress = uc.getCurServerInfo().serverurl;

var $groupInfo = {
    isAdmin: false,
    groupId: "",
    adminId: "",
    userId: "",
    gNo : "",//群公告内容
    total : null,//群成员人数上限
    block : null,
    groupName : "",
    groupMemberLength : null,  //群成员人数
    membersList : []
};
var $groupQRInfo = {  //群二维码页面组装需要的数据
    id:"",
    logo:"",
    name:"",
    url:""
}
var groupIdAndUserId,groupId,userId;
if (location.href.indexOf("?") != -1) {
    groupIdAndUserId = location.href.split("?")[1];
    var groupIdArray=groupIdAndUserId.split("&");
    if(groupIdArray.length>1){
        groupId = groupIdArray[0].split("=")[1];
        userId = groupIdArray[1].split("=")[1];
    }
}
$groupInfo.groupId = groupId || '';
$groupInfo.userId = userId || '';


// 消息提醒开关状态
var alertStatus = null;

// 会话置顶开关状态
var topStatus = null;

// 加载页面数据
loadData();

cmp.ready(function () {

    var cmpControl = document.getElementById('cmp-control');
    var windowHeight = document.body.clientHeight;
    var height = '';
    if (cmp.os.ios) {height = windowHeight - 64 + 'px';}
    if (cmp.os.android) {height = windowHeight - 44 + 'px';}
    cmpControl.style.height = height;
    //初始化开关
    cmp('.cmp-switch')['switch']();
    
    // 加载页面数据
    // loadData();

    // 返回
    back();

    // 点击群图片跳转到群图片页面
    groupPic();

    // 点击群文件跳转到群文件页面
    groupFile();

    // 获取开关状态
    getFlagStatus();

    // 会话置顶
    conversationToTop();

    // 屏蔽群消息
    initRecieve();

    // 清空历史纪录
    clearHistoryMsg();

    //跳转到群二维码
	toQrcodeHtml();
    
    // 自定义群组头像
    modifyAvatar();
    
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
    // 物理返回
    cmp.backbutton();
    cmp.backbutton.push(function(){
        cmp.href.back();
    });
}
function loadData() {
    cmp.dialog.loading();
    // 加载群信息上半部分
    cmp.ajax({
        type: "GET",
        cmpReady2Fire: true,
        fastAjax: true,
        url: serverAdress + "/seeyon/rest/uc/rong/groups/bygid/" + $groupInfo.groupId, 
        success: function (msg) {
            cmp.dialog.loading(false);
            ucCommon.ucGetGroupTotal();
            infoDataCallback(msg);
            // 点击加号，调用选人组件
            addGroupMember();
            // 删除群成员
            delGroupMember();
        },
        error: function(error) {
            cmp.dialog.loading(false);
            var cmpHandled = cmp.errorHandler(error);
            if (cmpHandled) {
                //cmp处理了这个错误
            } else {
                //customHandle(error) ;//走自己的处理错误的逻辑
                cmp.href.back();
            }
        }
    })
    
    cmp.listView("#property", {});
}

/**
 * 群信息回调
 * @param result
 */
function infoDataCallback(result){
    console.log(result)
    var groupInfo = result.group;
    console.log({  //设置数据
        id: $groupInfo.groupId,
        logo:groupInfo.pu,
        name:groupInfo.n,
        members:groupInfo.ma
    })
    groupQRInfo = {  //设置数据
        id: $groupInfo.groupId,
        logo:groupInfo.pu,
        name:groupInfo.n,
        members:groupInfo.ma
    }
    if(groupInfo.i != null && groupInfo.ci != undefined){
        var g = groupInfo[0];
        var name = groupInfo.n;
        var quitBtn = document.querySelector('.uc-group-quit-btn');
        var adminId = groupInfo.ci;
        var groupType = groupInfo.groupType;
        $groupInfo.adminId = adminId;
        $groupInfo.gNo = groupInfo.b;
        $groupInfo.membersList = groupInfo.ma;
        $groupInfo.groupName = name;
        var path = cmp.serverIp + "/seeyon" + groupInfo.pu + '&' + new Date().getTime();
        
        if (quitBtn && groupInfo.ma.length <=1 ) {
            quitBtn.style.display = 'none';
        } else {
            quitBtn.style.display = 'block';
        }

        _$(".uc-group-top-name").innerHTML = name;//群名
        _$(".uc-group-head").setAttribute("src",path);//头像
        
        if(adminId == $groupInfo.userId && groupType != 'DEPARTMENT'){
            $groupInfo.isAdmin = true; //确定自己是否是管理员
            var groupNameDom = _$(".uc-group-top-name");
            _$(".uc-group-disband-btn").style.display = "block";
            _$(".icon-edit").setAttribute("style","display:block;");
            _$(".icon-edit").style.left = groupNameDom.offsetLeft+groupNameDom.offsetWidth+10+'px';
            _$(".icon-edit").style.top = groupNameDom.offsetTop + 'px';
            // 点击群组名称调用修改群组名称页面
            changeGroupName();
            // 解散群
            removeGroup();
        } else {
            // _$(".icon-edit").style.dispaly = "none";
            _$(".icon-edit").setAttribute("style","display:none;");
            _$(".uc-group-disband-btn").style.display = "none";
        }

        // 如果当前群组为部门群，则隐藏“群二维码”，“退出群组”按钮
        if(groupType == 'DEPARTMENT'){
            _$(".uc-group-qrcode").setAttribute("style","display:none;");
            _$(".uc-group-quit-btn").setAttribute("style","display:none;");
        }
        
        // 加载群成员
        memberListDataCallback(groupInfo);

        // 退出群
        quitGroup();

        // 点击群公告跳转到群公告页面
        groupNotice();

        // 跳转人员名片
        jumpToMemberDetail();
    }else{
        //无groupinfo
        cmp.notification.alert(cmp.i18n("uc.m3.h5.canNotFind"),function(){
            cmp.href.back();
        },"",cmp.i18n("uc.m3.h5.ok"));
    }
}
/**
 * 群成员信息回调
 * @param result
 * group_members
 */
function memberListDataCallback(result){
    var groupMembers = result.ma
    var mLen = groupMembers.length;
    $groupInfo.groupMemberLength = mLen;
    var maxNum = 9;
    if(groupMembers != null && mLen > 0){
        var memberHeadTpl = document.getElementById("memberHeadLi").innerHTML;
        var memberListHtml = "";
        _$(".uc-g-m-num").innerHTML = mLen;
        var memberIdList = [];
        var sortMList = sortMemberList(groupMembers);
        for(var i = 0; i < mLen ; i++){
            var member = sortMList[i];
            var mid = member.id;
            var mname = member.name;
            var memberInfo = {
                id : mid,
                name : mname,
                adminId : result.ci,
                src : serverAdress + "/seeyon/rest/orgMember/avatar/"+mid+"?maxWidth=100"
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
        
        if($groupInfo.isAdmin){
            _$(".uc-group-m-add").style.display = "block";// 显示添加群组人员按钮
            _$(".add").style.display = "block";// 显示添加群组人员按钮
            _$(".uc-group-m-sub").style.display = "block";// 显示删除群组人员按钮
            _$(".sub").style.display = "block";// 显示删除群组人员按钮
            if(mLen >= (maxNum+2)){
                var more = _$(".more_member");
                if (!more) {
                    var pul = _$(".uc-group-member");
                    pul.innerHTML += "<div class=\"more_member\">"+ cmp.i18n("uc.m3.h5.seeMore") +" <span class=\"icon iconfont icon-PC-left-arrow\"></span></div>";
                    jumpToMore();
                }
            }
        } else {
            if(mLen > maxNum){
                var more = _$(".more_member");
                if (!more) {
                    var pul = _$(".uc-group-member");
                    pul.innerHTML += "<div class=\"more_member\">"+ cmp.i18n("uc.m3.h5.seeMore") +" <span class=\"icon iconfont icon-PC-left-arrow\"></span></div>";
                    jumpToMore();
                }
            }
        }
    }else{
        //无groupinfo
        cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetMemberData")+"！",function(){
            cmp.href.back();
        },"",cmp.i18n("uc.m3.h5.ok"));
    }
}


// 排序，将群主放到数组的第一位
function sortMemberList(mList){
    var newMemberList = [], adminArr = [], membersArr = [];
    for(var i = 0;i < mList.length;i++){
        var m = JSON.parse(mList[i]);
        if(m.id == $groupInfo.adminId){
            adminArr.unshift(JSON.parse(mList[i]));
        }else{
            membersArr.push(JSON.parse(mList[i]));
        }
    }
    membersArr = membersArr.sort(function(a,b){return a.sortId - b.sortId});
    newMemberList = adminArr.concat(membersArr);
    return newMemberList;
}

function jumpToMore(){
    cmp(".uc-group-member").on("tap", ".more_member", function (e) {
        var param = {
            groupId : $groupInfo.groupId,
            groupName : $groupInfo.groupName,
            isAdmin : $groupInfo.isAdmin
        };
        cmp.href.next(ucPath + "/html/ucShowMoreGroupMemberPage.html", param,{
            animated : true,
            direction : "left"
        });
    });
}
function changeGroupName(){
    // 如果是群主，才可以修改群名称
    cmp(".uc-group-top").on("tap", ".icon-edit", function (e) {
        var param = {
            groupId :  $groupInfo.groupId,
            groupName : _$(".uc-group-top-name").innerHTML
        };
        cmp.href.next(ucPath + "/html/ucChangeGroupNamePage.html", param, {
            animated: true,
            direction: "left"
        });
    });
}
function groupNotice(){
    cmp(".uc-group-data").on("tap", ".uc-group-notice", function (e) {
        var param = {
            groupId : $groupInfo.groupId,
            groupName : $groupInfo.groupName,
            isAdmin : $groupInfo.isAdmin,
            gNotice : $groupInfo.gNo
        };
        cmp.href.next(ucPath + "/html/ucGroupNoticePage.html", param, {
            animated: true,
            direction: "left"
        });
    });
}
function groupPic(){
    cmp(".uc-group-data").on("tap", ".uc-group-pic", function (e) {
        var param = {
            groupId : $groupInfo.groupId,
            adminId : $groupInfo.adminId
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
            groupId : $groupInfo.groupId,
            adminId : $groupInfo.adminId
        };
        cmp.href.next(ucPath + "/html/ucGroupFile.html", param, {
            animated: true,
            direction: "left"
        });
    });
}

function jumpToMemberDetail () {
    var memberList = document.querySelectorAll(".uc-group-m-list");
    for (var i = 0 ; i < memberList.length ; i++) {
        memberList[i].addEventListener("tap",function(){
            var memberId = this.querySelector(".uc-group-m-name").getAttribute('id').replace("n_","");
            var enableChat = false;
            memberId == $groupInfo.userId && (enableChat = true);

            var param = {
                page: 'ucGroupInfoPage',
                id: memberId,
                from: 'uc',
                enableChat: enableChat
            };
            cmp.visitingCard(memberId)
        });
    }
    
}

function delGroupMember(){
    cmp(".uc-group-member").on("tap", ".uc-group-m-sub", function (e) {
        cmp.href.next(ucPath + "/html/ucDelGroupMemberPage.html", $groupInfo, {
            animated: true,
            direction: "left"
        });
    });
}
function addGroupMember(){
    _$(".uc-group-m-add").addEventListener('tap',function(){
        cmp.dialog.loading();
        cmp.ajax({
            type: "GET",
            url: serverAdress + "/seeyon/rest/uc/rong/groups/bygid/" + $groupInfo.groupId,
            success: function (msg) {
                cmp.dialog.loading(false);
                selectMember(msg);
            },
            error: function (msg) {
                cmp.dialog.loading(false);
                console.log(msg);
                //进行错误处理
                // cmp.errorHandler(msg,function(){
                //     cmp.href.go('http://login.m3.cmp/v1.0.0/layout/login.html',{},'left');
                // });
                if (msg && msg.message) {
                    cmp.notification.alert(msg.message,function(){},"",cmp.i18n("uc.m3.h5.ok"));
                } else {
                    cmp.notification.alert(cmp.i18n("uc.m3.h5.failedGetMemberData"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
                }
            }
        });
    })
}

function selectMember (res) {
    var groupInfo = res.group;
    var groupMembers = groupInfo.ma;
    $groupInfo.groupMemberLength = groupMembers.length;
    if ($groupInfo.groupMemberLength >= 1000) {
        cmp.notification.alert(cmp.i18n("uc.m3.h5.limitReached"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
    } else {
        // 返回的群成员数据是json串，得转一下
        for (var j = 0, memberList = []; j < groupMembers.length; j++) {
            memberList.push({
                id: JSON.parse(groupMembers[j]).id,
                name: JSON.parse(groupMembers[j]).name,
                type: 'member',
            });
        }
        ucCommon.ucSelectMember({
            minSize: 1,
            label: ['org','extP'],
            notSelectAccount: true,
            choosableType: ['member'],
            maxSize: ucCommon.ucGroupTotal,
            callback: function(result){
                var resultObj = JSON.parse(result);
                var orgResult = resultObj.orgResult;
                var addMemberDataV5 = [];
                if(memberList.length == resultObj.orgResult.length){
                    return false;
                }
                if (orgResult.length > 0) {
                    for(var i = 0;i<orgResult.length;i++){
                        var peo = orgResult[i];
                        addMemberDataV5[i] = peo.id;
                    }
                    cmp.dialog.loading();
                    cmp.ajax({
                        type: "POST",
                        url: serverAdress + "/seeyon/rest/uc/rong/groups/join",
                        data:JSON.stringify({
                            groupId: $groupInfo.groupId,
                            memberId: addMemberDataV5.join(",")
                        }),
                        success: function (msg) {
                            cmp.dialog.loading(false);
                            renderAddGroupMember(orgResult,memberList);
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
                                cmp.notification.alert(cmp.i18n("uc.m3.h5.failedAddMembers"),function(){
                                    cmp.href.back();
                                },"",cmp.i18n("uc.m3.h5.ok"));
                            }
                        }
                    });
                    cmp.selectOrgDestory("select");
                }
            }
        }, memberList);
    }
}

// 渲染邀请的人员
function renderAddGroupMember (memberData,memberList) {
    var memberBox = _$('.uc-group-members');
    var quitBtn = _$('.uc-group-quit-btn');
    quitBtn.style.display = 'block';
    if (memberBox.children.length < 12) {
        var memberInfo = [];
        var html = "";
        var addIcon = _$('.add');
        var memberHeadTpl = document.getElementById("memberHeadLi").innerHTML;
        for (var i = 0; i < memberData.length; i++) {
            if (!memberList[i]) {
                memberInfo.push({
                    id : memberData[i].id,
                    name : memberData[i].name,
                    adminId : "",
                    src : serverAdress + "/seeyon/rest/orgMember/avatar/"+memberData[i].id+"?maxWidth=100"
                });
            }
        }
        for (var t = 0; t < (12 - memberBox.children.length); t++) {
            memberInfo[t] && (html += cmp.tpl(memberHeadTpl, memberInfo[t]));
        }
        cmp.before(addIcon,html);
        if (memberBox.children.length >= 12) {
            var moreMember = _$('.more_member');
            if (!moreMember) {
                var pul = _$(".uc-group-member");
                pul.innerHTML += "<div class=\"more_member\">"+cmp.i18n("uc.m3.h5.seeMore")+" <span class=\"icon iconfont icon-PC-left-arrow\"></span></div>";
                jumpToMore();
            }
        }
    } else {
        var moreMember = _$('.more_member');
        if (!moreMember) {
            var pul = _$(".uc-group-member");
            pul.innerHTML += "<div class=\"more_member\">"+cmp.i18n("uc.m3.h5.seeMore")+" <span class=\"icon iconfont icon-PC-left-arrow\"></span></div>";
            jumpToMore();
        }
        cmp.notification.toast(cmp.i18n("uc.m3.h5.addMemberSucceeded"),"top",1500);
    }
}

// 解散群租
function removeGroup(){
    _$(".uc-group-disband-btn").addEventListener("tap", function (e) {
        var confirm = cmp.notification.confirm(cmp.i18n("uc.m3.h5.sureDissolveGroup"),function(index){
            if(index == 1){
                cmp.dialog.loading();
                cmp.ajax({
                    type: "POST",
                    url: serverAdress + "/seeyon/rest/uc/rong/groups/dismiss",
                    data:JSON.stringify({
                        groupId: $groupInfo.groupId,
                        delete: "1"
                    }),
                    success: function (msg) {
                        cmp.dialog.loading(false);
                        console.log(msg);
                        cmp.chat.backPage({
                            index: "1",
                            type: "quitGroup", //quitGroup
                            data: JSON.stringify({
                                groupId: $groupInfo.groupId
                            }),
                            refresh: true,
                            success:function(){
                                console.log("解散群组成功")
                            },
                            error:function(){
                                console.log("解散群组失败")
                            }
                        })                
                    },
                    error: function (msg) {
                        cmp.dialog.loading(false);
                        console.log(msg);
                        //进行错误处理
                        if (msg && msg.message) {
                            cmp.notification.alert(msg.message,function(){},"",cmp.i18n("uc.m3.h5.ok"));
                        } else {
                            cmp.notification.alert(cmp.i18n("uc.m3.h5.dismissedGroupFailed"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
                        }
                    }
                });
            }else if(index == 0){
            }
        },cmp.i18n("uc.m3.h5.confirm"),[cmp.i18n("uc.m3.h5.cancel"),cmp.i18n("uc.m3.h5.ok")]);
    });
}

// 退出群组
function quitGroup () {
    _$(".uc-group-quit-btn").addEventListener("tap", function (e) {
        if($groupInfo.isAdmin){
            var confirm = cmp.notification.confirm(cmp.i18n("uc.m3.h5.sureQuitGroup"),function(index){
                if(index == 1){
                    cmp.href.next(ucPath + "/html/ucChangeGroupAdminPage.html", $groupInfo,{
                        animated : true,
                        direction : "left"
                    });
                }else if(index == 0){
                }
            },cmp.i18n("uc.m3.h5.confirm"),[cmp.i18n("uc.m3.h5.cancel"),cmp.i18n("uc.m3.h5.ok")]);
        } else {
            var confirm = cmp.notification.confirm(cmp.i18n("uc.m3.h5.sureQuitGroup"),function(index){
                if(index == 1){
                    cmp.dialog.loading();
                    cmp.ajax({
                        type: "POST",
                        url: serverAdress + "/seeyon/rest/uc/rong/groups/quit",
                        data:JSON.stringify({
                            groupId: $groupInfo.groupId,
                            memberId: $groupInfo.userId
                        }),
                        success: function (msg) {
                            cmp.dialog.loading(false);
                            console.log(msg);
                            cmp.chat.backPage({
                                index: "1",
                                type: "quitGroup", //quitGroup
                                data: JSON.stringify({
                                    groupId: $groupInfo.groupId
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
                            cmp.dialog.loading(false);
                            console.log(msg);
                            //进行错误处理
                            if (msg && msg.message) {
                                cmp.notification.alert(msg.message,function(){},"",cmp.i18n("uc.m3.h5.ok"));
                            } else {
                                cmp.notification.alert(cmp.i18n("uc.m3.h5.failureExitGroup"),function(){},"",cmp.i18n("uc.m3.h5.ok"));
                            }
                        }
                    });
                }else if(index == 0){
                }
            },cmp.i18n("uc.m3.h5.confirm"),[cmp.i18n("uc.m3.h5.cancel"),cmp.i18n("uc.m3.h5.ok")]);
        }
    });
}

function removeElement(_element){
    var _parentElement = _element.parentNode;
    if(_parentElement){
        _parentElement.removeChild(_element);
    }
}

// 获取页面开关状态
function getFlagStatus () {
    cmp.chat.getGroupSettings({
        id: $groupInfo.groupId,
        success: function(res){
            console.log("获取开关状态成功")
            console.log(res);
            var alertStatus = res.alertStatus;
            var topStatus = res.topStatus;
            var toTopBlock = document.getElementById("uc-group-toTop");
            var recieveBlock = document.getElementById("uc-recieve-block");
            var toTopClassName = toTopBlock.className;
            var recieveClassName = recieveBlock.className;
            topStatus == '1' && toTopBlock.setAttribute("class",toTopClassName + " cmp-active");
            topStatus == '0' && toTopBlock.setAttribute("class",toTopClassName);
            alertStatus == '1' && recieveBlock.setAttribute("class",recieveClassName + " cmp-active");
            alertStatus == '0' && recieveBlock.setAttribute("class",recieveClassName);
        },
        error: function(err){
            console.log("获取开关状态失败")
            console.log(err);
        }
    });
}

// 会话置顶功能
function conversationToTop () {
    _$("#uc-group-toTop").addEventListener("touchend", function (e) {
        if (this.className.indexOf("cmp-active") != -1) {
            cmp.chat.setGroupSettings({
                type: "top",
                id: $groupInfo.groupId,
                status: '1',
                success: function(){
                    console.log("会话置顶成功");
                },
                error: function(){
                    console.log("会话置顶失败");
                    cmp.notification.alert(cmp.i18n("uc.m3.h5.stickyConversationFaild"),function(){
                        this.setAttribute("class",this.className.replace("cmp-active",""));
                    },"",cmp.i18n("uc.m3.h5.ok"));
                }
            })
        } else {
            cmp.chat.setGroupSettings({
                type: "top",
                id: $groupInfo.groupId,
                status: '0',
                success: function(){
                    console.log("取消会话置顶成功");
                },
                error: function(){
                    console.log("取消会话置顶失败");
                    cmp.notification.alert(cmp.i18n("uc.m3.h5.cancelStickyConversationFaild"),function(){
                        this.setAttribute("class",this.className + " cmp-active");
                    },"",cmp.i18n("uc.m3.h5.ok"));
                }
            })
        }
    });
}

//初始化接收不提醒
function initRecieve() {
    _$("#uc-recieve-block").addEventListener("touchend", function (e) {
        console.log(this.className);
        if (this.className.indexOf("cmp-active") != -1) {
            cmp.chat.setGroupSettings({
                type: 'alert',
                id: $groupInfo.groupId,
                status: '1',
                success: function(){
                    console.log("设置消息免打扰成功");
                },
                error: function(){
                    console.log("设置消息免打扰失败");
                    cmp.notification.alert(cmp.i18n("uc.m3.h5.setMsgDisturbFailed"),function(){
                        this.setAttribute("class",this.className.replace("cmp-active",""));
                    },"",cmp.i18n("uc.m3.h5.ok"));
                }
            });
        } else {
            cmp.chat.setGroupSettings({
                type: 'alert',
                id: $groupInfo.groupId,
                status: '0',
                success: function(){
                    console.log("取消消息免打扰成功");
                },
                error: function(){
                    console.log("取消消息免打扰失败");
                    cmp.notification.alert(cmp.i18n("uc.m3.h5.cancalMsgDisturbFailed"),function(){
                        this.setAttribute("class",this.className.replace("cmp-active",""));
                    },"",cmp.i18n("uc.m3.h5.ok"));
                }
            });
        }
    });
}

// 清空聊天记录功能
function clearHistoryMsg () {
    _$(".uc-group-clearHistory").addEventListener("tap", function (e) {
        var confirm = cmp.notification.confirm(cmp.i18n("uc.m3.h5.whetherClearHistory"),function(index){
            if(index == 1){
                cmp.chat.clearGroupChat({
                    id: $groupInfo.groupId,
                    success: function(res){
                        console.log(res);
                    },
                    error: function(errorMsg){
                        console.log(errorMsg);
                    }
                });
            }else if(index == 0){
            }
        },cmp.i18n("uc.m3.h5.confirm"),[cmp.i18n("uc.m3.h5.cancel"),cmp.i18n("uc.m3.h5.ok")]);
});
}

function toQrcodeHtml(){
	_$('#uc-group-qrcode').addEventListener('click',function(){
		cmp.href.next(ucPath + "/html/qrcode.html", groupQRInfo ,{
            animated : true,
            direction : "left"
        });
	},false);
}




//修改人员头像
function modifyAvatar() {
    _$(".uc-group-head").addEventListener("tap", function (e) {
        if($groupInfo.isAdmin){
            var items = [{
                key: "2",
                name: '从手机相册选择'
            },{
                key: "1",
                name: '拍照'
            }];
            cmp.dialog.actionSheet(items, '取消', function(item) {
                if (item.key == "1") {
                    cmp.camera.getPictures({
                        sourceType: 1,
                        quality: 100,
                        destinationType: 1,
                        edit:true,
                        success: function(res) {
                            getPicSuccess(res)
                        },
                        error: function(res) {
                            // if(res.code == "56002"){
                            //     cmp.notification.alert(fI18nData['search.m3.h5.authority1']);
                            // }
                        }
                    });
                } else if (item.key == "2") {
                    cmp.camera.getPictures({
                        sourceType: 2,
                        quality: 100,
                        pictureNum: 1,
                        destinationType: 1,
                        // edit:true,
                        success: function(res) {
                            getPicSuccess(res)
                        },
                        error: function(res) {
                            // if(res.code == "56002"){
                            //     cmp.notification.alert(fI18nData['search.m3.h5.authority1']);
                            // }
                        }
                    });
                }
            },
            //点击取消的回调函数
            function(e) {});

        }
    });
}
//上传修改头像
function getPicSuccess(res) {
    imgFilePath = res.files[0].filepath;
    if ((res.files[0].type == "jpeg" || res.files[0].type == "png" || res.files[0].type == "gif" || res.files[0].type == "jpg") && parseInt(res.files[0].fileSize) < 5242880) {
        cmp.dialog.loading(true);
        cmp.att.upload({ //附件上传接口
            url: serverAdress + "/seeyon/rest/uc/rong/upload/avatar?avatarType=GROUP&groupId="+$groupInfo.groupId,
            fileList: [{
                filepath: imgFilePath //单个文件路径
            }],
            progress: function(result) {},
            success: function(uploadRes) {
              cmp.dialog.loading(false);
              $(".uc-group-head").attr("src", serverAdress+"/seeyon/rest/orgMember/groupavatar?ucFlag=yes&groupId="+$groupInfo.groupId+"&"+new Date().getTime());
            },
            error: function(error) {
                cmp.dialog.loading(false);
                // cmp.notification.toast(m3i18n[cmp.language].uploadPicFailed, "center");
            }
        });
    } else {
        // cmp.notification.toast(m3i18n[cmp.language].uploadPicTip, "center");
    }
}